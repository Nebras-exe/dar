import * as React from "react";
import type { CategorySlug, MaterialId, Product } from "@/lib/catalog";

/**
 * Generated product artwork — an original, offline "studio photography" system.
 *
 * Real furniture photography is the eventual goal; until it exists, every card
 * needs to look like a considered, premium studio shot rather than a flat
 * placeholder. This component composes, deterministically per product:
 *   • a soft warm studio backdrop (radial wash + gentle floor plane + vignette),
 *   • a grounding contact shadow,
 *   • a category-specific furniture form rendered with DEPTH — a lit face, a
 *     shaded side, and a top highlight — tinted by the product's real swatches,
 *   • MATERIAL-aware surface treatment (fabric seams, wood grain, metal sheen,
 *     glass translucency, marble veining, leather sheen, rattan weave).
 *
 * Same product → same art (seeded), unique per product, no external assets, no
 * client JS. `ProductImage` swaps to `next/image` the moment real `images`
 * exist — this file is never touched then. It remains clearly DEMO imagery.
 */

interface Palette {
  bg0: string; // backdrop top
  bg1: string; // backdrop bottom
  floor: string; // floor plane
  wall: string; // subtle wall band
  accent: string; // ambient accent glow
  body: string; // main furniture fill (lit face)
  bodyLo: string; // shaded side
  bodyHi: string; // top highlight
  cushion: string; // secondary surface
  line: string; // outline
  wood: string; // wood/legs
  woodLo: string;
  cream: string;
}

type MaterialFamily =
  | "fabric"
  | "wood"
  | "metal"
  | "glass"
  | "stone"
  | "leather"
  | "rattan";

const LINE = "#3a352f";
const CREAM = "#efe7d9";

/** Deterministic small integer hash from a string (FNV-1a). */
function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

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

const WOOD_MATERIALS: MaterialId[] = ["walnut", "oak", "ash", "teak"];
const METAL_MATERIALS: MaterialId[] = ["metal", "brass", "steel"];
const STONE_MATERIALS: MaterialId[] = ["marble", "travertine", "stone", "ceramic"];
const FABRIC_MATERIALS: MaterialId[] = ["boucle", "linen", "velvet", "wool", "cotton"];

/** Classify the product's dominant material into a rendering family. */
function materialFamily(product: Product): MaterialFamily {
  const m = product.materials[0];
  if (!m) return "fabric";
  if (m === "leather") return "leather";
  if (m === "rattan") return "rattan";
  if (m === "glass") return "glass";
  if (WOOD_MATERIALS.includes(m)) return "wood";
  if (METAL_MATERIALS.includes(m)) return "metal";
  if (STONE_MATERIALS.includes(m)) return "stone";
  if (FABRIC_MATERIALS.includes(m)) return "fabric";
  return "fabric";
}

function palette(product: Product): Palette {
  const primary = product.colors[0]?.hex ?? "#dccbb0";
  const secondary = product.colors[1]?.hex ?? primary;
  return {
    // Warm neutral studio backdrop, faintly tinted by the piece so no two match.
    bg0: shade(primary, 0.8),
    bg1: shade(primary, 0.6),
    floor: shade(primary, 0.5),
    wall: shade(primary, 0.72),
    accent: shade(secondary, 0.42),
    body: primary,
    bodyLo: shade(primary, -0.16),
    bodyHi: shade(primary, 0.22),
    cushion: shade(secondary, 0.06),
    line: LINE,
    wood: "#6b4a32",
    woodLo: "#4f351f",
    cream: CREAM,
  };
}

export interface ProductArtProps {
  product: Product;
  /** Gallery angle: 0 = hero, 1..n shift the accent + framing for variety. */
  variant?: number;
  className?: string;
}

export function ProductArt({ product, variant = 0, className }: ProductArtProps) {
  const seed = seedFrom(product.slug + ":" + variant);
  const p = palette(product);
  const fam = materialFamily(product);
  const id = `${product.slug}-${variant}`;

  // Ambient accent glow drifts per product for subtle variety.
  const gx = 120 + (seed % 200);
  const gy = 90 + ((seed >> 3) % 90);

  const scene = renderScene(product.category, p, fam, seed, id);

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Studio backdrop: soft vertical wash. */}
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.bg0} />
          <stop offset="62%" stopColor={p.bg1} />
          <stop offset="100%" stopColor={p.floor} />
        </linearGradient>
        {/* Ambient warm glow behind the piece. */}
        <radialGradient id={`glow-${id}`} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
        {/* Corner vignette for a shot-in-a-studio depth. */}
        <radialGradient id={`vig-${id}`} cx="50%" cy="46%" r="72%">
          <stop offset="62%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a2f22" stopOpacity="0.16" />
        </radialGradient>
        {/* Fabric top-light: a soft highlight sweeping the seat. */}
        <linearGradient id={`fab-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Metal sheen. */}
        <linearGradient id={`met-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(p.body, -0.2)} />
          <stop offset="45%" stopColor={shade(p.body, 0.5)} />
          <stop offset="55%" stopColor={shade(p.body, 0.5)} />
          <stop offset="100%" stopColor={shade(p.body, -0.28)} />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="400" fill={`url(#bg-${id})`} />
      <ellipse cx={gx} cy={gy} rx="180" ry="150" fill={`url(#glow-${id})`} />
      {/* Faint wall/floor seam for grounding. */}
      <rect x="0" y="300" width="400" height="100" fill={p.floor} opacity="0.6" />
      <line x1="0" y1="300" x2="400" y2="300" stroke={shade(p.floor, -0.08)} strokeWidth="1.5" opacity="0.5" />

      {/* Contact shadow — soft, grounds the piece. */}
      <ellipse cx="200" cy="322" rx="140" ry="20" fill="#2a2015" opacity="0.14" />
      <ellipse cx="200" cy="322" rx="96" ry="12" fill="#2a2015" opacity="0.1" />

      {scene}

      {/* Vignette on top for depth. */}
      <rect width="400" height="400" fill={`url(#vig-${id})`} />
    </svg>
  );
}

/** Material surface overlay drawn INSIDE a rect region [x,y,w,h]. */
function materialOverlay(
  fam: MaterialFamily,
  x: number,
  y: number,
  w: number,
  h: number,
  p: Palette,
  id: string,
): React.ReactNode {
  switch (fam) {
    case "wood": {
      // Horizontal grain lines.
      const lines = [];
      const n = Math.max(2, Math.round(h / 14));
      for (let i = 1; i < n; i++) {
        const gy = y + (h * i) / n;
        lines.push(
          <line key={i} x1={x + 6} y1={gy} x2={x + w - 6} y2={gy} stroke={shade(p.body, -0.24)} strokeWidth="1.2" opacity="0.35" />,
        );
      }
      return <g>{lines}</g>;
    }
    case "metal":
      return <rect x={x} y={y} width={w} height={h} rx="6" fill={`url(#met-${id})`} opacity="0.6" />;
    case "glass":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx="6" fill="#ffffff" opacity="0.14" />
          <line x1={x + w * 0.28} y1={y + 4} x2={x + w * 0.12} y2={y + h - 4} stroke="#ffffff" strokeWidth="4" opacity="0.3" />
        </g>
      );
    case "stone": {
      // Marble veining.
      return (
        <g stroke={shade(p.body, -0.18)} strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round">
          <path d={`M${x + w * 0.2} ${y + 6} q ${w * 0.15} ${h * 0.3} ${w * 0.05} ${h * 0.7}`} />
          <path d={`M${x + w * 0.62} ${y + 4} q ${-w * 0.1} ${h * 0.4} ${w * 0.08} ${h * 0.8}`} />
        </g>
      );
    }
    case "leather":
      return <rect x={x + w * 0.1} y={y + 3} width={w * 0.8} height={h * 0.35} rx="10" fill="#ffffff" opacity="0.18" />;
    case "rattan": {
      const lines = [];
      const n = Math.max(3, Math.round(w / 16));
      for (let i = 1; i < n; i++) {
        const gx = x + (w * i) / n;
        lines.push(<line key={i} x1={gx} y1={y + 4} x2={gx} y2={y + h - 4} stroke={shade(p.body, -0.2)} strokeWidth="1.2" opacity="0.3" />);
      }
      return <g>{lines}</g>;
    }
    case "fabric":
    default:
      return <rect x={x} y={y} width={w} height={h} rx="10" fill={`url(#fab-${id})`} />;
  }
}

/** Category forms — each grounded near y≈300 with a lit face + shaded side. */
function renderScene(
  category: CategorySlug,
  p: Palette,
  fam: MaterialFamily,
  seed: number,
  id: string,
): React.ReactNode {
  const b = p.body;
  const lo = p.bodyLo;
  const hi = p.bodyHi;
  const cushion = p.cushion;
  const woodTint = shade(p.wood, ((seed % 5) - 2) / 20);
  const stroke = { stroke: p.line, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  switch (category) {
    case "sofas":
      return (
        <g {...stroke}>
          {/* base / shaded plinth */}
          <rect x="72" y="238" width="256" height="66" rx="16" fill={lo} />
          {/* back */}
          <rect x="76" y="172" width="248" height="86" rx="20" fill={b} />
          {/* arms */}
          <rect x="62" y="196" width="52" height="104" rx="20" fill={hi} />
          <rect x="286" y="196" width="52" height="104" rx="20" fill={lo} />
          {/* seat cushions */}
          <rect x="118" y="222" width="164" height="52" rx="14" fill={cushion} />
          <line x1="200" y1="226" x2="200" y2="270" stroke={shade(cushion, -0.14)} strokeWidth="2" />
          {/* back cushions */}
          <rect x="120" y="176" width="76" height="60" rx="14" fill={hi} />
          <rect x="204" y="176" width="76" height="60" rx="14" fill={b} />
          {materialOverlay(fam, 118, 222, 164, 52, p, id)}
          {/* legs */}
          <line x1="96" y1="304" x2="96" y2="324" stroke={woodTint} strokeWidth="7" />
          <line x1="304" y1="304" x2="304" y2="324" stroke={woodTint} strokeWidth="7" />
        </g>
      );
    case "chairs":
      return (
        <g {...stroke}>
          <rect x="150" y="120" width="108" height="118" rx="22" fill={b} />
          <rect x="150" y="120" width="108" height="40" rx="18" fill={hi} />
          <rect x="138" y="150" width="30" height="96" rx="12" fill={lo} />
          <rect x="248" y="150" width="30" height="96" rx="12" fill={hi} />
          <rect x="150" y="232" width="108" height="44" rx="14" fill={cushion} />
          {materialOverlay(fam, 150, 232, 108, 44, p, id)}
          <line x1="162" y1="276" x2="150" y2="324" stroke={woodTint} strokeWidth="7" />
          <line x1="248" y1="276" x2="262" y2="324" stroke={woodTint} strokeWidth="7" />
        </g>
      );
    case "coffee-tables":
    case "side-tables":
      return (
        <g {...stroke}>
          <ellipse cx="200" cy="236" rx="126" ry="26" fill={hi} />
          <ellipse cx="200" cy="230" rx="126" ry="26" fill={b} />
          {materialOverlay(fam, 84, 214, 232, 20, p, id)}
          <rect x="82" y="230" width="236" height="14" rx="7" fill={lo} />
          <line x1="112" y1="242" x2="112" y2="316" stroke={woodTint} strokeWidth="9" />
          <line x1="288" y1="242" x2="288" y2="316" stroke={woodTint} strokeWidth="9" />
          <line x1="112" y1="312" x2="288" y2="312" stroke={shade(woodTint, -0.1)} strokeWidth="6" />
        </g>
      );
    case "dining":
      return (
        <g {...stroke}>
          <rect x="66" y="176" width="268" height="24" rx="10" fill={b} />
          <rect x="66" y="176" width="268" height="10" rx="6" fill={hi} />
          {materialOverlay(fam, 70, 178, 260, 18, p, id)}
          <line x1="92" y1="200" x2="92" y2="316" stroke={woodTint} strokeWidth="10" />
          <line x1="308" y1="200" x2="308" y2="316" stroke={woodTint} strokeWidth="10" />
          <rect x="150" y="120" width="46" height="72" rx="12" fill={cushion} />
          <rect x="150" y="120" width="46" height="26" rx="10" fill={hi} />
          <line x1="160" y1="200" x2="160" y2="252" stroke={woodTint} strokeWidth="6" />
        </g>
      );
    case "beds":
      return (
        <g {...stroke}>
          <rect x="66" y="150" width="66" height="150" rx="14" fill={b} />
          <rect x="66" y="150" width="66" height="44" rx="14" fill={hi} />
          <rect x="66" y="248" width="286" height="60" rx="14" fill={lo} />
          <rect x="86" y="208" width="256" height="52" rx="16" fill={cushion} />
          {materialOverlay(fam, 86, 208, 256, 52, p, id)}
          <rect x="150" y="188" width="76" height="38" rx="16" fill={p.cream} />
          <rect x="238" y="188" width="76" height="38" rx="16" fill={hi} />
        </g>
      );
    case "storage":
    case "tv-units":
      return (
        <g {...stroke}>
          <rect x="66" y="196" width="268" height="104" rx="12" fill={b} />
          <rect x="66" y="196" width="268" height="20" rx="10" fill={hi} />
          {materialOverlay(fam, 70, 200, 260, 92, p, id)}
          <line x1="200" y1="200" x2="200" y2="296" stroke={lo} />
          <line x1="133" y1="200" x2="133" y2="296" stroke={lo} strokeWidth="1.6" />
          <line x1="267" y1="200" x2="267" y2="296" stroke={lo} strokeWidth="1.6" />
          <circle cx="167" cy="250" r="5" fill={p.wood} />
          <circle cx="233" cy="250" r="5" fill={p.wood} />
          <line x1="92" y1="300" x2="92" y2="320" stroke={woodTint} strokeWidth="7" />
          <line x1="308" y1="300" x2="308" y2="320" stroke={woodTint} strokeWidth="7" />
        </g>
      );
    case "wardrobes":
      return (
        <g {...stroke}>
          <rect x="118" y="96" width="164" height="208" rx="12" fill={b} />
          <rect x="118" y="96" width="164" height="30" rx="10" fill={hi} />
          <rect x="118" y="96" width="82" height="208" rx="12" fill={lo} opacity="0.5" />
          {materialOverlay(fam, 122, 128, 156, 168, p, id)}
          <line x1="200" y1="100" x2="200" y2="300" stroke={p.line} />
          <line x1="182" y1="180" x2="182" y2="216" stroke={p.wood} strokeWidth="6" />
          <line x1="218" y1="180" x2="218" y2="216" stroke={p.wood} strokeWidth="6" />
        </g>
      );
    case "desks":
      return (
        <g {...stroke}>
          <rect x="76" y="182" width="248" height="20" rx="8" fill={b} />
          <rect x="76" y="182" width="248" height="9" rx="6" fill={hi} />
          {materialOverlay(fam, 80, 184, 240, 14, p, id)}
          <rect x="236" y="202" width="76" height="58" rx="6" fill={lo} />
          <line x1="236" y1="230" x2="312" y2="230" stroke={shade(lo, 0.1)} strokeWidth="1.6" />
          <line x1="98" y1="202" x2="98" y2="316" stroke={woodTint} strokeWidth="9" />
          <line x1="300" y1="260" x2="300" y2="316" stroke={woodTint} strokeWidth="9" />
          <rect x="120" y="146" width="36" height="38" rx="6" fill={cushion} />
        </g>
      );
    case "rugs":
      return (
        <g {...stroke}>
          <g transform="rotate(-6 200 270)">
            <rect x="70" y="216" width="260" height="118" rx="8" fill={b} />
            <rect x="70" y="216" width="260" height="118" rx="8" fill={`url(#fab-${id})`} />
            <rect x="92" y="234" width="216" height="82" rx="6" fill="none" stroke={shade(b, -0.2)} strokeWidth="3" />
            <line x1="148" y1="234" x2="148" y2="316" stroke={shade(b, -0.16)} strokeWidth="2" />
            <line x1="252" y1="234" x2="252" y2="316" stroke={shade(b, -0.16)} strokeWidth="2" />
            {fam === "rattan" && materialOverlay("rattan", 92, 234, 216, 82, p, id)}
          </g>
        </g>
      );
    case "lighting":
      return (
        <g {...stroke}>
          <path d="M158 128 L242 128 L226 190 L174 190 Z" fill={cushion} />
          <path d="M158 128 L242 128 L234 152 L166 152 Z" fill={hi} />
          <line x1="200" y1="190" x2="200" y2="306" stroke={fam === "metal" ? shade(p.body, -0.1) : woodTint} strokeWidth="8" />
          <ellipse cx="200" cy="312" rx="52" ry="12" fill={lo} />
          <ellipse cx="200" cy="308" rx="52" ry="12" fill={b} />
          <line x1="174" y1="190" x2="226" y2="190" stroke={p.line} strokeWidth="3.4" />
        </g>
      );
    case "mirrors":
      return (
        <g {...stroke}>
          <path d="M136 300 L136 168 A64 64 0 0 1 264 168 L264 300 Z" fill={b} />
          <path d="M152 296 L152 172 A48 48 0 0 1 248 172 L248 296 Z" fill={p.bg0} opacity="0.9" />
          <path d="M170 264 L220 188" stroke="#ffffff" strokeWidth="7" opacity="0.5" />
          <path d="M186 276 L206 248" stroke="#ffffff" strokeWidth="4" opacity="0.4" />
        </g>
      );
    case "decor":
      return (
        <g {...stroke}>
          <path d="M176 208 C164 252 172 292 200 300 C228 292 236 252 224 208 C218 190 204 188 200 204 C196 188 182 190 176 208 Z" fill={b} />
          <path d="M176 208 C186 200 214 200 224 208 C220 196 206 190 200 204 C194 190 180 196 176 208 Z" fill={hi} />
          <ellipse cx="200" cy="206" rx="26" ry="8" fill={lo} />
          {materialOverlay(fam === "stone" || fam === "glass" ? fam : "fabric", 176, 214, 48, 70, p, id)}
        </g>
      );
    case "outdoor":
      return (
        <g {...stroke}>
          <rect x="86" y="234" width="180" height="58" rx="16" fill={b} />
          <rect x="86" y="234" width="180" height="22" rx="14" fill={hi} />
          {materialOverlay(fam === "rattan" ? "rattan" : "fabric", 90, 238, 172, 50, p, id)}
          <path d="M256 240 L322 176 L340 192 L282 254 Z" fill={cushion} />
          <line x1="108" y1="292" x2="108" y2="318" stroke={woodTint} strokeWidth="7" />
          <line x1="244" y1="292" x2="244" y2="318" stroke={woodTint} strokeWidth="7" />
          <circle cx="326" cy="120" r="20" fill={p.accent} opacity="0.85" />
        </g>
      );
    default:
      return (
        <g {...stroke}>
          <rect x="120" y="180" width="160" height="120" rx="16" fill={b} />
          <rect x="120" y="180" width="160" height="34" rx="14" fill={hi} />
        </g>
      );
  }
}
