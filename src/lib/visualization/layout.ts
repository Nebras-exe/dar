/**
 * Deterministic room LAYOUT planner (Phase 07b).
 *
 * Turns a design's real catalog products + the user's room dimensions into a
 * floor plan: where each piece stands, in metres, measured from the room's
 * front-left corner. The composition layer then projects that plan onto the
 * user's own room photo.
 *
 * Everything here is application code, never a model:
 *  - every footprint comes from the product's REAL `dimensions` (cm → m);
 *  - slots are fixed per room type, so the same design always plans the same way;
 *  - a piece that cannot fit inside the room footprint is reported as `unplaced`
 *    rather than being shrunk to fit or quietly dropped.
 *
 * It is a *design preview*, never a measurement or a guarantee of physical fit —
 * the same honesty contract the rest of the visualization layer holds to.
 *
 * Pure and free of React/server imports so it runs on the client, on the server,
 * and in Node tests.
 */

import { getProductBySlug, type CategorySlug } from "@/lib/catalog";
import type { DesignRoomType } from "@/lib/design";
import type {
  PlacedItem,
  RoomPlan,
  RoomSpace,
  VisualizationItemRef,
} from "./types";

// ── Room defaults ────────────────────────────────────────────────────────────

/** Ceiling height assumed when the user doesn't supply one. */
export const DEFAULT_CEILING_M = 2.8;

/**
 * A plausible room footprint per room type, used ONLY when the user hasn't
 * entered their own. The UI must label a preview built on these as assumed.
 */
const DEFAULT_FOOTPRINT: Record<DesignRoomType, { widthM: number; lengthM: number }> = {
  "living-room": { widthM: 4.5, lengthM: 5.5 },
  majlis: { widthM: 5.0, lengthM: 6.0 },
  bedroom: { widthM: 4.0, lengthM: 4.5 },
  "dining-room": { widthM: 4.0, lengthM: 5.0 },
  office: { widthM: 3.2, lengthM: 3.6 },
  "kids-room": { widthM: 3.4, lengthM: 3.8 },
  outdoor: { widthM: 5.0, lengthM: 5.0 },
};

/** The room space to plan against: the user's own, or a labelled default. */
export function resolveRoomSpace(
  roomType: DesignRoomType,
  space: RoomSpace | undefined,
): { space: Required<RoomSpace>; assumed: boolean } {
  if (space) {
    return {
      space: {
        widthM: space.widthM,
        lengthM: space.lengthM,
        heightM: space.heightM ?? DEFAULT_CEILING_M,
      },
      assumed: false,
    };
  }
  const fallback = DEFAULT_FOOTPRINT[roomType] ?? DEFAULT_FOOTPRINT["living-room"];
  return {
    space: { ...fallback, heightM: DEFAULT_CEILING_M },
    assumed: true,
  };
}

// ── Category behaviour ───────────────────────────────────────────────────────

/** Pieces that lie flat on the floor — drawn as a floor quad, never collided. */
const FLAT_CATEGORIES: CategorySlug[] = ["rugs"];

/** Pieces that hang on a wall — no floor footprint, so they never collide. */
const MOUNTED_CATEGORIES: CategorySlug[] = ["mirrors"];

export function isFlatCategory(c: CategorySlug): boolean {
  return FLAT_CATEGORIES.includes(c);
}

export function isMountedCategory(c: CategorySlug): boolean {
  return MOUNTED_CATEGORIES.includes(c);
}

// ── Slots ────────────────────────────────────────────────────────────────────

/**
 * One physical position in the room. `fx`/`fz` are fractions of width/length
 * (0 = left / near, 1 = right / far). `wall` pins the piece's back edge to that
 * wall so it never floats. Ordered lists below are matched greedily.
 */
interface Slot {
  categories: CategorySlug[];
  fx: number;
  fz: number;
  wall?: "back" | "front" | "left" | "right";
}

const GAP_M = 0.08; // breathing room between a piece and the wall it backs onto

/** Living-room / majlis: a conversation group facing a media wall. */
const SEATING_SLOTS: Slot[] = [
  { categories: ["rugs"], fx: 0.5, fz: 0.52 },
  { categories: ["sofas"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["coffee-tables"], fx: 0.5, fz: 0.56 },
  { categories: ["tv-units"], fx: 0.5, fz: 0, wall: "front" },
  { categories: ["chairs"], fx: 0.15, fz: 0.5, wall: "left" },
  { categories: ["chairs"], fx: 0.85, fz: 0.5, wall: "right" },
  { categories: ["side-tables"], fx: 0.14, fz: 0.86 },
  { categories: ["side-tables"], fx: 0.86, fz: 0.86 },
  { categories: ["lighting"], fx: 0.9, fz: 0.9 },
  { categories: ["storage", "desks"], fx: 0, fz: 0.28, wall: "left" },
  { categories: ["mirrors"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["decor"], fx: 0.38, fz: 0.56 },
  { categories: ["decor"], fx: 0.62, fz: 0.56 },
];

const BEDROOM_SLOTS: Slot[] = [
  { categories: ["rugs"], fx: 0.5, fz: 0.42 },
  { categories: ["beds"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["side-tables"], fx: 0.16, fz: 1, wall: "back" },
  { categories: ["side-tables"], fx: 0.84, fz: 1, wall: "back" },
  { categories: ["wardrobes"], fx: 0, fz: 0.4, wall: "left" },
  { categories: ["storage"], fx: 1, fz: 0.4, wall: "right" },
  { categories: ["desks"], fx: 1, fz: 0.15, wall: "right" },
  { categories: ["chairs"], fx: 0.82, fz: 0.2 },
  { categories: ["lighting"], fx: 0.12, fz: 0.16 },
  { categories: ["mirrors"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["decor"], fx: 0.5, fz: 0.42 },
];

const DINING_SLOTS: Slot[] = [
  { categories: ["rugs"], fx: 0.5, fz: 0.5 },
  { categories: ["dining"], fx: 0.5, fz: 0.5 },
  { categories: ["storage", "tv-units"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["lighting"], fx: 0.5, fz: 0.5 },
  { categories: ["chairs"], fx: 0.5, fz: 0.24 },
  { categories: ["chairs"], fx: 0.5, fz: 0.76 },
  { categories: ["chairs"], fx: 0.2, fz: 0.5 },
  { categories: ["chairs"], fx: 0.8, fz: 0.5 },
  { categories: ["mirrors"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["decor"], fx: 0.5, fz: 0.5 },
];

const OFFICE_SLOTS: Slot[] = [
  { categories: ["rugs"], fx: 0.5, fz: 0.5 },
  { categories: ["desks"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["chairs"], fx: 0.5, fz: 0.66 },
  { categories: ["storage", "wardrobes"], fx: 0, fz: 0.42, wall: "left" },
  { categories: ["side-tables"], fx: 1, fz: 0.5, wall: "right" },
  { categories: ["lighting"], fx: 0.88, fz: 0.86 },
  { categories: ["sofas"], fx: 1, fz: 0.2, wall: "right" },
  { categories: ["mirrors"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["decor"], fx: 0.5, fz: 0.5 },
];

const OUTDOOR_SLOTS: Slot[] = [
  { categories: ["rugs"], fx: 0.5, fz: 0.5 },
  { categories: ["outdoor", "sofas"], fx: 0.5, fz: 1, wall: "back" },
  { categories: ["coffee-tables", "side-tables"], fx: 0.5, fz: 0.55 },
  { categories: ["chairs"], fx: 0.18, fz: 0.5 },
  { categories: ["chairs"], fx: 0.82, fz: 0.5 },
  { categories: ["dining"], fx: 0.5, fz: 0.24 },
  { categories: ["lighting"], fx: 0.9, fz: 0.86 },
  { categories: ["decor"], fx: 0.12, fz: 0.86 },
];

const SLOTS_BY_ROOM: Record<DesignRoomType, Slot[]> = {
  "living-room": SEATING_SLOTS,
  majlis: SEATING_SLOTS,
  bedroom: BEDROOM_SLOTS,
  "kids-room": BEDROOM_SLOTS,
  "dining-room": DINING_SLOTS,
  office: OFFICE_SLOTS,
  outdoor: OUTDOOR_SLOTS,
};

/**
 * Deterministic fallback positions along the walls, used when a piece has no
 * matching free slot. Ordered so the room fills from the back outward.
 */
const FALLBACK_SLOTS: Slot[] = [
  { categories: [], fx: 0.22, fz: 1, wall: "back" },
  { categories: [], fx: 0.78, fz: 1, wall: "back" },
  { categories: [], fx: 0, fz: 0.7, wall: "left" },
  { categories: [], fx: 1, fz: 0.7, wall: "right" },
  { categories: [], fx: 0, fz: 0.24, wall: "left" },
  { categories: [], fx: 1, fz: 0.24, wall: "right" },
  { categories: [], fx: 0.3, fz: 0.34 },
  { categories: [], fx: 0.7, fz: 0.34 },
];

// ── Geometry helpers ─────────────────────────────────────────────────────────

interface Rect {
  x: number; // centre
  z: number; // centre
  w: number;
  d: number;
}

function overlaps(a: Rect, b: Rect): boolean {
  return (
    Math.abs(a.x - b.x) < (a.w + b.w) / 2 - 0.02 &&
    Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 0.02
  );
}

/** Clamp a centre so the whole footprint stays inside the room. */
function clampInside(rect: Rect, space: Required<RoomSpace>): Rect {
  const halfW = rect.w / 2;
  const halfD = rect.d / 2;
  return {
    ...rect,
    x: Math.min(Math.max(rect.x, halfW), space.widthM - halfW),
    z: Math.min(Math.max(rect.z, halfD), space.lengthM - halfD),
  };
}

/** Resolve a slot to a footprint centre, pinning to its wall when it has one. */
function slotCentre(slot: Slot, w: number, d: number, space: Required<RoomSpace>): Rect {
  let x = slot.fx * space.widthM;
  let z = slot.fz * space.lengthM;

  switch (slot.wall) {
    case "back":
      z = space.lengthM - d / 2 - GAP_M;
      break;
    case "front":
      z = d / 2 + GAP_M;
      break;
    case "left":
      x = w / 2 + GAP_M;
      break;
    case "right":
      x = space.widthM - w / 2 - GAP_M;
      break;
  }

  return clampInside({ x, z, w, d }, space);
}

/**
 * Nudge a footprint off its neighbours: first sideways, then deeper into the
 * room. Bounded and deterministic — returns null when no clear spot is found.
 */
function resolveCollision(
  rect: Rect,
  taken: Rect[],
  space: Required<RoomSpace>,
): Rect | null {
  if (!taken.some((t) => overlaps(rect, t))) return rect;

  const STEP = 0.15;
  for (let ring = 1; ring <= 16; ring++) {
    for (const [dx, dz] of [
      [ring * STEP, 0],
      [-ring * STEP, 0],
      [0, -ring * STEP],
      [ring * STEP, -ring * STEP],
      [-ring * STEP, -ring * STEP],
    ] as const) {
      const candidate = clampInside({ ...rect, x: rect.x + dx, z: rect.z + dz }, space);
      if (!taken.some((t) => overlaps(candidate, t))) return candidate;
    }
  }
  return null;
}

// ── The planner ──────────────────────────────────────────────────────────────

/**
 * Build the floor plan. Items are placed largest-footprint first so anchor
 * pieces (sofa, bed, dining table) claim their slot before accents do.
 *
 * Returns every piece it could place plus the slugs it could not, so the UI can
 * tell the user honestly rather than silently showing a partial room.
 */
export function planRoomLayout(
  roomType: DesignRoomType,
  items: readonly VisualizationItemRef[],
  space: RoomSpace | undefined,
): RoomPlan {
  const { space: room, assumed } = resolveRoomSpace(roomType, space);
  const slots = [...(SLOTS_BY_ROOM[roomType] ?? SEATING_SLOTS), ...FALLBACK_SLOTS];
  const usedSlots = new Set<number>();

  // Resolve every item to real catalog dimensions up front; drop anything that
  // no longer exists in the catalog (the caller already validated, but this file
  // never trusts a slug it hasn't resolved itself).
  const resolved = items
    .map((item) => {
      const product = getProductBySlug(item.slug);
      if (!product) return null;
      const { widthCm, depthCm, heightCm, diameterCm } = product.dimensions;
      // Round pieces expose a diameter instead of W×D.
      const w = (diameterCm ?? widthCm) / 100;
      const d = (diameterCm ?? depthCm) / 100;
      return {
        item,
        product,
        widthM: w,
        depthM: d,
        heightM: heightCm / 100,
        area: w * d,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  // Largest first, then by slug so ties are stable across runs.
  const ordered = [...resolved].sort(
    (a, b) => b.area - a.area || a.item.slug.localeCompare(b.item.slug),
  );

  const placements: PlacedItem[] = [];
  const unplaced: string[] = [];
  const taken: Rect[] = [];
  let usedArea = 0;

  for (const entry of ordered) {
    const { item, widthM, depthM, heightM } = entry;
    const flat = isFlatCategory(item.category);
    const mounted = isMountedCategory(item.category);
    const oversize = widthM > room.widthM || depthM > room.lengthM;

    // Find the first free slot that lists this category, else the next free
    // fallback position.
    let slotIndex = slots.findIndex(
      (s, i) => !usedSlots.has(i) && s.categories.includes(item.category),
    );
    if (slotIndex === -1) {
      slotIndex = slots.findIndex((s, i) => !usedSlots.has(i) && s.categories.length === 0);
    }
    if (slotIndex === -1) {
      unplaced.push(item.slug);
      continue;
    }
    usedSlots.add(slotIndex);

    const base = slotCentre(slots[slotIndex], widthM, depthM, room);

    // Rugs lie under everything and wall pieces hang clear of the floor, so
    // neither takes part in floor collision.
    let rect: Rect | null = base;
    if (!flat && !mounted) {
      rect = resolveCollision(base, taken, room);
      if (!rect) {
        unplaced.push(item.slug);
        continue;
      }
      taken.push(rect);
      usedArea += widthM * depthM;
    }

    placements.push({
      slug: item.slug,
      category: item.category,
      colorId: item.colorId,
      xM: Number(rect.x.toFixed(3)),
      zM: Number(rect.z.toFixed(3)),
      widthM: Number(widthM.toFixed(3)),
      depthM: Number(depthM.toFixed(3)),
      heightM: Number(heightM.toFixed(3)),
      flat,
      mounted,
      oversize,
    });
  }

  // Draw far pieces first so nearer ones overlap them correctly; rugs go under
  // everything regardless of depth.
  placements.sort((a, b) => {
    if (a.flat !== b.flat) return a.flat ? -1 : 1;
    return b.zM - a.zM;
  });

  const floorArea = room.widthM * room.lengthM;

  return {
    space: room,
    assumed,
    placements,
    unplaced,
    floorUsage: floorArea > 0 ? Number(Math.min(1, usedArea / floorArea).toFixed(3)) : 0,
  };
}
