/**
 * Detected-furniture (Keep step) tests. Pure — no network, no paid Vision calls.
 * The Keep step's single source of truth is `detectedKeepItems(analysis)`: it must
 * surface ONLY furniture the room photo actually shows, confidence-filtered, and
 * never invent rows. Weak/absent detections must be dropped, not guessed.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { detectedKeepItems, KEEP_SHOW_CONFIDENCE, KEEP_MAYBE_CONFIDENCE } from "./mapping";
import type { RoomAnalysis, ExistingFurnitureItem } from "./types";

function furniture(over: Partial<ExistingFurnitureItem>): ExistingFurnitureItem {
  return {
    category: "sofas",
    rawLabel: "sofa",
    confidence: 0.9,
    approximateColorId: null,
    approximateMaterialId: null,
    suggestion: "unsure",
    ...over,
  };
}

function analysis(items: ExistingFurnitureItem[]): RoomAnalysis {
  return {
    roomType: "bedroom",
    roomTypeConfidence: 0.8,
    style: { primary: "warm-modern", secondary: null, confidence: 0.8 },
    palette: [],
    existingFurniture: items,
    architecturalFeatures: [],
    dimensionsStatus: "unknown",
    source: "provider",
    provider: "test",
    promptVersion: "test",
  };
}

test("null analysis → no detected items (no image = nothing shown)", () => {
  const { items, maybe } = detectedKeepItems(null);
  assert.deepEqual(items, []);
  assert.deepEqual(maybe, []);
});

test("shows only detected items — a bed + bedside table, never an undetected sofa", () => {
  const { items } = detectedKeepItems(
    analysis([
      furniture({ category: "beds", rawLabel: "bed", confidence: 0.92 }),
      furniture({ category: "side-tables", rawLabel: "bedside table", confidence: 0.81 }),
    ]),
  );
  const cats = items.map((i) => i.category);
  assert.deepEqual(cats, ["beds", "side-tables"]); // confidence-sorted
  assert.ok(!cats.includes("sofas"), "a sofa that wasn't detected never appears");
});

test("confidence threshold: ≥0.70 shown; 0.50–0.69 'maybe'; <0.50 dropped", () => {
  const { items, maybe } = detectedKeepItems(
    analysis([
      furniture({ category: "beds", confidence: KEEP_SHOW_CONFIDENCE }), // shown
      furniture({ category: "rugs", confidence: 0.6 }), // maybe
      furniture({ category: "desks", confidence: KEEP_MAYBE_CONFIDENCE - 0.01 }), // dropped
    ]),
  );
  assert.deepEqual(items.map((i) => i.category), ["beds"]);
  assert.deepEqual(maybe.map((i) => i.category), ["rugs"]);
});

test("empty room (no furniture, or all below threshold) → honest empty result", () => {
  assert.deepEqual(detectedKeepItems(analysis([])), { items: [], maybe: [] });
  const weak = detectedKeepItems(analysis([furniture({ category: "sofas", confidence: 0.3 })]));
  assert.deepEqual(weak, { items: [], maybe: [] });
});

test("detections with no mapped category are not actionable and are dropped", () => {
  const { items, maybe } = detectedKeepItems(
    analysis([furniture({ category: null, rawLabel: "unknown object", confidence: 0.95 })]),
  );
  assert.deepEqual(items, []);
  assert.deepEqual(maybe, []);
});

test("de-duplicates by category (highest-confidence detection wins)", () => {
  const { items } = detectedKeepItems(
    analysis([
      furniture({ category: "chairs", confidence: 0.72, suggestion: "replace" }),
      furniture({ category: "chairs", confidence: 0.88, suggestion: "keep" }),
    ]),
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].confidence, 0.88);
  assert.equal(items[0].suggestion, "keep");
});
