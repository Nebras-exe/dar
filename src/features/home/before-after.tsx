"use client";

import Image from "next/image";
import { BeforeAfterSlider as GenericBeforeAfterSlider } from "@/components/ui/before-after-slider";

export interface BeforeAfterProps {
  dir: "ltr" | "rtl";
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
}

/** Shared sizing so both layers crop identically and stay aligned as the slider
 *  moves (same room, same camera — never crop Before and After differently). */
const LAYER_SIZES = "(max-width: 1024px) 100vw, 90vw";

/**
 * Homepage before/after: REAL room photography — the same empty room (before) and
 * its furnished redesign (after) — driven by the shared, accessible
 * `BeforeAfterSlider`. Both layers use identical `fill` + `object-cover` +
 * `object-center` so the room stays perfectly registered while dragging. The same
 * slider also backs the Phase 07 room visualization — one interaction, two uses.
 */
export function BeforeAfterSlider({
  dir,
  beforeLabel,
  afterLabel,
  sliderLabel,
}: BeforeAfterProps) {
  return (
    <GenericBeforeAfterSlider
      dir={dir}
      beforeLabel={beforeLabel}
      afterLabel={afterLabel}
      sliderLabel={sliderLabel}
      aspectClassName="aspect-[16/9]"
      after={
        <Image
          src="/images/before-after/room-after.webp"
          alt=""
          fill
          sizes={LAYER_SIZES}
          className="object-cover object-center"
        />
      }
      before={
        <Image
          src="/images/before-after/room-before.webp"
          alt=""
          fill
          sizes={LAYER_SIZES}
          className="object-cover object-center"
        />
      }
    />
  );
}
