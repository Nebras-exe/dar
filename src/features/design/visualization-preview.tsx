"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import type { DemoScheme, VisualizationPreview } from "@/lib/visualization";
import { RoomIllustration } from "@/features/home/room-illustration";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { RoomComposition } from "./room-composition";

/** Room photo (or a labelled sample room) used as the "before" base. */
function RoomBase({ url, alt }: { url: string | null; alt: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element -- local object URL, never remote/optimized
    return <img src={url} alt={alt} className="size-full object-cover" />;
  }
  return <RoomIllustration variant="before" />;
}

/**
 * The demo "after", rendered HONESTLY over the room photo: the design's real
 * catalog pieces placed into the room to scale, over the same photo, under a
 * restrained mood wash derived from the design's own catalog colours. It is a
 * styling preview — clearly a demo composition, never presented as a real render.
 */
function DemoAfter({
  url,
  alt,
  scheme,
}: {
  url: string | null;
  alt: string;
  scheme: DemoScheme;
}) {
  const from = scheme.palette[0] ?? "#E3D4BD";
  const to = scheme.palette[1] ?? scheme.palette[0] ?? "#C9BFB1";

  return (
    <RoomComposition
      url={url}
      alt={alt}
      plan={scheme.plan}
      wash={{ angle: scheme.overlayAngle, strength: scheme.washStrength, from, to }}
    />
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
          <DemoAfter url={roomUrl} alt={labels.after} scheme={preview.scheme} />
        )
      }
    />
  );
}
