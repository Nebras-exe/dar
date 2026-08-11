/**
 * Per-room furnishing plans. Each design room type maps to a catalog `RoomType`
 * (for filtering products) and to an ordered list of catalog categories that
 * make a sensible demo room — essentials first. This is deterministic demo
 * logic: it demonstrates "don't replace everything" without pretending Athathi
 * detected anything from an image.
 */

import type { CategorySlug, RoomType } from "@/lib/catalog";
import type { DesignRoomType } from "./types";

export interface CategoryNeed {
  category: CategorySlug;
  /** Essentials anchor the room and are filled even under a tight budget. */
  essential: boolean;
}

interface RoomPlan {
  /** Catalog room used to filter candidate products. */
  catalogRoom: RoomType;
  /** Ordered category needs (priority high → low). */
  needs: CategoryNeed[];
}

const PLANS: Record<DesignRoomType, RoomPlan> = {
  "living-room": {
    catalogRoom: "living-room",
    needs: [
      { category: "sofas", essential: true },
      { category: "rugs", essential: false },
      { category: "coffee-tables", essential: false },
      { category: "lighting", essential: false },
      { category: "tv-units", essential: false },
      { category: "decor", essential: false },
    ],
  },
  bedroom: {
    catalogRoom: "bedroom",
    needs: [
      { category: "beds", essential: true },
      { category: "side-tables", essential: false },
      { category: "wardrobes", essential: false },
      { category: "rugs", essential: false },
      { category: "lighting", essential: false },
      { category: "decor", essential: false },
    ],
  },
  majlis: {
    catalogRoom: "majlis",
    needs: [
      { category: "sofas", essential: true },
      { category: "rugs", essential: false },
      { category: "coffee-tables", essential: false },
      { category: "lighting", essential: false },
      { category: "decor", essential: false },
    ],
  },
  "dining-room": {
    catalogRoom: "dining-room",
    needs: [
      { category: "dining", essential: true },
      { category: "chairs", essential: false },
      { category: "lighting", essential: false },
      { category: "rugs", essential: false },
      { category: "decor", essential: false },
    ],
  },
  office: {
    catalogRoom: "office",
    needs: [
      { category: "desks", essential: true },
      { category: "chairs", essential: false },
      { category: "storage", essential: false },
      { category: "lighting", essential: false },
      { category: "decor", essential: false },
    ],
  },
  // Kids room uses bedroom products but a calmer, storage-forward plan.
  "kids-room": {
    catalogRoom: "bedroom",
    needs: [
      { category: "beds", essential: true },
      { category: "storage", essential: false },
      { category: "rugs", essential: false },
      { category: "lighting", essential: false },
      { category: "decor", essential: false },
    ],
  },
  outdoor: {
    catalogRoom: "outdoor",
    needs: [
      { category: "outdoor", essential: true },
      { category: "lighting", essential: false },
      { category: "decor", essential: false },
    ],
  },
};

export function getRoomPlan(roomType: DesignRoomType): RoomPlan {
  return PLANS[roomType];
}

export function getCatalogRoom(roomType: DesignRoomType): RoomType {
  return PLANS[roomType].catalogRoom;
}

/** The categories a user can decide to keep/replace for a given room. */
export function getDecisionCategories(roomType: DesignRoomType): CategorySlug[] {
  return PLANS[roomType].needs.map((n) => n.category);
}
