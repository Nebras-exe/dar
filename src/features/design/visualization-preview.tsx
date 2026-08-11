"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import { getProductBySlug, type Product } from "@/lib/catalog";
import type { DemoScheme, VisualizationPreview } from "@/lib/visualization";
import { RoomIllustration } from "@/features/home/room-illustration";
import { ProductArt } from "@/components/shop/product-art";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

/** Room photo (or a labelled sample room) used as the "before" base. */
function RoomBase({ url, alt }: { url: string | null; alt: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element -- local object URL, never remote/optimized
    return <img src={url} alt={alt} className="size-full object-cover" />;
  }
  return <RoomIllustration variant="before" />;
}

/**
 * The demo "after" composition, rendered HONESTLY over the room photo: the same
 * photo, a restrained warm mood-wash derived deterministically from the design's
 * real catalog colours, and a tray of the actual product artwork. It is a
 * styling preview — clearly a demo composition, never presented as a real render.
 */
function DemoAfter({
  url,
  alt,
  scheme,
  products,
}: {
  url: string | null;
  alt: string;
  scheme: DemoScheme;
  products: Product[];
}) {
  const [a, b] = [scheme.palette[0] ?? "#E3D4BD", scheme.palette[1] ?? scheme.palette[0] ?? "#C9BFB1"];
  const tray = products.slice(0, 5);
  const extra = products.length - tray.length;

  return (
    <div className="relative size-full">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL, never remote/optimized
        <img src={url} alt={alt} className="size-full object-cover" />
      ) : (
        <RoomIllustration variant="after" />
      )}

      {/* Deterministic warm mood wash — restrained so the room stays visible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `linear-gradient(${scheme.overlayAngle}deg, ${a}, ${b})`,
          opacity: scheme.washStrength,
        }}
      />
      {/* Gentle scrim so the product tray reads over any photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{ backgroundImage: "linear-gradient(to top, rgba(38,32,25,0.55), transparent)" }}
      />

      {/* Tray of the real catalog pieces styled into the room. */}
      {tray.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
          {tray.map((p) => (
            <span
              key={p.slug}
              className="size-12 overflow-hidden rounded-lg ring-1 ring-white/40 shadow-[var(--shadow-sm)] sm:size-14"
            >
              <ProductArt product={p} className="size-full" />
            </span>
          ))}
          {extra > 0 && (
            <span className="flex size-12 items-center justify-center rounded-lg bg-charcoal/70 text-xs font-medium text-background ring-1 ring-white/30 backdrop-blur-sm sm:size-14">
              +{extra}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** The generated (real-provider) "after" — a returned image. */
function GeneratedAfter({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- provider data URL, not a remote asset
  return <img src={src} alt={alt} className="size-full object-cover" />;
}

/**
 * The before/after comparison for a produced preview. Reuses the shared slider
 * (accessible, RTL-aware, touch-friendly). `before` is always the untouched room;
 * `after` is the demo composition or the generated image.
 */
export function VisualizationCompare({
  dir,
  preview,
  roomUrl,
  labels,
}: {
  dir: "ltr" | "rtl";
  preview: VisualizationPreview;
  roomUrl: string | null;
  labels: { before: string; after: string; slider: string };
  locale: Locale;
}) {
  const products =
    preview.kind === "demo-composition"
      ? preview.scheme.items
          .map((i) => getProductBySlug(i.slug))
          .filter((p): p is Product => Boolean(p))
      : [];

  return (
    <BeforeAfterSlider
      dir={dir}
      beforeLabel={labels.before}
      afterLabel={labels.after}
      sliderLabel={labels.slider}
      before={<RoomBase url={roomUrl} alt={labels.before} />}
      after={
        preview.kind === "generated" ? (
          <GeneratedAfter src={preview.imageDataUrl} alt={labels.after} />
        ) : (
          <DemoAfter url={roomUrl} alt={labels.after} scheme={preview.scheme} products={products} />
        )
      }
    />
  );
}
