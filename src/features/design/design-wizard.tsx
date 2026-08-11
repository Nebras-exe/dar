"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import {
  canAdvance,
  deserialize,
  initialState,
  reducer,
  serialize,
  STORAGE_KEY,
  TOTAL_STEPS,
} from "./wizard-state";
import { WizardProgress } from "./wizard-progress";
import {
  BudgetStep,
  ExistingStep,
  PreferencesStep,
  ReviewStep,
  RoomStep,
  StyleStep,
  UploadStep,
} from "./steps";
import { DemoAnalysis } from "./demo-analysis";
import { DesignResult } from "./design-result";
import { MemorySeedCard } from "./memory-seed";
import { EngineBadge } from "./engine-badge";
import { RoomImageProvider } from "./room-image-context";

/**
 * The AI Designer wizard shell. Owns phase (brief → analysis → result), step
 * navigation, and localStorage persistence. Design computation is delegated
 * entirely to the pure engine via the reducer's `GENERATE` action — this
 * component never re-implements recommendation logic.
 */
export function DesignWizard({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  // The room photo is held in a session-scoped context (never persisted) so the
  // Phase 07 before/after preview can reuse it at the result phase.
  return (
    <RoomImageProvider>
      <DesignWizardInner dict={dict} locale={locale} />
    </RoomImageProvider>
  );
}

function DesignWizardInner({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.design;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const hydrated = state.hydrated;

  // Hydrate saved brief/result once on mount (client only). Dispatching in an
  // effect is fine — it's a reducer action, not a synchronous setState.
  React.useEffect(() => {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const restored = raw ? deserialize(raw) : null;
    // Never restore mid-analysis; drop back to the brief in that edge case.
    dispatch({
      type: "HYDRATE",
      state: restored
        ? restored.phase === "analysis"
          ? { ...restored, phase: "brief" }
          : restored
        : initialState,
    });
  }, []);

  // Persist after hydration.
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, serialize(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  // Scroll to top on phase/step change for a clean transition.
  React.useEffect(() => {
    if (!hydrated) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.phase, state.step, hydrated]);

  const advance = () => {
    if (state.step === TOTAL_STEPS - 1) {
      dispatch({ type: "GENERATE" });
    } else {
      dispatch({ type: "NEXT" });
    }
  };

  // ── Result phase ──────────────────────────────────────────────────────────
  if (state.phase === "result" && state.recommendation) {
    return (
      <Section spacing="md">
        <Container width="wide">
          <DesignResult
            state={state}
            dispatch={dispatch}
            recommendation={state.recommendation}
            t={t}
            tRoom={t.room.types}
            locale={locale}
          />
        </Container>
      </Section>
    );
  }

  // ── Analysis phase ────────────────────────────────────────────────────────
  if (state.phase === "analysis" && state.recommendation) {
    return (
      <Section spacing="md">
        <Container width="narrow">
          <DemoAnalysis
            steps={state.recommendation.demoSteps}
            t={{ ...t.analysis, demoModeBadge: t.demoMode }}
            locale={locale}
            onDone={() => dispatch({ type: "ANALYSIS_DONE" })}
          />
        </Container>
      </Section>
    );
  }

  // ── Brief phase (wizard) ──────────────────────────────────────────────────
  const stepProps = { state, dispatch, t, locale };
  const steps = [
    <UploadStep key="0" {...stepProps} />,
    <RoomStep key="1" {...stepProps} />,
    <BudgetStep key="2" {...stepProps} />,
    <StyleStep key="3" {...stepProps} />,
    <ExistingStep key="4" {...stepProps} />,
    <PreferencesStep key="5" {...stepProps} />,
    <ReviewStep key="6" {...stepProps} />,
  ];
  const isLast = state.step === TOTAL_STEPS - 1;
  const canGo = canAdvance(state);

  return (
    <Section spacing="md">
      <Container width="content">
        {/* Intro */}
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="text-eyebrow">{t.demoMode}</p>
            <EngineBadge t={dict.design.engine} />
          </div>
          <h1 className="text-3xl sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-lg text-muted">{t.subtitle}</p>
        </div>

        {/* Saved-style offer (Phase 13) — surfaced with consent, never applied silently. */}
        {state.step <= 3 && (
          <MemorySeedCard
            t={dict.designMemory}
            onApplyStyle={(style) => dispatch({ type: "SET_PRIMARY_STYLE", style })}
          />
        )}

        {/* Progress */}
        <div className="mb-8">
          <WizardProgress
            names={t.stepNames}
            current={state.step}
            locale={locale}
            labels={{ step: t.stepLabel, of: t.ofLabel, progress: t.progressLabel }}
            onJump={(step) => dispatch({ type: "GO_TO_STEP", step })}
          />
        </div>

        {/* Active step. Rendered immediately (content-first); the entrance
            animation re-runs per step via the key. */}
        <div className="min-h-[20rem]" key={state.step}>
          <div className="animate-fade-up">{steps[state.step]}</div>
        </div>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "BACK" })}
            disabled={state.step === 0}
            iconStart={<ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />}
          >
            {t.back}
          </Button>

          {isLast ? (
            <Button
              size="lg"
              onClick={advance}
              disabled={!canGo}
              iconStart={<Sparkles className="size-5" strokeWidth={1.75} />}
            >
              {t.generate}
            </Button>
          ) : (
            <Button
              onClick={advance}
              disabled={!canGo}
              iconEnd={<ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.75} />}
            >
              {t.continue}
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
