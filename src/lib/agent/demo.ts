/**
 * The deterministic Demo Agent (runDemoAgent).
 *
 * The live fallback used when no LLM provider is configured. It parses a
 * constrained set of real, supported intents (EN + AR) and executes them purely
 * through the Phase 03 catalog + Phase 04 design engine — every product/price/
 * total is real and computed with the exact OMR helpers. It never invents data,
 * never commits the cart (proposes + requires approval), and honours "user wins"
 * (kept categories are excluded from purchase). Clearly labelled `mode: "demo"`.
 */

import {
  formatOmr,
  getProductBySlug,
  label,
  categoryBySlug,
  materialLabels,
  type CategorySlug,
  type Product,
} from "@/lib/catalog";
import {
  buildOption,
  buildReason,
  getRoomPlan,
  pickReplacement,
  summarize,
  type DesignInput,
  type DesignItem,
} from "@/lib/design";
import { parseIntent } from "./intent";
import type {
  ActivityLine,
  AgentDesignState,
  AgentRequest,
  AgentResponse,
} from "./types";

type Loc = "en" | "ar";
const t = (loc: Loc, en: string, ar: string) => (loc === "ar" ? ar : en);

function productName(slug: string, loc: Loc): string {
  const p = getProductBySlug(slug);
  if (!p) return slug;
  return loc === "ar" ? p.nameAr : p.name;
}
function catName(cat: CategorySlug, loc: Loc): string {
  const c = categoryBySlug.get(cat);
  return c ? label(c.name, loc) : cat;
}
function priceOf(slug: string): number {
  return getProductBySlug(slug)?.price ?? 0;
}
function makeItem(p: Product, input: DesignInput): DesignItem {
  return {
    slug: p.slug,
    category: p.category,
    colorId: p.colors[0]?.id,
    reason: buildReason(p, input),
  };
}

/** Build a fresh AgentResponse scaffold. */
function respond(
  loc: Loc,
  partial: Partial<AgentResponse> & { intent: AgentResponse["intent"]; message: string },
): AgentResponse {
  return {
    ok: true,
    mode: "demo",
    activity: [],
    ...partial,
  };
}

function summaryLine(loc: Loc, input: DesignInput, items: DesignItem[]) {
  const s = summarize(items, input);
  return { s, text: t(
    loc,
    `New total ${formatOmr(s.newFurnitureTotal, loc)}, ${formatOmr(s.remaining, loc)} remaining.`,
    `الإجمالي الآن ${formatOmr(s.newFurnitureTotal, loc)}، والمتبقّي ${formatOmr(s.remaining, loc)}.`,
  ) };
}

function suggested(loc: Loc, present: CategorySlug[]) {
  const actions: { intentHint: string; label: string }[] = [
    { intentHint: "make it cheaper", label: t(loc, "Make it cheaper", "اجعله أرخص") },
  ];
  if (present.includes("rugs"))
    actions.push({ intentHint: "replace the rug", label: t(loc, "Replace the rug", "بدّل السجادة") });
  if (present.includes("lighting"))
    actions.push({ intentHint: "upgrade the lighting", label: t(loc, "Upgrade the lighting", "رقِّ الإضاءة") });
  actions.push({ intentHint: "keep it under OMR 400", label: t(loc, "Keep under OMR 400", "أبقِه تحت ٤٠٠ ر.ع") });
  actions.push({ intentHint: "add this design to my cart", label: t(loc, "Add to cart", "أضف إلى السلة") });
  return actions;
}

// ── budget-reduction engine (deterministic priority) ──────────────────────────

interface ReduceResult {
  items: DesignItem[];
  changes: { from: string; to: string; saved: number }[];
  removed: string[];
}

/**
 * Reduce a design toward `target` OMR. Priority: replace the most expensive
 * NON-essential with a cheaper option, then essentials, then remove the most
 * expensive non-essential — never removing an essential category. Converges
 * because each step strictly lowers the total.
 */
function reduceToTarget(items: DesignItem[], input: DesignInput, target: number): ReduceResult {
  const plan = getRoomPlan(input.roomType);
  const essential = new Set(plan.needs.filter((n) => n.essential).map((n) => n.category));
  let working = [...items];
  const changes: ReduceResult["changes"] = [];
  const removed: string[] = [];
  let guard = 0;

  const total = () => summarize(working, input).newFurnitureTotal;

  while (total() > target && guard++ < 24) {
    const ordered = [...working].sort(
      (a, b) =>
        (essential.has(a.category) ? 1 : 0) - (essential.has(b.category) ? 1 : 0) ||
        priceOf(b.slug) - priceOf(a.slug),
    );

    // 1) Replace the highest-priority-to-cut item that has a cheaper option.
    let acted = false;
    for (const item of ordered) {
      const others = working.filter((i) => i.slug !== item.slug).map((i) => i.slug);
      const cheaper = pickReplacement(item.slug, "cheaper", input, others);
      if (cheaper && cheaper.price < priceOf(item.slug)) {
        const saved = priceOf(item.slug) - cheaper.price;
        working = working.map((i) => (i.slug === item.slug ? makeItem(cheaper, input) : i));
        changes.push({ from: item.slug, to: cheaper.slug, saved });
        acted = true;
        break;
      }
    }
    if (acted) continue;

    // 2) No cheaper replacement anywhere → remove the most expensive non-essential.
    const removable = ordered.filter((i) => !essential.has(i.category));
    if (removable.length > 0) {
      const drop = removable[0];
      working = working.filter((i) => i.slug !== drop.slug);
      removed.push(drop.slug);
      continue;
    }
    break; // only essentials remain and none can be reduced
  }
  return { items: working, changes, removed };
}

/** One best single reduction (for "make it cheaper" with no explicit target). */
function bestSingleReduction(items: DesignItem[], input: DesignInput): ReduceResult {
  let best: { item: DesignItem; to: Product; saved: number } | null = null;
  for (const item of items) {
    const others = items.filter((i) => i.slug !== item.slug).map((i) => i.slug);
    const cheaper = pickReplacement(item.slug, "cheaper", input, others);
    if (cheaper) {
      const saved = priceOf(item.slug) - cheaper.price;
      if (saved > 0 && (!best || saved > best.saved)) best = { item, to: cheaper, saved };
    }
  }
  if (!best) return { items, changes: [], removed: [] };
  return {
    items: items.map((i) => (i.slug === best!.item.slug ? makeItem(best!.to, input) : i)),
    changes: [{ from: best.item.slug, to: best.to.slug, saved: best.saved }],
    removed: [],
  };
}

function changesActivity(loc: Loc, r: ReduceResult): ActivityLine[] {
  const lines: ActivityLine[] = [];
  for (const c of r.changes) {
    lines.push({
      kind: "replace",
      text: t(
        loc,
        `Replaced ${productName(c.from, loc)} with ${productName(c.to, loc)} (saved ${formatOmr(c.saved, loc)})`,
        `استبدلت ${productName(c.from, loc)} بـ${productName(c.to, loc)} (وفّرت ${formatOmr(c.saved, loc)})`,
      ),
    });
  }
  for (const slug of r.removed) {
    lines.push({
      kind: "remove",
      text: t(loc, `Removed ${productName(slug, loc)}`, `أزلت ${productName(slug, loc)}`),
    });
  }
  return lines;
}

// ── main entry ────────────────────────────────────────────────────────────────

export function runDemoAgent(req: AgentRequest): AgentResponse {
  const loc = req.locale;
  const { input, items } = req.state;
  const present = items.map((i) => i.category);
  const parsed = parseIntent(req.message, present);
  const actions = suggested(loc, present);

  const withDesign = (newItems: DesignItem[], newInput: DesignInput = input) => {
    const s = summarize(newItems, newInput);
    return {
      design: { input: newInput, items: newItems } as AgentDesignState,
      budgetSummary: s,
    };
  };

  switch (parsed.intent) {
    // ── Lower budget / make cheaper ──────────────────────────────────────────
    case "set_budget":
    case "make_cheaper": {
      if (items.length === 0) {
        return respond(loc, {
          intent: parsed.intent,
          message: t(loc, "Generate a design first, then I can adjust its budget.", "أنشئ تصميماً أولاً ثم يمكنني تعديل ميزانيته."),
          suggestedActions: actions,
        });
      }
      const target = parsed.intent === "set_budget" ? parsed.targetBudget! : summarize(items, input).newFurnitureTotal;
      const newInput = parsed.intent === "set_budget" ? { ...input, budget: parsed.targetBudget! } : input;
      const before = summarize(items, input).newFurnitureTotal;

      const result =
        parsed.intent === "set_budget"
          ? reduceToTarget(items, newInput, target)
          : bestSingleReduction(items, input);

      const after = summarize(result.items, newInput);
      const activity: ActivityLine[] = [
        { kind: "budget", text: t(loc, "Checked your budget", "راجعت ميزانيتك") },
        ...changesActivity(loc, result),
        { kind: "budget", text: t(loc, `New total ${formatOmr(after.newFurnitureTotal, loc)}`, `الإجمالي الآن ${formatOmr(after.newFurnitureTotal, loc)}`) },
      ];

      const overTarget = parsed.intent === "set_budget" && after.newFurnitureTotal > target + 1e-9;
      const changed = result.changes.length + result.removed.length > 0;
      const message = overTarget
        ? t(
            loc,
            `I got it down to ${formatOmr(after.newFurnitureTotal, loc)} — the leanest full plan I can build for this room. That's the closest I can get to ${formatOmr(target, loc)} without dropping an essential piece.`,
            `خفّضته إلى ${formatOmr(after.newFurnitureTotal, loc)} — وهي أقل خطة كاملة يمكنني بناؤها لهذه الغرفة. هذا أقرب ما يمكن إلى ${formatOmr(target, loc)} دون إسقاط قطعة أساسية.`,
          )
        : changed
          ? t(
              loc,
              `Done. Total dropped from ${formatOmr(before, loc)} to ${formatOmr(after.newFurnitureTotal, loc)} — ${formatOmr(after.remaining, loc)} remaining.`,
              `تم. انخفض الإجمالي من ${formatOmr(before, loc)} إلى ${formatOmr(after.newFurnitureTotal, loc)} — والمتبقّي ${formatOmr(after.remaining, loc)}.`,
            )
          : t(
              loc,
              `Your design is already at the lowest-cost options I can find — ${formatOmr(after.newFurnitureTotal, loc)}.`,
              `تصميمك يستخدم بالفعل أقل الخيارات تكلفة — ${formatOmr(after.newFurnitureTotal, loc)}.`,
            );

      return respond(loc, {
        intent: parsed.intent,
        message,
        activity,
        ...withDesign(result.items, newInput),
        suggestedActions: actions,
      });
    }

    // ── Replace / find cheaper / upgrade a category ──────────────────────────
    case "replace_item":
    case "find_cheaper":
    case "upgrade_item": {
      const cat = parsed.category;
      const target = cat ? items.find((i) => i.category === cat) : undefined;
      if (!cat || !target) {
        return respond(loc, {
          intent: parsed.intent,
          message: t(loc, "I couldn't find that piece in your current design.", "لم أجد تلك القطعة في تصميمك الحالي."),
          suggestedActions: actions,
        });
      }
      const mode = parsed.intent === "find_cheaper" ? "cheaper" : parsed.intent === "upgrade_item" ? "upgrade" : "similar";
      const others = items.filter((i) => i.slug !== target.slug).map((i) => i.slug);
      const replacement = pickReplacement(target.slug, mode, input, others);
      if (!replacement) {
        return respond(loc, {
          intent: parsed.intent,
          message: t(
            loc,
            `I couldn't find a suitable ${mode === "cheaper" ? "cheaper" : mode === "upgrade" ? "higher-end" : "different"} ${catName(cat, loc)} in the catalog.`,
            `لم أجد ${catName(cat, loc)} ${mode === "cheaper" ? "أرخص" : mode === "upgrade" ? "أرقى" : "مختلفة"} مناسبة في الكتالوج.`,
          ),
          suggestedActions: actions,
        });
      }
      const newItems = items.map((i) => (i.slug === target.slug ? makeItem(replacement, input) : i));
      const { s } = summaryLine(loc, input, newItems);
      return respond(loc, {
        intent: parsed.intent,
        message: t(
          loc,
          `Swapped your ${catName(cat, loc)} for ${replacement.name} (${formatOmr(replacement.price, loc)}). New total ${formatOmr(s.newFurnitureTotal, loc)}, ${formatOmr(s.remaining, loc)} remaining.`,
          `بدّلت ${catName(cat, loc)} بـ${replacement.nameAr} (${formatOmr(replacement.price, loc)}). الإجمالي الآن ${formatOmr(s.newFurnitureTotal, loc)}، والمتبقّي ${formatOmr(s.remaining, loc)}.`,
        ),
        activity: [
          { kind: "search", text: t(loc, `Compared ${catName(cat, loc)} options`, `قارنت خيارات ${catName(cat, loc)}`) },
          { kind: "replace", text: t(loc, `Replaced the ${catName(cat, loc)}`, `استبدلت ${catName(cat, loc)}`) },
          { kind: "budget", text: t(loc, `New total ${formatOmr(s.newFurnitureTotal, loc)}`, `الإجمالي الآن ${formatOmr(s.newFurnitureTotal, loc)}`) },
        ],
        ...withDesign(newItems),
        suggestedActions: actions,
      });
    }

    // ── Change material / colour of a category ───────────────────────────────
    case "change_material":
    case "change_color": {
      const cat = parsed.category;
      const target = cat ? items.find((i) => i.category === cat) : undefined;
      if (!cat || !target) {
        return respond(loc, {
          intent: parsed.intent,
          message: t(loc, "I couldn't find that piece in your current design.", "لم أجد تلك القطعة في تصميمك الحالي."),
          suggestedActions: actions,
        });
      }
      const others = items.filter((i) => i.slug !== target.slug).map((i) => i.slug);
      // Search same category for a match on the requested material/colour.
      const wantMat = parsed.material;
      const wantCol = parsed.color;
      const candidates = pickAllReplacements(target.slug, input, others).filter((p) =>
        parsed.intent === "change_material"
          ? wantMat && p.materials.includes(wantMat)
          : wantCol && p.colors.some((c) => c.id === wantCol),
      );
      const replacement = candidates[0];
      const wantLabel = parsed.intent === "change_material" && wantMat ? label(materialLabels[wantMat], loc) : (wantCol ?? "");
      if (!replacement) {
        return respond(loc, {
          intent: parsed.intent,
          message: t(
            loc,
            `I couldn't find a ${wantLabel} ${catName(cat, loc)} in the catalog. Your current one stays.`,
            `لم أجد ${catName(cat, loc)} بخامة ${wantLabel} في الكتالوج. تبقى القطعة الحالية.`,
          ),
          suggestedActions: actions,
        });
      }
      const newItems = items.map((i) => (i.slug === target.slug ? makeItem(replacement, input) : i));
      const { s } = summaryLine(loc, input, newItems);
      return respond(loc, {
        intent: parsed.intent,
        message: t(
          loc,
          `Changed your ${catName(cat, loc)} to ${replacement.name} (${formatOmr(replacement.price, loc)}). New total ${formatOmr(s.newFurnitureTotal, loc)}, ${formatOmr(s.remaining, loc)} remaining.`,
          `غيّرت ${catName(cat, loc)} إلى ${replacement.nameAr} (${formatOmr(replacement.price, loc)}). الإجمالي الآن ${formatOmr(s.newFurnitureTotal, loc)}، والمتبقّي ${formatOmr(s.remaining, loc)}.`,
        ),
        activity: [
          { kind: "search", text: t(loc, `Searched ${catName(cat, loc)} matches`, `بحثت عن ${catName(cat, loc)} مطابقة`) },
          { kind: "replace", text: t(loc, `Updated the ${catName(cat, loc)}`, `حدّثت ${catName(cat, loc)}`) },
        ],
        ...withDesign(newItems),
        suggestedActions: actions,
      });
    }

    // ── Remove a category ────────────────────────────────────────────────────
    case "remove_item": {
      const cat = parsed.category;
      if (!cat || !items.some((i) => i.category === cat)) {
        return respond(loc, {
          intent: "remove_item",
          message: t(loc, "That piece isn't in your current design.", "تلك القطعة ليست في تصميمك الحالي."),
          suggestedActions: actions,
        });
      }
      const newItems = items.filter((i) => i.category !== cat);
      const { s } = summaryLine(loc, input, newItems);
      return respond(loc, {
        intent: "remove_item",
        message: t(
          loc,
          `Removed the ${catName(cat, loc)}. New total ${formatOmr(s.newFurnitureTotal, loc)}, ${formatOmr(s.remaining, loc)} remaining.`,
          `أزلت ${catName(cat, loc)}. الإجمالي الآن ${formatOmr(s.newFurnitureTotal, loc)}، والمتبقّي ${formatOmr(s.remaining, loc)}.`,
        ),
        activity: [{ kind: "remove", text: t(loc, `Removed the ${catName(cat, loc)}`, `أزلت ${catName(cat, loc)}`) }],
        ...withDesign(newItems),
        suggestedActions: actions,
      });
    }

    // ── Keep a category (user wins → exclude from purchase) ───────────────────
    case "keep_item": {
      const cat = parsed.category!;
      const newInput: DesignInput = {
        ...input,
        decisions: [
          ...input.decisions.filter((d) => d.category !== cat),
          { category: cat, disposition: "keep" },
        ],
      };
      const newItems = items.filter((i) => i.category !== cat);
      const { s } = summaryLine(loc, input, newItems);
      return respond(loc, {
        intent: "keep_item",
        message: t(
          loc,
          `Got it — I'll keep your ${catName(cat, loc)} and leave it out of the shopping list. New total ${formatOmr(s.newFurnitureTotal, loc)}.`,
          `تمام — سأُبقي ${catName(cat, loc)} وأستثنيها من قائمة الشراء. الإجمالي الآن ${formatOmr(s.newFurnitureTotal, loc)}.`,
        ),
        activity: [{ kind: "keep", text: t(loc, `Keeping your ${catName(cat, loc)}`, `الإبقاء على ${catName(cat, loc)}`) }],
        ...withDesign(newItems, newInput),
        suggestedActions: actions,
      });
    }

    // ── Prepare cart (proposal only — requires approval) ─────────────────────
    case "prepare_cart": {
      if (items.length === 0) {
        return respond(loc, {
          intent: "prepare_cart",
          message: t(loc, "There's nothing in your design to add yet.", "لا يوجد شيء في تصميمك لإضافته بعد."),
          suggestedActions: actions,
        });
      }
      const s = summarize(items, input);
      return respond(loc, {
        intent: "prepare_cart",
        message: t(
          loc,
          `I can add the ${items.length} selected ${items.length === 1 ? "piece" : "pieces"} to your cart for ${formatOmr(s.newFurnitureTotal, loc)}. Confirm to add them.`,
          `يمكنني إضافة ${items.length} ${items.length === 1 ? "قطعة" : "قطع"} إلى سلتك مقابل ${formatOmr(s.newFurnitureTotal, loc)}. أكّد للإضافة.`,
        ),
        activity: [{ kind: "cart", text: t(loc, "Prepared your cart", "جهّزت سلتك") }],
        cartProposal: {
          items: items.map((i) => ({ slug: i.slug, colorId: i.colorId, quantity: 1 })),
          subtotal: s.newFurnitureTotal,
          count: items.length,
        },
        requiresApproval: true,
        suggestedActions: actions,
      });
    }

    // ── Explain the current design ───────────────────────────────────────────
    case "explain": {
      if (items.length === 0) {
        return respond(loc, {
          intent: "explain",
          message: t(loc, "Generate a design and I'll walk you through it.", "أنشئ تصميماً وسأشرحه لك."),
          suggestedActions: actions,
        });
      }
      const s = summarize(items, input);
      const priciest = [...items].sort((a, b) => priceOf(b.slug) - priceOf(a.slug))[0];
      return respond(loc, {
        intent: "explain",
        message: t(
          loc,
          `Your plan has ${items.length} ${items.length === 1 ? "piece" : "pieces"} totalling ${formatOmr(s.newFurnitureTotal, loc)}, with ${formatOmr(s.remaining, loc)} of your budget left. If you want to save, the ${catName(priciest.category, loc)} is the most expensive piece — ask me to find a cheaper one.`,
          `خطتك تضم ${items.length} ${items.length === 1 ? "قطعة" : "قطع"} بإجمالي ${formatOmr(s.newFurnitureTotal, loc)}، ويتبقّى ${formatOmr(s.remaining, loc)} من ميزانيتك. لتوفّر أكثر، ${catName(priciest.category, loc)} هي الأغلى — اطلب مني إيجاد بديل أرخص.`,
        ),
        activity: [{ kind: "info", text: t(loc, "Reviewed your design", "راجعت تصميمك") }],
        budgetSummary: s,
        suggestedActions: actions,
      });
    }

    // ── Build a design from the current brief ────────────────────────────────
    case "design_room": {
      const option = buildOption(input, "balanced");
      return respond(loc, {
        intent: "design_room",
        message: t(
          loc,
          `Built a ${formatOmr(option.summary.newFurnitureTotal, loc)} design for your ${catName((getRoomPlan(input.roomType).needs[0]?.category ?? "sofas"), loc)} room — ${formatOmr(option.summary.remaining, loc)} remaining.`,
          `بنيت تصميماً بقيمة ${formatOmr(option.summary.newFurnitureTotal, loc)} لغرفتك — والمتبقّي ${formatOmr(option.summary.remaining, loc)}.`,
        ),
        activity: [
          { kind: "build", text: t(loc, "Built a budget-aware design", "بنيت تصميماً يراعي الميزانية") },
        ],
        ...withDesign(option.items),
        suggestedActions: actions,
      });
    }

    // ── Unknown ──────────────────────────────────────────────────────────────
    default:
      return respond(loc, {
        intent: "unknown",
        message: t(
          loc,
          "I can adjust your design — try: “make it cheaper”, “replace the rug”, “keep it under OMR 400”, “change the table to walnut”, or “add this design to my cart”.",
          "يمكنني تعديل تصميمك — جرّب: «اجعله أرخص»، «بدّل السجادة»، «أبقِه تحت ٤٠٠ ر.ع»، «غيّر الطاولة إلى خشب الجوز»، أو «أضف هذا التصميم إلى سلتي».",
        ),
        activity: [],
        suggestedActions: actions,
      });
  }
}

/** All same-category alternatives (any direction), best-match first. */
function pickAllReplacements(slug: string, input: DesignInput, exclude: string[]): Product[] {
  // Reuse the "similar" ranking but without the ±30% price gate: gather cheaper,
  // similar and upgrade candidates in one deterministic, de-duplicated list.
  const seen = new Set<string>([slug, ...exclude]);
  const out: Product[] = [];
  for (const mode of ["similar", "cheaper", "upgrade"] as const) {
    let p = pickReplacement(slug, mode, input, [...exclude]);
    // pickReplacement returns the single best; gather a few by excluding as we go.
    let guard = 0;
    while (p && guard++ < 20) {
      if (!seen.has(p.slug)) {
        seen.add(p.slug);
        out.push(p);
      }
      p = pickReplacement(slug, mode, input, [...seen]);
    }
  }
  return out;
}
