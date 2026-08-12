"use client";

import * as React from "react";
import { getProductBySlug, type Product } from "@/lib/catalog";
import {
  createCamera,
  projectPlan,
  quadToPercent,
  type ProjectedPiece,
  type RoomPlan,
} from "@/lib/visualization";
import { FurnitureSprite } from "@/components/design/furniture-sprite";
import { RoomIllustration } from "@/features/home/room-illustration";

/**
 * The "after" composition: the user's OWN room photo with the design's real
 * catalog pieces placed into it.
 *
 * Each piece is positioned from the deterministic floor plan and sized from its
 * real catalog dimensions against the room the user measured, then projected
 * with the assumed one-point camera. Nothing is generated and nothing is
 * fabricated — it is a scale sketch drawn over the photo, and it stays labelled
 * as a preview.
 */
export function RoomComposition({
  url,
  alt,
  plan,
  wash,
}: {
  url: string | null;
  alt: string;
  plan: RoomPlan;
  /** The deterministic mood wash from the demo scheme. */
  wash: { angle: number; strength: number; from: string; to: string };
}) {
  // Resolve once; a slug that vanished from the catalog is simply not drawn.
  const pieces = React.useMemo(() => {
    const camera = createCamera(plan.space);
    return projectPlan(camera, plan.placements)
      .pieces.map((piece) => {
        const product = getProductBySlug(piece.item.slug);
        return product ? { piece, product } : null;
      })
      .filter((p): p is { piece: ProjectedPiece; product: Product } => p !== null);
  }, [plan.space, plan.placements]);

  return (
    <div className="relative size-full overflow-hidden">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL, never remote/optimized
        <img src={url} alt={alt} className="size-full object-cover" />
      ) : (
        <RoomIllustration variant="after" />
      )}

      {/* Restrained mood wash from the design's own catalog colours. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `linear-gradient(${wash.angle}deg, ${wash.from}, ${wash.to})`,
          opacity: wash.strength,
        }}
      />

      {/* The placed pieces, back to front. */}
      {pieces.map(({ piece, product }, i) => {
        const key = `${piece.item.slug}-${i}`;

        // Rugs lie on the floor — a projected quad, not an upright box.
        if (piece.kind === "flat") {
          const hex =
            (piece.item.colorId
              ? product.colors.find((c) => c.id === piece.item.colorId)?.hex
              : undefined) ??
            product.colors[0]?.hex ??
            "#C9BFB1";
          return (
            <div
              key={key}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ zIndex: 1 }}
            >
              <div
                className="size-full opacity-80"
                style={{
                  backgroundColor: hex,
                  clipPath: `polygon(${quadToPercent(piece.quad)})`,
                }}
              />
            </div>
          );
        }

        const { box } = piece;
        return (
          <div
            key={key}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: `${box.left * 100}%`,
              top: `${box.top * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 10 + box.depthOrder,
              filter: "drop-shadow(0 6px 10px rgba(30,24,16,0.28))",
            }}
          >
            <FurnitureSprite
              product={product}
              colorId={piece.item.colorId}
              className="size-full"
            />
          </div>
        );
      })}
    </div>
  );
}
