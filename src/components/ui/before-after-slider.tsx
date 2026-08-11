"use client";

import * as React from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BeforeAfterSliderProps {
  dir: "ltr" | "rtl";
  /** The base layer (revealed on the "after" side). */
  after: React.ReactNode;
  /** The clipped overlay (revealed on the "before" side, from the inline start). */
  before: React.ReactNode;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  /** Aspect ratio class for the frame (default 16/10). */
  aspectClassName?: string;
  className?: string;
  /** Initial handle position, 0..100. */
  initial?: number;
}

/**
 * A generic, accessible before/after comparison. Direction-aware (LTR + RTL clip
 * and inverted arrow keys), pointer-draggable anywhere on the frame, touch
 * friendly (`touch-pan-y` so vertical page scroll still works), and a real
 * `role="slider"` handle (Arrow/Home/End, `aria-valuenow`).
 *
 * The `before`/`after` layers are arbitrary nodes, so the same interaction backs
 * both the homepage illustration comparison (Phase 02) and the Phase 07 room
 * visualization — one component, not two.
 */
export function BeforeAfterSlider({
  dir,
  after,
  before,
  beforeLabel,
  afterLabel,
  sliderLabel,
  aspectClassName = "aspect-[16/10]",
  className,
  initial = 55,
}: BeforeAfterSliderProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState(initial);
  const draggingRef = React.useRef(false);

  const setFromClientX = React.useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      const logical = dir === "rtl" ? 100 - raw : raw;
      setPos(Math.min(100, Math.max(0, logical)));
    },
    [dir],
  );

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setFromClientX]);

  function onKeyDown(e: React.KeyboardEvent) {
    const forward = dir === "rtl" ? -5 : 5;
    if (e.key === "ArrowRight") {
      setPos((p) => Math.min(100, p + forward));
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      setPos((p) => Math.max(0, p - forward));
      e.preventDefault();
    } else if (e.key === "Home") {
      setPos(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setPos(100);
      e.preventDefault();
    }
  }

  // "Before" layer is revealed from the inline-start edge up to `pos`%.
  const clip =
    dir === "rtl" ? `inset(0 0 0 ${100 - pos}%)` : `inset(0 ${100 - pos}% 0 0)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full touch-pan-y select-none overflow-hidden rounded-xl bg-cream shadow-[var(--shadow-md)]",
        aspectClassName,
        className,
      )}
      onPointerDown={(e) => {
        draggingRef.current = true;
        setFromClientX(e.clientX);
      }}
    >
      {/* After (base) */}
      <div className="absolute inset-0">{after}</div>
      {/* Before (clipped overlay) */}
      <div className="absolute inset-0" style={{ clipPath: clip }}>
        {before}
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute bottom-3 start-3 rounded-full bg-charcoal/75 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute bottom-3 end-3 rounded-full bg-charcoal/75 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ insetInlineStart: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -ms-px w-0.5 bg-background/90" />
        <button
          type="button"
          role="slider"
          aria-label={sliderLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.stopPropagation();
          }}
          className={cn(
            "pointer-events-auto absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full",
            "-ms-5 cursor-ew-resize bg-elevated text-foreground shadow-[var(--shadow-md)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          )}
        >
          <MoveHorizontal className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
