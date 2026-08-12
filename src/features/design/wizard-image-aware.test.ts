/**
 * Image-aware wizard behaviour (pure reducer/state). No network, no Vision calls.
 * Covers: AI-recommended style only claims a style when the room photo yielded
 * one (maps to a valid Athathi style id); with no image it stays empty and the
 * Style step is blocked (asks to upload); replacing/removing the image
 * invalidates the AI style; a manual pick takes control.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  reducer,
  initialState,
  canAdvance,
  recommendedStyleFrom,
  type WizardState,
} from "./wizard-state";
import type { RoomAnalysis } from "@/lib/vision";

// Style is step 4 (0-indexed): Upload → Room → Room-space → Budget → Style → …
const STYLE_STEP = 4;

function analysisWithStyle(primary: RoomAnalysis["style"]["primary"], confidence: number): RoomAnalysis {
  return {
    roomType: "living-room",
    roomTypeConfidence: 0.8,
    style: { primary, secondary: null, confidence },
    palette: [],
    existingFurniture: [],
    architecturalFeatures: [],
    dimensionsStatus: "unknown",
    source: "provider",
    provider: "test",
    promptVersion: "test",
  };
}

test("recommendedStyleFrom returns a valid style only above the confidence floor", () => {
  assert.equal(recommendedStyleFrom(null), undefined);
  assert.equal(recommendedStyleFrom(analysisWithStyle("warm-modern", 0.86)), "warm-modern");
  assert.equal(recommendedStyleFrom(analysisWithStyle("warm-modern", 0.3)), undefined);
  assert.equal(recommendedStyleFrom(analysisWithStyle(null, 0.9)), undefined);
});

test("AI-recommended with NO image → no style claimed, and the Style step is blocked", () => {
  const s = reducer({ ...initialState, step: STYLE_STEP }, { type: "SET_STYLE_MODE", mode: "ai-recommended" });
  assert.equal(s.draft.styleMode, "ai-recommended");
  assert.equal(s.draft.primaryStyle, undefined, "no fake style without a photo");
  assert.equal(canAdvance({ ...s, step: STYLE_STEP }), false, "must upload/analyse first");
});

test("AI-recommended with analysis → maps to the detected valid Athathi style, and can advance", () => {
  let s: WizardState = { ...initialState, step: STYLE_STEP };
  s = reducer(s, { type: "SET_ANALYSIS", analysis: analysisWithStyle("japandi", 0.82) });
  s = reducer(s, { type: "SET_STYLE_MODE", mode: "ai-recommended" });
  assert.equal(s.draft.primaryStyle, "japandi");
  assert.equal(canAdvance({ ...s, step: STYLE_STEP }), true);
});

test("choosing AI mode BEFORE analysis, then analysing, fills the style reactively", () => {
  let s: WizardState = { ...initialState };
  s = reducer(s, { type: "SET_STYLE_MODE", mode: "ai-recommended" });
  assert.equal(s.draft.primaryStyle, undefined);
  s = reducer(s, { type: "SET_ANALYSIS", analysis: analysisWithStyle("minimal", 0.9) });
  assert.equal(s.draft.primaryStyle, "minimal");
});

test("replacing/removing the image invalidates the AI-recommended style", () => {
  let s: WizardState = { ...initialState };
  s = reducer(s, { type: "SET_ANALYSIS", analysis: analysisWithStyle("boho", 0.9) });
  s = reducer(s, { type: "SET_STYLE_MODE", mode: "ai-recommended" });
  assert.equal(s.draft.primaryStyle, "boho");
  s = reducer(s, { type: "CLEAR_ANALYSIS" });
  assert.equal(s.draft.primaryStyle, undefined, "stale AI style dropped on image removal");
  assert.equal(s.analysis, null);
});

test("a manual style pick takes control (switches out of AI mode)", () => {
  let s: WizardState = { ...initialState };
  s = reducer(s, { type: "SET_ANALYSIS", analysis: analysisWithStyle("warm-modern", 0.9) });
  s = reducer(s, { type: "SET_STYLE_MODE", mode: "ai-recommended" });
  assert.equal(s.draft.styleMode, "ai-recommended");
  s = reducer(s, { type: "SET_PRIMARY_STYLE", style: "contemporary" });
  assert.equal(s.draft.styleMode, "manual");
  assert.equal(s.draft.primaryStyle, "contemporary");
});
