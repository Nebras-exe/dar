import * as React from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Dimensions } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";

/**
 * Structured dimensions — a key Athathi differentiator and the basis for future
 * room-fit checks. Rendered from the numeric `Dimensions`, with localized
 * digits, so the same values that display here can be reasoned over by the AI.
 */
export function DimensionsDisplay({
  dimensions,
  t,
  locale,
}: {
  dimensions: Dimensions;
  t: Dictionary["shop"]["product"];
  locale: Locale;
}) {
  const rows: { label: string; value: number }[] = [];
  if (dimensions.diameterCm)
    rows.push({ label: t.dimDiameter, value: dimensions.diameterCm });
  else {
    rows.push({ label: t.dimWidth, value: dimensions.widthCm });
    rows.push({ label: t.dimDepth, value: dimensions.depthCm });
  }
  rows.push({ label: t.dimHeight, value: dimensions.heightCm });
  if (dimensions.seatHeightCm)
    rows.push({ label: t.dimSeatHeight, value: dimensions.seatHeightCm });

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {rows.map((r) => (
        <div
          key={r.label}
          className="rounded-lg border border-border-subtle bg-surface px-4 py-3"
        >
          <dt className="text-xs text-muted">{r.label}</dt>
          <dd className="mt-1 text-lg font-medium text-foreground tabular">
            {formatNumber(r.value, locale)}
            <span className="ms-1 text-sm font-normal text-subtle">{t.unitCm}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
