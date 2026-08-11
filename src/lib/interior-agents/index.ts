/**
 * Multi-Agent Interior Engine — CLIENT-SAFE barrel.
 *
 * Re-exports only the types + the pure validator. The server pieces (providers,
 * orchestrator, prompts, catalog/layout/budget/render composition) live behind the
 * server boundary and are imported directly by the API route — never from here —
 * so no secret-reading code or model call can reach the client bundle.
 */

export type {
  InteriorRunInput,
  InteriorMemoryContext,
  ProductNeed,
  DesignBrief,
  CatalogSelection,
  FitStatus,
  ItemFit,
  LayoutValidation,
  BudgetResult,
  RenderInsert,
  RenderSpec,
  RunStatus,
  ProviderMeta,
  RunWarning,
  RunWarningCode,
  RunErrorCode,
  InteriorDesignRun,
} from "./types";

export { validateBrief, type ValidationResult } from "./validation";
export { NEGATIVE_CONSTRAINTS } from "./render-spec";
