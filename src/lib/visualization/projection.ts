/**
 * Floor-plan → photo projection (Phase 07b).
 *
 * Maps a metre-space floor plan onto the user's room photo using a simple
 * one-point perspective camera. Coordinates come out as fractions of the image
 * (0..1), so the composition layer can position pieces with plain CSS
 * percentages and stay resolution-independent.
 *
 * ⚠️ This is an ASSUMED camera, not a measured one. An ordinary photo carries no
 * focal length, no camera height and no room geometry, so the projection assumes
 * a straight-on shot from roughly standing height near the room's near edge.
 * The result is a styling preview — it never proves that a piece physically
 * fits, and the UI must say so.
 *
 * Pure: no React, no DOM, no server imports.
 */

import type { PlacedItem, RoomSpace } from "./types";

/** The assumed camera. Every value is a modelling choice, never a measurement. */
export interface Camera {
  /** Room footprint the plan was built against. */
  space: Required<RoomSpace>;
  /** Image-space v of the eye-level horizon. */
  horizon: number;
  /** Image-space v where the back wall meets the floor. */
  floorBack: number;
  /** Image-space v where the back wall meets the ceiling. */
  ceilBack: number;
  /** Fraction of the image width the room spans at the back wall. */
  spanBack: number;
  /** How far in front of the room's near edge the camera stands, in metres. */
  standbackM: number;
}

export const DEFAULT_CAMERA = {
  horizon: 0.42,
  floorBack: 0.6,
  ceilBack: 0.1,
  spanBack: 0.88,
  standbackM: 1.6,
} as const;

export function createCamera(
  space: Required<RoomSpace>,
  overrides: Partial<Omit<Camera, "space">> = {},
): Camera {
  return { space, ...DEFAULT_CAMERA, ...overrides };
}

/**
 * Perspective foreshortening at depth `z`: 1 at the camera plane, falling
 * towards 0 at infinity. Normalised against the back wall so the tuning
 * constants above describe the back wall directly.
 */
function foreshorten(cam: Camera, zM: number): number {
  const d0 = cam.standbackM;
  const pz = d0 / (zM + d0);
  const pBack = d0 / (cam.space.lengthM + d0);
  return pz / pBack;
}

/** A point on the floor, in image fractions. */
export interface ProjectedPoint {
  u: number;
  v: number;
  /** Relative scale at this depth (1 = back wall). */
  scale: number;
}

/** Project a floor point (metres from the front-left corner) into the image. */
export function projectFloorPoint(cam: Camera, xM: number, zM: number): ProjectedPoint {
  const scale = foreshorten(cam, zM);
  return {
    u: 0.5 + ((xM - cam.space.widthM / 2) / cam.space.widthM) * cam.spanBack * scale,
    v: cam.horizon + (cam.floorBack - cam.horizon) * scale,
    scale,
  };
}

/** An upright piece's box in the image, as CSS-ready fractions. */
export interface ProjectedBox {
  /** Left edge, fraction of image width. */
  left: number;
  /** Top edge, fraction of image height. */
  top: number;
  width: number;
  height: number;
  /** Larger = nearer the camera; use directly as a stacking order. */
  depthOrder: number;
  /** True when the piece projects so close it would swamp the frame. */
  tooClose: boolean;
}

/**
 * Project an upright piece. It is grounded on its FRONT bottom edge — the part
 * of a real object that visually meets the floor — and scaled from its real
 * width and height against the room's own dimensions.
 */
export function projectUpright(cam: Camera, item: PlacedItem): ProjectedBox {
  // Ground on the front edge; mounted pieces hang at eye level instead.
  const zFront = Math.max(0, item.zM - item.depthM / 2);
  const scale = foreshorten(cam, zFront);
  const wallHeight = cam.floorBack - cam.ceilBack;

  const width = (item.widthM / cam.space.widthM) * cam.spanBack * scale;
  const height = (item.heightM / cam.space.heightM) * wallHeight * scale;

  const centreU =
    0.5 + ((item.xM - cam.space.widthM / 2) / cam.space.widthM) * cam.spanBack * scale;

  // Mounted pieces hang with their centre a little above eye level; everything
  // else stands on the floor at this depth.
  const baseV = cam.horizon + (cam.floorBack - cam.horizon) * scale;
  const top = item.mounted ? cam.horizon - height * 0.75 : baseV - height;

  return {
    left: centreU - width / 2,
    top,
    width,
    height,
    depthOrder: Math.round(scale * 1000),
    // A photo taken from this camera simply doesn't show the strip of floor
    // right under the lens. A piece that lands there would be drawn wider than
    // the frame with its base off the bottom edge, so it is skipped instead —
    // the same way it would be out of shot in the real photo.
    tooClose: baseV > 1.15 || width > 1.5,
  };
}

/** A flat floor piece (a rug) as a projected quad, in image fractions. */
export interface ProjectedQuad {
  points: { u: number; v: number }[];
  depthOrder: number;
}

/** Project a rug's rectangle as a floor quad, corners in draw order. */
export function projectFloorRect(cam: Camera, item: PlacedItem): ProjectedQuad {
  const halfW = item.widthM / 2;
  const halfD = item.depthM / 2;
  const corners: [number, number][] = [
    [item.xM - halfW, item.zM + halfD], // far left
    [item.xM + halfW, item.zM + halfD], // far right
    [item.xM + halfW, item.zM - halfD], // near right
    [item.xM - halfW, item.zM - halfD], // near left
  ];
  const points = corners.map(([x, z]) => {
    const p = projectFloorPoint(cam, x, z);
    return { u: p.u, v: p.v };
  });
  return {
    points,
    depthOrder: Math.round(foreshorten(cam, item.zM) * 1000),
  };
}

/** Format a quad as an SVG/CSS `polygon()` point list in percentages. */
export function quadToPercent(quad: ProjectedQuad): string {
  return quad.points.map((p) => `${(p.u * 100).toFixed(2)}% ${(p.v * 100).toFixed(2)}%`).join(", ");
}

/** One piece ready to draw, discriminated by how it meets the floor. */
export type ProjectedPiece =
  | { kind: "flat"; item: PlacedItem; quad: ProjectedQuad }
  | { kind: "upright"; item: PlacedItem; box: ProjectedBox };

export interface ProjectedPlan {
  /** Drawable pieces, in the plan's back-to-front order. */
  pieces: ProjectedPiece[];
  /** Slugs this camera cannot show — too close to the lens to appear in shot. */
  outOfFrame: string[];
}

/**
 * Project a whole plan once. Shared by the composition (which draws the pieces)
 * and the panel that tells the user which pieces the preview left out, so the
 * two can never disagree about what is on screen.
 */
export function projectPlan(cam: Camera, placements: readonly PlacedItem[]): ProjectedPlan {
  const pieces: ProjectedPiece[] = [];
  const outOfFrame: string[] = [];

  for (const item of placements) {
    if (item.flat) {
      pieces.push({ kind: "flat", item, quad: projectFloorRect(cam, item) });
      continue;
    }
    const box = projectUpright(cam, item);
    if (box.tooClose) {
      outOfFrame.push(item.slug);
      continue;
    }
    pieces.push({ kind: "upright", item, box });
  }

  return { pieces, outOfFrame };
}
