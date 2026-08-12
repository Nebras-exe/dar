/**
 * Deterministic Demo chat engine.
 *
 * Turns a detected intent + slots into a grounded, honest response WITHOUT any
 * model call. This is the competition-safe default (no key), and the fallback
 * when Claude is unavailable or returns an unusable plan. Every product card is a
 * real catalog slug; every number is deterministic.
 *
 * Order/manufacturing/delivery/memory/cart intents return only a FLAG + a helpful
 * message — the client renders the user's own data (never sent to the server).
 */

import { getAllProducts, colorSwatches, categoryBySlug, type ColorId } from "@/lib/catalog";
import { detectIntent, extractSlots } from "./intents";
import { searchCatalog, budgetFor } from "./tools";
import type { ChatMessage, ChatResponse, ProductCardRef, QuickAction, ChatFlags } from "./types";

interface Copy {
  en: string;
  ar: string;
}
const t = (c: Copy, locale: "en" | "ar") => c[locale];

/** The standard quick actions (localized), reused by the widget + responses. */
export function defaultQuickActions(locale: "en" | "ar"): QuickAction[] {
  return [
    { id: "design", label: t({ en: "Design my room", ar: "صمّم غرفتي" }, locale), intentHint: "Design my room", route: "design" },
    { id: "sofa", label: t({ en: "Find a sofa", ar: "ابحث عن كنبة" }, locale), intentHint: "Find a sofa" },
    { id: "budget", label: t({ en: "Under my budget", ar: "ضمن ميزانيتي" }, locale), intentHint: "Show furniture under 200 OMR" },
    { id: "compare", label: t({ en: "Compare products", ar: "قارن المنتجات" }, locale), intentHint: "Compare two sofas" },
    { id: "custom", label: t({ en: "Custom furniture", ar: "أثاث مخصّص" }, locale), intentHint: "I want custom furniture", route: "custom" },
    { id: "order", label: t({ en: "Track my order", ar: "تتبّع طلبي" }, locale), intentHint: "Where is my order?" },
  ];
}

function cards(slugs: string[], opts?: { reason?: Copy; locale?: "en" | "ar"; color?: ColorId }): ProductCardRef[] {
  return slugs.map((slug) => ({
    slug,
    // Surfaced because of a colour → the card shows that variant's own photo.
    ...(opts?.color ? { colorId: opts.color } : {}),
    ...(opts?.reason && opts.locale ? { reason: opts.reason[opts.locale] } : {}),
  }));
}

/**
 * An honest, specific "no exact match" message. When both a category and colour
 * were requested, it names them ("no red chairs available in DAR's catalog")
 * and OFFERS to widen the search — but never widens automatically (§2). Falls
 * back to a general no-match line otherwise.
 */
function zeroResultMessage(
  category: string | undefined,
  color: ColorId | undefined,
  budget: number | undefined,
  locale: "en" | "ar",
): string {
  if (category && color) {
    const catName = categoryBySlug.get(category as never);
    const catAr = catName ? catName.name.ar : category;
    const catEn = catName ? catName.name.en.toLowerCase() : category;
    const colAr = colorSwatches[color].label.ar;
    const colEn = colorSwatches[color].label.en.toLowerCase();
    return t(
      {
        ar: `لا توجد ${catAr} ${colAr} متاحة حاليًا في كتالوج دار. هل تريد مشاهدة أقرب لون متاح؟`,
        en: `There are currently no ${colEn} ${catEn} available in DAR's catalog. Would you like to see the closest available colour?`,
      },
      locale,
    );
  }
  if (color) {
    const colAr = colorSwatches[color].label.ar;
    const colEn = colorSwatches[color].label.en.toLowerCase();
    return t(
      {
        ar: `لا توجد قطع باللون ${colAr} تطابق طلبك حاليًا في كتالوج دار. هل أوسّع البحث؟`,
        en: `There are currently no ${colEn} pieces matching that in DAR's catalog. Shall I widen the search?`,
      },
      locale,
    );
  }
  return t(
    {
      en: budget
        ? `I couldn't find a match within ${budget} OMR. Tell me a different category or a higher budget — or the room, and I'll design it.`
        : "I couldn't find a match in the catalog for that. Try a different category or colour — or tell me the room and I'll design it.",
      ar: budget
        ? `لم أجد تطابقًا ضمن ${budget} ر.ع. أخبرني بفئة مختلفة أو ميزانية أعلى — أو بالغرفة وسأصمّمها.`
        : "لم أجد تطابقًا في الكتالوج لذلك. جرّب فئة أو لونًا مختلفًا — أو أخبرني بالغرفة وسأصمّمها.",
    },
    locale,
  );
}

/** Build a deterministic response for the latest user message. */
export function demoRespond(messages: ChatMessage[], locale: "en" | "ar", context?: { budget?: number; primaryStyle?: string; roomType?: string }): ChatResponse {
  const last = [...messages].reverse().find((m) => m.role === "user");
  const text = last?.content ?? "";
  const intent = detectIntent(text);
  const slots = extractSlots(text);
  const budget = slots.budget ?? context?.budget;

  const base = (over: Partial<ChatResponse>): ChatResponse => ({
    ok: true, mode: "demo", intent, message: "", cards: [], actions: defaultQuickActions(locale), flags: {}, ...over,
  });

  // Honesty first: if the catalog is empty, never fabricate a product. Say so for
  // any intent that would otherwise surface product cards.
  const PRODUCT_INTENTS = new Set([
    "find_furniture", "choose_style", "choose_color", "budget_recommend",
    "compare_products", "find_variants",
  ]);
  if ((PRODUCT_INTENTS.has(intent) || intent === "unknown") && getAllProducts().length === 0) {
    return base({
      message: t({
        en: "The furniture catalog is currently empty — no products have been added yet. I can still help you design a room or plan a custom piece.",
        ar: "كتالوج الأثاث فارغ حاليًا — لم تتم إضافة أي منتجات بعد. لا يزال بإمكاني مساعدتك في تصميم غرفة أو التخطيط لقطعة مخصّصة.",
      }, locale),
      intent: intent === "unknown" ? "find_furniture" : intent,
    });
  }

  switch (intent) {
    case "greeting":
    case "help":
      return base({
        message: t({
          en: "Hi! I'm your Athathi design assistant. I can help you find furniture, stay within budget, design a room, or check your order. What would you like to do?",
          ar: "مرحبًا! أنا مساعد التصميم في أثاثي. يمكنني مساعدتك في إيجاد الأثاث، والالتزام بالميزانية، وتصميم غرفة، أو متابعة طلبك. بماذا أساعدك؟",
        }, locale),
      });

    case "design_handoff": {
      const flags: ChatFlags = { handoffDesign: {
        ...(context?.roomType ? { roomType: context.roomType } : {}),
        ...(budget ? { budget } : {}),
        ...(slots.style ? { primaryStyle: slots.style } : context?.primaryStyle ? { primaryStyle: context.primaryStyle } : {}),
        ...(slots.color ? { colorId: slots.color } : {}),
      } };
      return base({
        message: t({
          en: "Let's design your space. I'll open Design My Space — upload a room photo, set your budget and style, and I'll build a plan from real furniture.",
          ar: "لنصمّم مساحتك. سأفتح «صمّم مساحتي» — ارفع صورة الغرفة، وحدّد ميزانيتك وأسلوبك، وسأبني خطة من أثاث حقيقي.",
        }, locale),
        flags,
        actions: [{ id: "open-design", label: t({ en: "Open Design My Space", ar: "افتح صمّم مساحتي" }, locale), intentHint: "", route: "design" }, ...defaultQuickActions(locale).slice(1)],
      });
    }

    case "custom_rfq":
    case "explain_customization":
      return base({
        message: t({
          en: "For a made-to-order piece, tell me the type, rough size, colour, material and budget. I'll help you build a custom specification and request quotes from real suppliers — you send it when you're ready.",
          ar: "للقطعة المصنوعة حسب الطلب، أخبرني بالنوع والمقاس التقريبي واللون والخامة والميزانية. سأساعدك في إعداد مواصفات مخصّصة وطلب عروض من موردين حقيقيين — ترسلها عندما تكون جاهزًا.",
        }, locale),
        flags: { handoffCustom: true },
        actions: [{ id: "open-custom", label: t({ en: "Start custom furniture", ar: "ابدأ الأثاث المخصّص" }, locale), intentHint: "", route: "custom" }, ...defaultQuickActions(locale).slice(1)],
      });

    case "order_status":
    case "manufacturing_status":
    case "delivery_status":
      return base({
        message: t({
          en: "I can show your latest orders and their progress — payment, supplier acceptance, manufacturing, quality check, and delivery. Here's what's on your account:",
          ar: "يمكنني عرض أحدث طلباتك وتقدّمها — الدفع، وقبول المورّد، والتصنيع، وفحص الجودة، والتوصيل. إليك ما في حسابك:",
        }, locale),
        flags: { showOrders: true },
      });

    case "cart_help":
      return base({
        message: t({
          en: "I can suggest pieces to add — you always confirm before anything goes in your cart. Want me to find something specific?",
          ar: "يمكنني اقتراح قطع لإضافتها — أنت من يؤكّد دائمًا قبل إضافة أي شيء إلى سلتك. أبحث لك عن شيء محدّد؟",
        }, locale),
        actions: [{ id: "open-cart", label: t({ en: "View cart", ar: "عرض السلة" }, locale), intentHint: "", route: "cart" }, ...defaultQuickActions(locale).slice(1)],
      });

    case "compare_products": {
      const slugs = searchCatalog({ category: slots.category, style: slots.style, limit: 3 });
      return base({
        message: slugs.length >= 2
          ? t({ en: "Here are a few to compare — check the price, size, materials and colours on each card.", ar: "إليك بعض الخيارات للمقارنة — راجع السعر والمقاس والخامات والألوان في كل بطاقة." }, locale)
          : t({ en: "Tell me which two pieces (or a category) you'd like to compare.", ar: "أخبرني بأي قطعتين (أو فئة) ترغب في مقارنتها." }, locale),
        cards: cards(slugs),
        intent: "compare_products",
      });
    }

    case "find_variants": {
      const slugs = searchCatalog({ category: slots.category, color: slots.color, limit: 4 });
      return base({
        message: slugs.length > 0
          ? t({ en: "Many pieces come in several colours and finishes — open a product to switch the colour and see the price update.", ar: "تأتي العديد من القطع بألوان وتشطيبات متعددة — افتح المنتج لتبديل اللون ورؤية تحديث السعر." }, locale)
          : t({ en: "I couldn't find a match — tell me the item and colour you're after.", ar: "لم أجد تطابقًا — أخبرني بالقطعة واللون الذي تريده." }, locale),
        cards: cards(slugs, { color: slots.color }),
        intent: "find_variants",
      });
    }

    case "budget_recommend":
    case "find_furniture":
    case "choose_style":
    case "choose_color":
    default: {
      const slugs = searchCatalog({ category: slots.category, style: slots.style, color: slots.color, material: slots.material, maxPrice: budget, limit: 6 });
      if (slugs.length === 0) {
        // Honest, SPECIFIC no-result message. We NEVER silently relax the
        // filters — if a colour+category was asked and has no exact match, say so
        // and offer to widen only WITH the user's approval.
        return base({
          message: zeroResultMessage(slots.category, slots.color, budget, locale),
          intent: intent === "unknown" ? "find_furniture" : intent,
        });
      }
      const b = budget ? budgetFor(slugs.slice(0, 1), budget) : null;
      const msg = budget
        ? t({ en: `Here are pieces within ${budget} OMR — real catalog products with live prices.`, ar: `إليك قطعًا ضمن ${budget} ر.ع — منتجات حقيقية من الكتالوج بأسعار محدّثة.` }, locale)
        : t({ en: "Here are some pieces from the catalog. Open one to see colours, size and materials.", ar: "إليك بعض القطع من الكتالوج. افتح واحدة لرؤية الألوان والمقاس والخامات." }, locale);
      return base({
        message: b && !b.withinBudget ? t({ en: "These are the closest matches, though a few edge past your budget.", ar: "هذه أقرب الخيارات، مع أن بعضها يتجاوز ميزانيتك قليلًا." }, locale) : msg,
        cards: cards(slugs, { color: slots.color }),
        intent: intent === "unknown" ? "find_furniture" : intent,
      });
    }
  }
}
