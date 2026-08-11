# Athathi — Product Vision

> أثاثي | Athathi — AI Interior & Furniture Marketplace for the Sultanate of Oman.

## The one-line promise

> **Upload your space, tell us your budget and taste, and let Athathi design and prepare it for you.**
>
> صوّر مساحتك، حدد ميزانيتك وذوقك، ودع أثاثي يصممها ويجهزها لك.

## What Athathi is (and is not)

Athathi is **not** "an online furniture store with AI." It is an **AI interior & furniture marketplace** that helps a customer *decide, design, budget, and buy an entire space* — not just browse products.

The defining principle:

> **REAL ROOM + REAL BUDGET + REAL PRODUCTS + AI**

AI-generated visualisations are a supporting feature, never the product. Every recommended item must correspond to a real product in the Athathi catalog, with a real price, real dimensions, and real availability. **Hallucinated products are never presented as inventory.**

## The core problem

Furnishing or renovating a room forces customers to make dozens of disconnected decisions: what to buy, what fits, what colours work, what to keep, where to buy it, how to split a budget, and whether it all works together. Traditional ecommerce hands over products; Athathi helps solve the whole furnishing decision.

The user should be able to say:

> "This is my living room. My budget is OMR 500. Make it modern and warm, and keep my existing sofa."

…and Athathi helps complete the rest of the journey.

## The transformation

```
ROOM PHOTO + USER STYLE + USER BUDGET
      → ROOM ANALYSIS
      → INTERIOR PLAN
      → REAL PRODUCTS (from the catalog)
      → BUDGET OPTIMISATION
      → VISUAL DESIGN (before / after)
      → SHOPPING CART
      → ORDER
```

## The AI agent (concept, not a chatbot)

A future orchestration agent reasons over explicit, testable tools while a **deterministic business layer validates every decision**:

- **Hard constraints** (must hold): inventory/stock, dimensions/fit, strict budget caps.
- **Soft ranking** (scored): style match, colour compatibility, material preference, user preferences.

> AI can explain and orchestrate. Business logic must validate. The LLM never freely invents the selection.

Anticipated agent tools (interfaces designed for later, not faked now): `analyze_room`, `detect_existing_furniture`, `infer_style`, `search_catalog`, `get_product`, `check_stock`, `check_dimensions`, `check_budget`, `score_products`, `optimize_room_bundle`, `find_alternative`, `replace_design_item`, `calculate_design_total`, `generate_room_visualization`, `create_cart`, `request_customer_approval`, `create_order`, `track_order`.

**The agent always requires explicit customer approval before any purchase/order.**

## Flagship "wow moment" (judging demo)

1. Show a room and the many manual decisions it normally requires.
2. Upload a room photo, set **OMR 500**, choose **Modern / warm / beige**, say **"keep my sofa."**
3. AI analyses the room → agent searches the real catalog → optimises the budget.
4. Show **Before / After**, the **real products used**, and a total (e.g. OMR 487).
5. User: "Make it under OMR 420 and replace the rug." → agent updates → new total (e.g. OMR 412).
6. **Add Entire Design to Cart.**

## Market & languages

- **Initial market:** Sultanate of Oman. **Currency:** OMR (Omani Rial), 3 decimal places.
- **Languages from day one:** Arabic (RTL) and English (LTR), architected so layout never assumes LTR.
- **Future:** GCC expansion; B2B (cafes, hotels, Airbnb, clinics); supplier marketplace; custom furniture manufacturing; AR/3D/LiDAR in the mobile app.

## Visual north star

**Premium interior studio × high-end furniture ecommerce × modern technology.**
Warm, calm, editorial, trustworthy. Explicitly **not** a generic SaaS/AI template, not Amazon/Temu, not a purple-gradient neon-AI site. See `DESIGN_SYSTEM.md`.

## Honesty rules

- Demo/sample content is always clearly labelled.
- No fabricated suppliers, testimonials, user counts, sales figures, or partnerships.
- Mocked capabilities are presented as a well-designed **Demo Mode**, never as a real API call.
