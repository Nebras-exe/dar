# Athathi — User Journeys

These journeys describe the *target* product. Phase 01 builds the foundation that makes them buildable; it does not implement them.

## 1. AI Room Design journey (flagship)

**Actor:** a customer furnishing or refreshing a room.

1. Opens Athathi → chooses **Design My Space / صمّم مساحتي**.
2. Uploads one or more room photos (`/design`, Step 1).
3. Selects room type — Living Room, Bedroom, Majlis, Dining, Office, Kids, Outdoor (Step 2).
4. Sets an **OMR budget**, e.g. 300 / 500 / 1,000 (Step 3).
5. Chooses style(s) **visually** — Modern, Japandi, Minimal, Scandinavian, Luxury, Boho… (Step 4).
6. States preferences — "keep existing sofa", "prefer walnut", "avoid dark colours" (Step 5).
7. **AI analyses the room** (Step 6): detected palette, existing furniture, reusable items, improvement areas.
8. **Agent working state** (Step 7) shows understandable progress, not a generic spinner:
   `✓ Analysed room ✓ Identified existing furniture ✓ Understood style ✓ Searching catalog ✓ Checking dimensions ✓ Checking prices ✓ Optimising OMR 500 budget ✓ Preparing design`.
9. **Results** (Step 8): several options — e.g. Smart Saver OMR 349 / Balanced OMR 472 / Premium OMR 598 — with over-budget options clearly flagged.
10. Sees **Before / After** and every **real catalog product** used, with per-item prices.
11. Replaces items ("find cheaper", "similar", "upgrade", "change colour", "keep mine") → agent **recalculates total, remaining budget, and compatibility**.
12. Selects a design → **Add Entire Design to Cart** → reviews cart of real products → **approves** → order created.

**Trust behaviours:** keep-what-works (existing sofa = OMR 0), transparent remaining budget, honest labelling of demo data.

## 2. Standard ecommerce journey

**Actor:** a shopper who knows what they want.

1. Home → **Shop / المتجر**.
2. Browses categories (`/shop/[category]`) — Sofas, Chairs, Beds, Tables, Rugs, Lighting, Storage, Decor, Outdoor, Office…
3. Filters/sorts (style, price, colour, dimensions, availability).
4. Opens a product (`/product/[slug]`): gallery, price in OMR, description, dimensions, material, colours, stock, supplier, delivery estimate, style tags.
5. Configures customisation (deterministic add-ons: fabric, size, legs) with a live, deterministic price.
6. **Add to Cart** / **Favourite** / **Try in My Room**.
7. Cart (`/cart`) → adjust quantities → checkout (`/checkout`) → order.

## 3. Supplier journey (future)

**Actor:** a furniture store, factory, workshop, or interior/lighting/rug/curtain supplier.

1. Onboards and receives a supplier dashboard (`/supplier`).
2. Manages **Products / Inventory** (`/supplier/products`), keeping stock and dimensions accurate.
3. Receives and fulfils **Orders** (`/supplier/orders`).
4. Handles **Leads** and **Custom Requests / RFQs** (`/supplier/leads`) → submits quotes (price + lead time).
5. Reviews **Analytics**.

**Fairness rule:** promoted products are clearly labelled; advertising never silently manipulates AI recommendations.

## 4. Account journey (future)

`/account` dashboard: **My Rooms**, **My Designs**, **Orders**, **Favourites**, **Style Profile** (e.g. Modern 70% / Japandi 20% / Minimal 10%, favourite tones), **Saved Furniture**, **Settings**. Taste memory is transparent and user-controlled.
