import { cn } from "@/lib/utils";

export interface RoomIllustrationProps {
  /** "after" shows a fully furnished, warm room; "before" shows a bare room. */
  variant?: "after" | "before";
  className?: string;
}

/**
 * An original, editorial illustration of an interior — the homepage + before/after
 * visual anchor. No external/stock imagery; drawn from the Athathi palette with
 * soft depth (ambient light, contact shadows, layered furniture) so the
 * "before → after" story reads as a premium studio scene. Purely decorative
 * (aria-hidden); meaningful captions live in the surrounding markup.
 */
export function RoomIllustration({
  variant = "after",
  className,
}: RoomIllustrationProps) {
  const furnished = variant === "after";
  return (
    <svg
      viewBox="0 0 800 600"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
    >
      <defs>
        <linearGradient id="ri-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={furnished ? "#F4ECDD" : "#EBE2D0"} />
          <stop offset="1" stopColor={furnished ? "#EFE6D4" : "#E4DAC6"} />
        </linearGradient>
        <linearGradient id="ri-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={furnished ? "#DDC9A9" : "#D4C09E"} />
          <stop offset="1" stopColor={furnished ? "#CBB287" : "#C2A97F"} />
        </linearGradient>
        <linearGradient id="ri-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF7E6" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFF7E6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ri-ambient" cx="62%" cy="34%" r="55%">
          <stop offset="0" stopColor="#FFF3DC" stopOpacity={furnished ? 0.6 : 0.28} />
          <stop offset="1" stopColor="#FFF3DC" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Walls + floor */}
      <rect x="0" y="0" width="800" height="410" fill="url(#ri-wall)" />
      <rect x="0" y="410" width="800" height="190" fill="url(#ri-floor)" />
      <line x1="0" y1="410" x2="800" y2="410" stroke="#C6B08C" strokeWidth="2" />
      {/* Skirting */}
      <rect x="0" y="404" width="800" height="8" fill={furnished ? "#E7DBC4" : "#DCCFB4"} />
      {/* Ambient warm glow from the window */}
      <rect x="0" y="0" width="800" height="600" fill="url(#ri-ambient)" />

      {/* Window with warm light */}
      <g>
        <rect x="486" y="66" width="244" height="258" rx="6" fill="#6B4A32" />
        <rect x="498" y="78" width="220" height="234" rx="3" fill={furnished ? "#F6EFE1" : "#E9EDEA"} />
        <rect x="498" y="78" width="220" height="234" rx="3" fill="url(#ri-light)" opacity={furnished ? 0.95 : 0.4} />
        <line x1="608" y1="78" x2="608" y2="312" stroke="#6B4A32" strokeWidth="6" />
        <line x1="498" y1="195" x2="718" y2="195" stroke="#6B4A32" strokeWidth="6" />
        {/* Light spill onto the floor (after) */}
        {furnished && <path d="M498 410 L718 410 L676 470 L556 470 Z" fill="#FFF3D8" opacity="0.35" />}
      </g>

      {/* Framed wall art (after) */}
      {furnished && (
        <g>
          <rect x="92" y="112" width="128" height="158" rx="4" fill="#6B4A32" />
          <rect x="102" y="122" width="108" height="138" rx="2" fill="#F5EDDE" />
          <path d="M102 226 L148 168 L182 208 L214 174 L214 260 L102 260 Z" fill="#C98A5E" />
          <circle cx="140" cy="154" r="13" fill="#9A5B3B" />
          <path d="M102 244 q54 -18 108 0" stroke="#B4703F" strokeWidth="3" fill="none" opacity="0.5" />
        </g>
      )}

      {/* Rug (after) */}
      {furnished && (
        <g>
          <ellipse cx="410" cy="516" rx="308" ry="60" fill="#C98A5E" opacity="0.92" />
          <ellipse cx="410" cy="516" rx="308" ry="60" fill="none" stroke="#9A5B3B" strokeWidth="3" opacity="0.5" />
          <ellipse cx="410" cy="516" rx="256" ry="46" fill="none" stroke="#B4703F" strokeWidth="2" opacity="0.4" />
          <ellipse cx="410" cy="516" rx="200" ry="34" fill="none" stroke="#A8632E" strokeWidth="1.5" opacity="0.35" />
        </g>
      )}

      {/* Sofa (after) — layered for depth */}
      {furnished && (
        <g>
          <ellipse cx="410" cy="474" rx="228" ry="26" fill="#2A2015" opacity="0.08" />
          {/* base */}
          <rect x="236" y="358" width="348" height="100" rx="24" fill="#B4A68C" />
          {/* back */}
          <rect x="252" y="296" width="316" height="122" rx="26" fill="#CBBFAD" />
          {/* back cushions */}
          <rect x="266" y="312" width="140" height="76" rx="16" fill="#D8CDBB" />
          <rect x="414" y="312" width="140" height="76" rx="16" fill="#CFC3B0" />
          {/* seat cushions */}
          <rect x="262" y="360" width="150" height="60" rx="16" fill="#D2C6B2" />
          <rect x="418" y="360" width="150" height="60" rx="16" fill="#C9BCA6" />
          {/* soft top light */}
          <rect x="262" y="360" width="306" height="22" rx="12" fill="#FFFFFF" opacity="0.16" />
          {/* arms */}
          <rect x="228" y="332" width="44" height="128" rx="20" fill="#D0C4B0" />
          <rect x="548" y="332" width="44" height="128" rx="20" fill="#BEB098" />
          {/* throw pillow */}
          <rect x="286" y="330" width="60" height="60" rx="14" fill="#9A5B3B" opacity="0.9" transform="rotate(-8 316 360)" />
          {/* legs */}
          <rect x="262" y="454" width="12" height="26" rx="4" fill="#6B4A32" />
          <rect x="546" y="454" width="12" height="26" rx="4" fill="#6B4A32" />
        </g>
      )}

      {/* Coffee table (after) */}
      {furnished && (
        <g>
          <ellipse cx="410" cy="506" rx="96" ry="22" fill="#2A2015" opacity="0.08" />
          <ellipse cx="410" cy="500" rx="94" ry="22" fill="#7A5A40" />
          <ellipse cx="410" cy="494" rx="94" ry="22" fill="#8A6A4A" />
          <ellipse cx="392" cy="490" rx="40" ry="9" fill="#9A7A58" opacity="0.6" />
          <rect x="360" y="502" width="10" height="34" rx="3" fill="#6B4A32" />
          <rect x="450" y="502" width="10" height="34" rx="3" fill="#6B4A32" />
          {/* small vase on the table */}
          <path d="M400 470 q-8 18 0 26 q10 4 18 0 q8 -8 0 -26 z" fill="#5E6A53" />
        </g>
      )}

      {/* Floor lamp (after) */}
      {furnished && (
        <g>
          <rect x="132" y="300" width="8" height="196" rx="4" fill="#2A2521" />
          <path d="M104 300 Q136 258 168 300 Z" fill="#EFE4C9" />
          <path d="M104 300 Q136 258 168 300" fill="none" stroke="#D8C9A6" strokeWidth="2" />
          <ellipse cx="136" cy="332" rx="30" ry="10" fill="#FFF3D8" opacity="0.5" />
          <ellipse cx="136" cy="498" rx="34" ry="10" fill="#2A2521" />
        </g>
      )}

      {/* Plant (after) */}
      {furnished && (
        <g>
          <path d="M636 470 q-28 -70 -8 -128" stroke="#5E6A53" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M636 470 q26 -60 6 -120" stroke="#6E7A62" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="616" cy="330" rx="17" ry="32" fill="#5E6A53" transform="rotate(-18 616 330)" />
          <ellipse cx="654" cy="342" rx="17" ry="32" fill="#6E7A62" transform="rotate(16 654 342)" />
          <ellipse cx="636" cy="312" rx="15" ry="30" fill="#66735A" />
          <path d="M610 470 h52 l-9 42 h-34 z" fill="#9A5B3B" />
          <path d="M610 476 h52" stroke="#834B2F" strokeWidth="2" opacity="0.5" />
        </g>
      )}

      {/* Before: a bare room — one lonely stool + boxes waiting */}
      {!furnished && (
        <g>
          <ellipse cx="330" cy="488" rx="48" ry="12" fill="#2A2015" opacity="0.05" />
          <rect x="300" y="430" width="60" height="14" rx="4" fill="#B7A587" />
          <rect x="306" y="444" width="8" height="44" rx="3" fill="#9C8A6C" />
          <rect x="346" y="444" width="8" height="44" rx="3" fill="#9C8A6C" />
          {/* stacked moving boxes in the corner */}
          <g opacity="0.85">
            <rect x="590" y="446" width="70" height="50" rx="3" fill="#CBB894" />
            <rect x="590" y="446" width="70" height="12" fill="#BBA57E" />
            <rect x="606" y="404" width="58" height="44" rx="3" fill="#D3C1A0" />
            <line x1="620" y1="446" x2="632" y2="446" stroke="#9C8A6C" strokeWidth="3" />
          </g>
        </g>
      )}
    </svg>
  );
}
