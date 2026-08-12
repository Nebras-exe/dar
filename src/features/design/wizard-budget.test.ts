/**
 * Customer budget step — validation tests (node:test). Pure wizard logic; no
 * React. Confirms the free-form OMR budget accepts sensible values and rejects
 * empty / zero / negative / out-of-range amounts, and that a valid budget flows
 * into the structured `DesignInput` the Room Agent + engine consume.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  parseBudget,
  canAdvance,
  draftToInput,
  initialState,
  MIN_BUDGET,
  MAX_BUDGET,
  type WizardState,
} from "./wizard-state";

const BUDGET_STEP = 2;

function atBudgetStep(budgetText: string): WizardState {
  return {
    ...initialState,
    step: BUDGET_STEP,
    draft: { ...initialState.draft, roomType: "living-room", primaryStyle: "warm-modern", budgetText },
  };
}

test("parseBudget: strips currency text/separators and parses the number", () => {
  assert.equal(parseBudget("500"), 500);
  assert.equal(parseBudget("500 ر.ع"), 500);
  assert.equal(parseBudget("OMR 420"), 420);
  assert.equal(parseBudget("1,250"), 1250); // commas stripped
  // A leading minus is sanitised away — a negative budget cannot be entered.
  assert.equal(parseBudget("-100"), 100);
  assert.ok(Number.isNaN(parseBudget("")));
  assert.ok(Number.isNaN(parseBudget("abc")));
});

test("budget step accepts a valid OMR amount", () => {
  assert.equal(canAdvance(atBudgetStep("500")), true);
  assert.equal(canAdvance(atBudgetStep(String(MIN_BUDGET))), true);
  assert.equal(canAdvance(atBudgetStep("1200")), true);
});

test("budget step rejects empty / zero / too-low / too-high / non-numeric", () => {
  assert.equal(canAdvance(atBudgetStep("")), false);
  assert.equal(canAdvance(atBudgetStep("0")), false);
  assert.equal(canAdvance(atBudgetStep(String(MIN_BUDGET - 1))), false);
  assert.equal(canAdvance(atBudgetStep(String(MAX_BUDGET + 1))), false);
  assert.equal(canAdvance(atBudgetStep("abc")), false);
});

test("a valid budget flows into DesignInput.budget (numeric, for the agent/engine)", () => {
  const input = draftToInput(atBudgetStep("480").draft);
  assert.equal(input.budget, 480);
  assert.equal(typeof input.budget, "number");
});
