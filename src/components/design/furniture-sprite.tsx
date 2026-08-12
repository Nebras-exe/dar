/**
 * Furniture sprite — a single catalog piece drawn for placement IN a room.
 *
 * Distinct from `ProductArt`, which is studio photography for a product card:
 * that art frames every piece identically on an opaque backdrop. A sprite has no
 * backdrop at all and fills a normalised 100×100 box that the composition layer
 * stretches to the piece's REAL projected width and height — so a 240 cm sofa
 * and a 45 cm side table come out at their true relative size in the room.
 *
 * Forms are front elevations: what you'd see standing across the room. They are
 * deliberately simple, honestly stylised shapes tinted with the product's real
 * catalog swatch — never a claim to be a photograph of the item.
 *
 * Server-renderable (no hooks, no client JS) and deterministic per product.
 */

import * as React from "react";
import type { CategorySlug, ColorId, Product } from "@/lib/catalog";

/** Mix a hex colour toward black (amount<0) or white (amount>0), amount −1..1. */
function shade(hex: string, amount: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const t = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (c: number) => Math.round((t - c) * p + c);
  const to2 = (c: number) => c.toString(16).padStart(2, "0");
  return `#${to2(mix(r))}${to2(mix(g))}${to2(mix(b))}`;
}

interface Tones {
  body: string;
  lo: string;
  hi: string;
  cushion: string;
  leg: string;
}

/** Resolve the selected variant's real swatch into a small shading ramp. */
function tones(product: Product, colorId?: ColorId): Tones {
  const chosen = colorId
    ? product.colors.find((c) => c.id === colorId)
    : product.colors[0];
  const body = chosen?.hex ?? product.colors[0]?.hex ?? "#D8C9B0";
  const woodish = product.materials.some((m) =>
    ["walnut", "oak", "ash", "teak"].includes(m),
  );
  return {
    body,
    lo: shade(body, -0.2),
    hi: shade(body, 0.16),
    cushion: shade(body, 0.08),
    leg: woodish ? shade(body, -0.32) : "#5b4632",
  };
}

/**
 * Category forms in a 0..100 box. The box IS the piece's real bounding box, so
 * every form is drawn edge to edge: `x=0` is the piece's left edge and `y=100`
 * is where it meets the floor.
 */
function form(category: CategorySlug, c: Tones): React.ReactNode {
  switch (category) {
    case "sofas":
      return (
        <>
          {/* back */}
          <rect x="2" y="8" width="96" height="56" rx="9" fill={c.body} />
          {/* arms */}
          <rect x="0" y="30" width="16" height="58" rx="7" fill={c.hi} />
          <rect x="84" y="30" width="16" height="58" rx="7" fill={c.lo} />
          {/* seat */}
          <rect x="12" y="52" width="76" height="36" rx="6" fill={c.cushion} />
          <line x1="50" y1="55" x2="50" y2="85" stroke={shade(c.cushion, -0.14)} strokeWidth="1.5" />
          {/* legs */}
          <rect x="10" y="88" width="6" height="12" fill={c.leg} />
          <rect x="84" y="88" width="6" height="12" fill={c.leg} />
        </>
      );
    case "chairs":
      return (
        <>
          <rect x="18" y="0" width="64" height="52" rx="10" fill={c.body} />
          <rect x="18" y="0" width="64" height="16" rx="8" fill={c.hi} />
          <rect x="12" y="48" width="76" height="18" rx="5" fill={c.cushion} />
          <rect x="18" y="66" width="6" height="34" fill={c.leg} />
          <rect x="76" y="66" width="6" height="34" fill={c.leg} />
        </>
      );
    case "coffee-tables":
    case "side-tables":
      return (
        <>
          <rect x="0" y="6" width="100" height="16" rx="5" fill={c.body} />
          <rect x="0" y="6" width="100" height="6" rx="3" fill={c.hi} />
          <rect x="10" y="22" width="7" height="78" fill={c.leg} />
          <rect x="83" y="22" width="7" height="78" fill={c.leg} />
        </>
      );
    case "dining":
      return (
        <>
          <rect x="0" y="4" width="100" height="12" rx="4" fill={c.body} />
          <rect x="0" y="4" width="100" height="5" rx="3" fill={c.hi} />
          <rect x="9" y="16" width="8" height="84" fill={c.leg} />
          <rect x="83" y="16" width="8" height="84" fill={c.leg} />
        </>
      );
    case "beds":
      return (
        <>
          {/* headboard behind, mattress in front */}
          <rect x="4" y="0" width="92" height="44" rx="7" fill={c.body} />
          <rect x="0" y="44" width="100" height="34" rx="6" fill={c.cushion} />
          <rect x="0" y="44" width="100" height="10" rx="5" fill={c.hi} />
          <rect x="12" y="30" width="30" height="16" rx="6" fill={shade(c.cushion, 0.3)} />
          <rect x="58" y="30" width="30" height="16" rx="6" fill={shade(c.cushion, 0.3)} />
          <rect x="2" y="78" width="96" height="10" rx="3" fill={c.lo} />
          <rect x="6" y="88" width="6" height="12" fill={c.leg} />
          <rect x="88" y="88" width="6" height="12" fill={c.leg} />
        </>
      );
    case "storage":
    case "tv-units":
      return (
        <>
          <rect x="0" y="4" width="100" height="86" rx="4" fill={c.body} />
          <rect x="0" y="4" width="100" height="8" rx="4" fill={c.hi} />
          <line x1="50" y1="12" x2="50" y2="90" stroke={c.lo} strokeWidth="1.5" />
          <circle cx="42" cy="52" r="2.5" fill={c.leg} />
          <circle cx="58" cy="52" r="2.5" fill={c.leg} />
          <rect x="6" y="90" width="6" height="10" fill={c.leg} />
          <rect x="88" y="90" width="6" height="10" fill={c.leg} />
        </>
      );
    case "wardrobes":
      return (
        <>
          <rect x="0" y="0" width="100" height="97" rx="3" fill={c.body} />
          <rect x="0" y="0" width="100" height="7" rx="3" fill={c.hi} />
          <rect x="0" y="0" width="50" height="97" rx="3" fill={c.lo} opacity="0.4" />
          <line x1="50" y1="4" x2="50" y2="94" stroke={shade(c.body, -0.3)} strokeWidth="1.5" />
          <rect x="45" y="42" width="2.5" height="16" rx="1" fill={c.leg} />
          <rect x="52.5" y="42" width="2.5" height="16" rx="1" fill={c.leg} />
          <rect x="2" y="97" width="96" height="3" fill={c.leg} />
        </>
      );
    case "desks":
      return (
        <>
          <rect x="0" y="2" width="100" height="12" rx="4" fill={c.body} />
          <rect x="0" y="2" width="100" height="5" rx="3" fill={c.hi} />
          <rect x="62" y="14" width="34" height="34" rx="3" fill={c.lo} />
          <line x1="62" y1="31" x2="96" y2="31" stroke={shade(c.lo, 0.12)} strokeWidth="1.2" />
          <rect x="6" y="14" width="7" height="86" fill={c.leg} />
          <rect x="88" y="48" width="7" height="52" fill={c.leg} />
        </>
      );
    case "lighting":
      return (
        <>
          <path d="M26 0 L74 0 L64 34 L36 34 Z" fill={c.cushion} />
          <path d="M26 0 L74 0 L70 12 L30 12 Z" fill={c.hi} />
          <rect x="47" y="34" width="6" height="60" fill={shade(c.body, -0.25)} />
          <ellipse cx="50" cy="96" rx="22" ry="4" fill={c.lo} />
        </>
      );
    case "mirrors":
      return (
        <>
          <rect x="0" y="0" width="100" height="100" rx="46" fill={c.body} />
          <rect x="8" y="8" width="84" height="84" rx="40" fill="#e8eef0" opacity="0.72" />
          <path d="M26 72 L64 26" stroke="#ffffff" strokeWidth="7" opacity="0.5" strokeLinecap="round" />
        </>
      );
    case "rugs":
      // Rugs are drawn as a floor quad by the composition, never as a sprite;
      // this is only a fallback if one is ever placed upright.
      return <rect x="0" y="70" width="100" height="30" rx="3" fill={c.body} />;
    case "decor":
      return (
        <>
          <path
            d="M34 32 C26 60 32 92 50 100 C68 92 74 60 66 32 C61 14 53 12 50 26 C47 12 39 14 34 32 Z"
            fill={c.body}
          />
          <path d="M34 32 C40 24 60 24 66 32 C62 18 54 12 50 26 C46 12 38 18 34 32 Z" fill={c.hi} />
        </>
      );
    case "outdoor":
      return (
        <>
          <rect x="0" y="24" width="100" height="52" rx="9" fill={c.body} />
          <rect x="0" y="24" width="100" height="16" rx="8" fill={c.hi} />
          <rect x="8" y="76" width="7" height="24" fill={c.leg} />
          <rect x="85" y="76" width="7" height="24" fill={c.leg} />
        </>
      );
    default:
      return (
        <>
          <rect x="0" y="12" width="100" height="78" rx="6" fill={c.body} />
          <rect x="0" y="12" width="100" height="14" rx="6" fill={c.hi} />
          <rect x="8" y="90" width="6" height="10" fill={c.leg} />
          <rect x="86" y="90" width="6" height="10" fill={c.leg} />
        </>
      );
  }
}

export interface FurnitureSpriteProps {
  product: Product;
  colorId?: ColorId;
  className?: string;
}

/**
 * The sprite fills its container exactly (`preserveAspectRatio="none"`), because
 * the container has already been sized to the piece's real projected footprint.
 * Stretching is intended here — it is what makes the scale truthful.
 */
export function FurnitureSprite({ product, colorId, className }: FurnitureSpriteProps) {
  const c = tones(product, colorId);
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {form(product.category, c)}
    </svg>
  );
}
