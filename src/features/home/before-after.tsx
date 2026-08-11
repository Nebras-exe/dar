"use client";

import { RoomIllustration } from "./room-illustration";
import { BeforeAfterSlider as GenericBeforeAfterSlider } from "@/components/ui/before-after-slider";

export interface BeforeAfterProps {
  dir: "ltr" | "rtl";
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
}

/**
 * Homepage before/after: the original SVG interior illustration (bare "before" →
 * furnished "after"), driven by the shared, accessible `BeforeAfterSlider`. The
 * same slider backs the Phase 07 room visualization — one interaction, two uses.
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
      after={<RoomIllustration variant="after" />}
      before={<RoomIllustration variant="before" />}
    />
  );
}
