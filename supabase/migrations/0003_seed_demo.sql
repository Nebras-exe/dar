-- Athathi — Phase 08 demo seed (§34). Everything here is tagged is_demo = true
-- and is NEVER presented to users as a real supplier/product. It exists so a
-- fresh Supabase project renders the marketplace immediately. The full Phase 03
-- demo catalog (≈80 products) can be generated from src/lib/catalog/products.ts;
-- see docs/DATABASE.md § Seeding. Demo Mode (no backend) does not need this seed.

-- ── categories (stable slugs, mirror the Phase 03 taxonomy) ──────────────────
insert into categories (slug, name, name_ar, tagline, tagline_ar, position) values
  ('sofas', 'Sofas', 'كنب', 'Anchor pieces for the living room and majlis.', 'قطع أساسية لغرفة المعيشة والمجلس.', 0),
  ('chairs', 'Chairs', 'كراسي', 'Accent, lounge and dining seating.', 'كراسي مميزة للاسترخاء والطعام.', 1),
  ('coffee-tables', 'Coffee Tables', 'طاولات قهوة', 'The centre of the seating arrangement.', 'قلب جلسة غرفة المعيشة.', 2),
  ('side-tables', 'Side Tables', 'طاولات جانبية', 'Small surfaces that pull a room together.', 'أسطح صغيرة تكمل تنسيق الغرفة.', 3),
  ('dining', 'Dining Tables', 'طاولات طعام', 'Gather-round tables for everyday and guests.', 'طاولات تجمع العائلة والضيوف.', 4),
  ('beds', 'Beds', 'أسِرّة', 'Calm, grounded pieces for the bedroom.', 'قطع هادئة ومريحة لغرفة النوم.', 5),
  ('storage', 'Storage', 'تخزين', 'Sideboards, shelving and dressers.', 'بوفيهات ورفوف وخزائن أدراج.', 6),
  ('wardrobes', 'Wardrobes', 'دواليب ملابس', 'Bedroom storage with a quiet presence.', 'تخزين لغرفة النوم بحضور هادئ.', 7),
  ('tv-units', 'TV Units', 'طاولات تلفزيون', 'Low consoles that keep the living room tidy.', 'طاولات منخفضة تحافظ على ترتيب المعيشة.', 8),
  ('desks', 'Desks', 'مكاتب', 'Focused surfaces for the home office.', 'أسطح عمل للمكتب المنزلي.', 9),
  ('rugs', 'Rugs', 'سجاد', 'Texture and warmth underfoot.', 'دفء وملمس تحت الأقدام.', 10),
  ('lighting', 'Lighting', 'إضاءة', 'Floor, table and pendant light.', 'إضاءة أرضية وطاولة ومعلقة.', 11),
  ('mirrors', 'Mirrors', 'مرايا', 'Light, depth and a finishing touch.', 'ضوء وعمق ولمسة أخيرة.', 12),
  ('decor', 'Decor', 'ديكور', 'Vases, throws and the small details.', 'مزهريات وأغطية وتفاصيل صغيرة.', 13),
  ('outdoor', 'Outdoor', 'خارجي', 'Seating and tables for terraces and gardens.', 'جلسات وطاولات للتراس والحديقة.', 14)
on conflict (slug) do nothing;

-- ── demo suppliers (active so they render, but verified = false, is_demo) ─────
insert into suppliers (id, slug, name, name_ar, description, description_ar, location, location_ar, type, status, verified, is_demo) values
  ('00000000-0000-4000-8000-000000000001', 'athathi-studio-collection', 'Athathi Studio Collection', 'مجموعة استوديو أثاثي',
   'A sample in-house collection used to demonstrate the Athathi marketplace. Not a real supplier.',
   'مجموعة داخلية نموذجية لعرض سوق أثاثي. ليست مورّداً حقيقياً.', 'Muscat', 'مسقط', 'studio', 'active', false, true),
  ('00000000-0000-4000-8000-000000000002', 'athathi-demo-supplier', 'Athathi Demo Supplier', 'مورّد أثاثي التجريبي',
   'A sample supplier account demonstrating the supplier dashboard and product tools.',
   'حساب مورّد نموذجي لعرض لوحة تحكم المورّد وأدوات المنتجات.', 'Sohar', 'صحار', 'showroom', 'active', false, true),
  ('00000000-0000-4000-8000-000000000003', 'demo-furniture-lab', 'Demo Furniture Lab', 'مختبر الأثاث التجريبي',
   'A sample workshop used to show made-to-order and customizable pieces. Not a real workshop.',
   'ورشة نموذجية لعرض القطع حسب الطلب والقابلة للتخصيص. ليست ورشة حقيقية.', 'Nizwa', 'نزوى', 'workshop', 'active', false, true)
on conflict (id) do nothing;

-- ── two representative demo products (schema demonstration) ──────────────────
insert into products (id, supplier_id, category_slug, slug, name, name_ar, description, description_ar, base_price, status, customizable, style_tags, room_types, is_demo) values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'sofas', 'luna-modular-sofa',
   'Luna Modular Sofa', 'كنبة لونا المعيارية', 'A soft modular sofa in warm neutral tones.', 'كنبة معيارية ناعمة بدرجات محايدة دافئة.',
   320.000, 'active', true, '{warm-modern,contemporary}', '{living-room,majlis}', true),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000003', 'rugs', 'textured-wool-rug',
   'Sana Textured Wool Rug', 'سجادة سنا الصوفية المزخرفة', 'A hand-finished wool rug with subtle texture.', 'سجادة صوفية بلمسة نهائية يدوية وملمس ناعم.',
   58.000, 'active', false, '{warm-modern,boho}', '{living-room}', true)
on conflict (id) do nothing;

insert into product_dimensions (product_id, width_cm, depth_cm, height_cm, source) values
  ('00000000-0000-4000-8000-000000000101', 268, 98, 72, 'demo'),
  ('00000000-0000-4000-8000-000000000102', 200, 290, 1, 'demo')
on conflict (product_id) do nothing;

insert into inventory (product_id, status) values
  ('00000000-0000-4000-8000-000000000101', 'made_to_order'),
  ('00000000-0000-4000-8000-000000000102', 'in_stock')
on conflict (product_id) do nothing;
