/**
 * Room layout + projection tests — Node's built-in runner (`npm test`).
 *
 * Both modules are pure: the planner turns real catalog dimensions into a floor
 * plan, and the projection turns that plan into image fractions. Neither touches
 * the network, an image, or a secret, so everything here is exact.
 */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

import { __setCatalogProductsForTests, __resetCatalogProductsForTests } from "../catalog";
import { makeProduct } from "../catalog/test-fixtures";
import { planRoomLayout, resolveRoomSpace, DEFAULT_CEILING_M } from "./layout";
import { createCamera, projectFloorPoint, projectFloorRect, projectUpright } from "./projection";
import { resolveRoomSpaceInput } from "./schema";
import type { RoomSpace, VisualizationItemRef } from "./types";

const SOFA = "test-lay-sofa"; // 240 × 95 × 85 cm
const RUG = "test-lay-rug"; // 300 × 200 × 2 cm
const TABLE = "test-lay-table"; // 120 × 60 × 40 cm
const MIRROR = "test-lay-mirror"; // 70 × 4 × 110 cm
const HUGE = "test-lay-huge"; // 900 cm wide — larger than any test room

before(() =>
  __setCatalogProductsForTests([
    makeProduct({
      slug: SOFA, category: "sofas", price: 400, colors: ["cream"], materials: ["boucle"],
      styleTags: ["warm-modern"], roomTypes: ["living-room"],
      dimensions: { widthCm: 240, depthCm: 95, heightCm: 85 },
    }),
    makeProduct({
      slug: RUG, category: "rugs", price: 90, colors: ["sand"], materials: ["wool"],
      styleTags: ["boho"], roomTypes: ["living-room"],
      dimensions: { widthCm: 300, depthCm: 200, heightCm: 2 },
    }),
    makeProduct({
      slug: TABLE, category: "coffee-tables", price: 120, colors: ["walnut"], materials: ["walnut"],
      styleTags: ["modern"], roomTypes: ["living-room"],
      dimensions: { widthCm: 120, depthCm: 60, heightCm: 40 },
    }),
    makeProduct({
      slug: MIRROR, category: "mirrors", price: 60, colors: ["brass"], materials: ["metal"],
      styleTags: ["modern"], roomTypes: ["living-room"],
      dimensions: { widthCm: 70, depthCm: 4, heightCm: 110 },
    }),
    makeProduct({
      slug: HUGE, category: "storage", price: 900, colors: ["oak"], materials: ["oak"],
      styleTags: ["modern"], roomTypes: ["living-room"],
      dimensions: { widthCm: 900, depthCm: 60, heightCm: 200 },
    }),
  ]),
);
after(() => __resetCatalogProductsForTests());

const ROOM: RoomSpace = { widthM: 4, lengthM: 5, heightM: 2.8 };

function refs(...slugs: string[]): VisualizationItemRef[] {
  const category = (slug: string) =>
    slug === RUG ? "rugs" : slug === TABLE ? "coffee-tables"
    : slug === MIRROR ? "mirrors" : slug === HUGE ? "storage" : "sofas";
  return slugs.map((slug) => ({ slug, category: category(slug) as never }));
}

// ── Room space resolution ────────────────────────────────────────────────────

test("room space: the user's measurements win; a missing one falls back and is flagged", () => {
  const measured = resolveRoomSpace("living-room", ROOM);
  assert.equal(measured.assumed, false);
  assert.equal(measured.space.widthM, 4);

  const assumed = resolveRoomSpace("living-room", undefined);
  assert.equal(assumed.assumed, true);
  assert.ok(assumed.space.widthM > 0 && assumed.space.lengthM > 0);
  assert.equal(assumed.space.heightM, DEFAULT_CEILING_M);
});

test("room space: a missing ceiling height gets the default, not zero", () => {
  const { space } = resolveRoomSpace("bedroom", { widthM: 3, lengthM: 4 });
  assert.equal(space.heightM, DEFAULT_CEILING_M);
});

test("schema: out-of-range or non-numeric room sizes are dropped, not clamped", () => {
  assert.equal(resolveRoomSpaceInput({ widthM: 0.2, lengthM: 4 }), undefined);
  assert.equal(resolveRoomSpaceInput({ widthM: 400, lengthM: 4 }), undefined);
  assert.equal(resolveRoomSpaceInput({ widthM: "4", lengthM: 5 }), undefined);
  assert.equal(resolveRoomSpaceInput({ widthM: 4 }), undefined); // length missing
  assert.deepEqual(resolveRoomSpaceInput({ widthM: 4, lengthM: 5 }), { widthM: 4, lengthM: 5 });
  // An implausible ceiling is dropped while the valid footprint survives.
  assert.deepEqual(resolveRoomSpaceInput({ widthM: 4, lengthM: 5, heightM: 40 }), {
    widthM: 4, lengthM: 5,
  });
});

// ── Planning ─────────────────────────────────────────────────────────────────

test("plan: every piece keeps its REAL catalog dimensions in metres", () => {
  const plan = planRoomLayout("living-room", refs(SOFA, TABLE), ROOM);
  const sofa = plan.placements.find((p) => p.slug === SOFA);
  assert.ok(sofa);
  assert.equal(sofa.widthM, 2.4);
  assert.equal(sofa.depthM, 0.95);
  assert.equal(sofa.heightM, 0.85);
});

test("plan: every footprint stays fully inside the room", () => {
  const plan = planRoomLayout("living-room", refs(SOFA, TABLE, RUG, MIRROR), ROOM);
  assert.ok(plan.placements.length > 0);
  for (const p of plan.placements) {
    assert.ok(p.xM - p.widthM / 2 >= -0.001, `${p.slug} crosses the left wall`);
    assert.ok(p.xM + p.widthM / 2 <= ROOM.widthM + 0.001, `${p.slug} crosses the right wall`);
    assert.ok(p.zM - p.depthM / 2 >= -0.001, `${p.slug} crosses the front wall`);
    assert.ok(p.zM + p.depthM / 2 <= ROOM.lengthM + 0.001, `${p.slug} crosses the back wall`);
  }
});

test("plan: floor-standing pieces never overlap each other", () => {
  const plan = planRoomLayout("living-room", refs(SOFA, TABLE), ROOM);
  const solid = plan.placements.filter((p) => !p.flat && !p.mounted);
  for (let i = 0; i < solid.length; i++) {
    for (let j = i + 1; j < solid.length; j++) {
      const a = solid[i];
      const b = solid[j];
      const overlap =
        Math.abs(a.xM - b.xM) < (a.widthM + b.widthM) / 2 - 0.02 &&
        Math.abs(a.zM - b.zM) < (a.depthM + b.depthM) / 2 - 0.02;
      assert.equal(overlap, false, `${a.slug} overlaps ${b.slug}`);
    }
  }
});

test("plan: a rug lies flat and a mirror is wall-mounted — neither blocks the floor", () => {
  const plan = planRoomLayout("living-room", refs(RUG, MIRROR, SOFA), ROOM);
  assert.equal(plan.placements.find((p) => p.slug === RUG)?.flat, true);
  assert.equal(plan.placements.find((p) => p.slug === MIRROR)?.mounted, true);
  // The rug covers the middle of the room but the sofa still gets placed.
  assert.ok(plan.placements.some((p) => p.slug === SOFA));
});

test("plan: rugs draw first, then far pieces before near ones", () => {
  const plan = planRoomLayout("living-room", refs(SOFA, TABLE, RUG), ROOM);
  assert.equal(plan.placements[0].flat, true, "the rug must be under everything");
  const upright = plan.placements.filter((p) => !p.flat);
  for (let i = 1; i < upright.length; i++) {
    assert.ok(upright[i - 1].zM >= upright[i].zM, "upright pieces must run back to front");
  }
});

test("plan: a piece bigger than the room is flagged, never silently shrunk", () => {
  const plan = planRoomLayout("living-room", refs(HUGE), { widthM: 3, lengthM: 3 });
  const huge = plan.placements.find((p) => p.slug === HUGE);
  // Either it is reported unplaced, or it is placed and marked oversize — but
  // its real 9 m width is never rewritten to fit.
  if (huge) {
    assert.equal(huge.oversize, true);
    assert.equal(huge.widthM, 9);
  } else {
    assert.ok(plan.unplaced.includes(HUGE));
  }
});

test("plan: deterministic — the same design plans identically every time", () => {
  const a = planRoomLayout("living-room", refs(SOFA, TABLE, RUG), ROOM);
  const b = planRoomLayout("living-room", refs(SOFA, TABLE, RUG), ROOM);
  assert.deepEqual(a, b);
});

test("plan: a slug missing from the catalog is dropped, never guessed at", () => {
  const plan = planRoomLayout("living-room", refs(SOFA, "does-not-exist"), ROOM);
  assert.equal(plan.placements.some((p) => p.slug === "does-not-exist"), false);
});

test("plan: a bigger room leaves the same furniture covering less floor", () => {
  const small = planRoomLayout("living-room", refs(SOFA, TABLE), { widthM: 3, lengthM: 3.5 });
  const big = planRoomLayout("living-room", refs(SOFA, TABLE), { widthM: 6, lengthM: 7 });
  assert.ok(small.floorUsage > big.floorUsage);
});

// ── Projection ───────────────────────────────────────────────────────────────

const CAM = createCamera({ widthM: 4, lengthM: 5, heightM: 2.8 });

test("projection: the room's centre line stays centred at every depth", () => {
  for (const z of [0, 1, 2.5, 5]) {
    const p = projectFloorPoint(CAM, 2, z);
    assert.ok(Math.abs(p.u - 0.5) < 1e-9, `centre drifted at z=${z}`);
  }
});

test("projection: the floor rises towards the horizon as it recedes", () => {
  const near = projectFloorPoint(CAM, 2, 0.5);
  const far = projectFloorPoint(CAM, 2, 4.5);
  assert.ok(far.v < near.v, "the far floor must sit higher in the frame");
  assert.ok(far.v > CAM.horizon, "the floor never crosses the horizon");
});

test("projection: an identical piece looks smaller further away", () => {
  const base = {
    slug: SOFA, category: "sofas" as const, widthM: 2.4, depthM: 0.95, heightM: 0.85,
    flat: false, mounted: false, oversize: false,
  };
  const near = projectUpright(CAM, { ...base, xM: 2, zM: 1 });
  const far = projectUpright(CAM, { ...base, xM: 2, zM: 4.5 });
  assert.ok(far.width < near.width);
  assert.ok(far.height < near.height);
  assert.ok(far.depthOrder < near.depthOrder, "nearer pieces must stack on top");
});

test("projection: relative size follows real dimensions, not category", () => {
  // Pieces are grounded on their FRONT edge, so compare two whose front edges
  // land at the same depth — otherwise their differing depths foreshorten them
  // differently and the comparison isn't about width at all.
  const common = { flat: false, mounted: false, oversize: false, xM: 2 };
  const sofa = projectUpright(CAM, {
    ...common, slug: SOFA, category: "sofas", zM: 3 + 0.95 / 2, widthM: 2.4, depthM: 0.95, heightM: 0.85,
  });
  const table = projectUpright(CAM, {
    ...common, slug: TABLE, category: "coffee-tables", zM: 3 + 0.6 / 2, widthM: 1.2, depthM: 0.6, heightM: 0.4,
  });
  // A 240 cm sofa must project exactly twice as wide as a 120 cm table at the
  // same depth — the whole point of scaling from real dimensions.
  assert.ok(Math.abs(sofa.width / table.width - 2) < 1e-9);
  // …and just over twice as tall (85 cm vs 40 cm).
  assert.ok(Math.abs(sofa.height / table.height - 0.85 / 0.4) < 1e-9);
});

test("projection: a full-height piece at the back wall fills the back wall", () => {
  const box = projectUpright(CAM, {
    slug: "x", category: "wardrobes", xM: 2, zM: 5, widthM: 4, depthM: 0.1, heightM: 2.8,
    flat: false, mounted: false, oversize: false,
  });
  // Its front face sits at z = 5 − 0.05, so allow a hair of foreshortening.
  assert.ok(Math.abs(box.height - (CAM.floorBack - CAM.ceilBack)) < 0.02);
  assert.ok(Math.abs(box.width - CAM.spanBack) < 0.02);
});

test("projection: a rug quad is wider at the near edge than the far edge", () => {
  const quad = projectFloorRect(CAM, {
    slug: RUG, category: "rugs", xM: 2, zM: 2.5, widthM: 3, depthM: 2,
    heightM: 0.02, flat: true, mounted: false, oversize: false,
  });
  const [farLeft, farRight, nearRight, nearLeft] = quad.points;
  assert.ok(nearRight.u - nearLeft.u > farRight.u - farLeft.u, "perspective must widen the near edge");
  assert.ok(nearLeft.v > farLeft.v, "the near edge must sit lower in the frame");
});

test("projection: a piece projected onto the lens is flagged rather than drawn", () => {
  const box = projectUpright(CAM, {
    slug: SOFA, category: "sofas", xM: 2, zM: 0, widthM: 2.4, depthM: 0.95, heightM: 0.85,
    flat: false, mounted: false, oversize: false,
  });
  assert.equal(box.tooClose, true);
});
