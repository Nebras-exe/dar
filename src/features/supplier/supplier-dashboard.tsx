"use client";

import * as React from "react";
import Link from "next/link";
import {
  Archive, BarChart3, Boxes, LayoutDashboard, Package, Plus, RotateCcw, ShoppingBag,
  Settings, Trash2, Upload, Inbox,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatOmr, type Product } from "@/lib/catalog";
import type { InventoryStatus, ProductInput, Supplier } from "@/lib/repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { cn } from "@/lib/utils";
import { useSupplierProducts, type LocalProduct } from "./demo-products-store";
import { ProductForm } from "./product-form";
import { toPreviewProduct } from "./local-product";
import { SupplierRFQ } from "./supplier-rfq";
import { SupplierOrders } from "@/features/orders/order-views";

type Tab = "overview" | "products" | "inventory" | "orders" | "requests" | "analytics" | "settings";

const TAB_ICONS: Record<Tab, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  overview: LayoutDashboard, products: Package, inventory: Boxes,
  orders: ShoppingBag, requests: Inbox, analytics: BarChart3, settings: Settings,
};

/**
 * Supplier dashboard (§19–23). A real workspace foundation over the supplier's
 * OWN products — server-guarded by membership, then managed here. In Demo Mode
 * products are a labelled local workspace; when Supabase is configured the same
 * UI is DB-backed (RLS-scoped to this supplier). No fake revenue/orders (§20).
 */
export function SupplierDashboard({
  supplier,
  sampleProducts,
  t,
  tSup,
  tCustom,
  tOrders,
  tPay,
  locale,
}: {
  supplier: Supplier;
  sampleProducts: Product[];
  t: Dictionary["supplier"];
  tSup: Dictionary["suppliers"];
  tCustom: Dictionary["custom"];
  tOrders: Dictionary["orders"];
  tPay: Dictionary["payment"];
  locale: Locale;
}) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const [editing, setEditing] = React.useState<null | { id: string | "new" }>(null);
  const { products, hydrated, create, update, setStatus, remove, byId } = useSupplierProducts(supplier.id);

  const supplierName = locale === "ar" ? supplier.nameAr : supplier.name;
  const tabs: Tab[] = ["overview", "products", "inventory", "orders", "requests", "analytics", "settings"];

  const active = products.filter((p) => p.status === "active");
  const drafts = products.filter((p) => p.status === "draft");
  const outOfStock = products.filter((p) => p.inventoryStatus === "out_of_stock");
  const customizable = products.filter((p) => p.customizable);

  const onSave = (input: ProductInput) => {
    if (editing?.id === "new") create(input);
    else if (editing) update(editing.id, input);
    setEditing(null);
    setTab("products");
  };

  const editInitial: ProductInput | null =
    editing && editing.id !== "new" ? toProductInput(byId(editing.id)) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border-subtle pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl sm:text-4xl">{t.title}</h1>
          {supplier.isDemo && <Badge tone="neutral">{tSup.sampleBadge}</Badge>}
        </div>
        <p className="text-muted">{supplierName}</p>
        <Badge tone="warning" className="w-fit">{t.demoWorkspace}</Badge>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border-subtle" role="tablist" aria-label={t.title}>
        {tabs.map((tb) => {
          const Icon = TAB_ICONS[tb];
          const selected = tab === tb && !editing;
          return (
            <button
              key={tb}
              role="tab"
              aria-selected={selected}
              onClick={() => { setEditing(null); setTab(tb); }}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                selected ? "border-brand text-foreground" : "border-transparent text-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {t.tabs[tb]}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {editing ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {editing.id === "new" ? t.form.newTitle : t.form.editTitle}
            </h2>
            <ProductForm
              t={t.form}
              tInv={t.inventory}
              locale={locale}
              initial={editInitial}
              supplierName={supplier.name}
              onSave={onSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        ) : tab === "overview" ? (
          <section aria-label={t.tabs.overview}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Metric label={t.overview.activeProducts} value={active.length + sampleProducts.length} />
              <Metric label={t.overview.draftProducts} value={drafts.length} />
              <Metric label={t.overview.outOfStock} value={outOfStock.length} />
              <Metric label={t.overview.customizable} value={customizable.length} />
            </div>
            <p className="mt-4 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">{t.overview.note}</p>
          </section>
        ) : tab === "products" ? (
          <section aria-label={t.tabs.products}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">{t.products.localTitle}</h2>
              <Button size="sm" onClick={() => setEditing({ id: "new" })} iconStart={<Plus className="size-4" strokeWidth={2} />}>
                {t.products.new}
              </Button>
            </div>

            {!hydrated ? null : products.length === 0 ? (
              <p className="mt-4 rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">{t.products.empty}</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {products.map((p) => (
                  <LocalRow
                    key={p.id} product={p} t={t} locale={locale} supplierName={supplier.name}
                    onEdit={() => setEditing({ id: p.id })}
                    onPublish={() => setStatus(p.id, "active")}
                    onUnpublish={() => setStatus(p.id, "draft")}
                    onArchive={() => setStatus(p.id, "archived")}
                    onRestore={() => setStatus(p.id, "draft")}
                    onDelete={() => remove(p.id)}
                  />
                ))}
              </ul>
            )}

            {sampleProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-foreground">{t.products.sampleTitle}</h3>
                <p className="mt-0.5 text-sm text-muted">{t.products.sampleNote}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {sampleProducts.map((p) => <SampleCard key={p.slug} product={p} locale={locale} sampleLabel={tSup.sampleBadge} />)}
                </div>
              </div>
            )}
          </section>
        ) : tab === "inventory" ? (
          <section aria-label={t.tabs.inventory}>
            <h2 className="text-lg font-semibold text-foreground">{t.inventory.title}</h2>
            {products.length === 0 ? (
              <p className="mt-4 rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">{t.inventory.empty}</p>
            ) : (
              <ul className="mt-4 flex flex-col divide-y divide-border-subtle rounded-xl border border-border-subtle bg-elevated">
                {products.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <span className="font-medium text-foreground">{locale === "ar" ? p.nameAr || p.name : p.name}</span>
                    <label className="text-xs text-subtle">
                      {t.inventory.status}
                      <select
                        value={p.inventoryStatus}
                        onChange={(e) => updateInventory(update, p, e.target.value as InventoryStatus)}
                        className="mt-1 block h-9 rounded-md border border-border bg-elevated px-2 text-sm"
                      >
                        {(["in_stock", "low_stock", "out_of_stock", "made_to_order"] as InventoryStatus[]).map((s) => (
                          <option key={s} value={s}>{t.inventory[s]}</option>
                        ))}
                      </select>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-subtle">{t.inventory.note}</p>
          </section>
        ) : tab === "orders" ? (
          <section aria-label={t.tabs.orders}>
            <SupplierOrders supplierId={supplier.id} t={tOrders} tPay={tPay} locale={locale} />
          </section>
        ) : tab === "requests" ? (
          <section aria-label={t.tabs.requests}>
            <SupplierRFQ supplierId={supplier.id} t={tCustom.supplier} tCustom={tCustom} locale={locale} />
          </section>
        ) : tab === "analytics" ? (
          <section aria-label={t.tabs.analytics}>
            <h2 className="text-lg font-semibold text-foreground">{t.analytics.title}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Metric label={t.analytics.totalProducts} value={products.length + sampleProducts.length} />
              <Metric label={t.analytics.publishedShare} value={`${products.length ? Math.round((active.length / products.length) * 100) : 0}%`} />
            </div>
            <p className="mt-4 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">{t.analytics.note}</p>
          </section>
        ) : (
          <section aria-label={t.tabs.settings}>
            <h2 className="text-lg font-semibold text-foreground">{t.settings.title}</h2>
            <dl className="mt-4 flex max-w-md flex-col gap-3 rounded-xl border border-border-subtle bg-elevated p-5 text-sm">
              <SettingRow label={t.settings.supplierName} value={supplierName} />
              <SettingRow label={t.settings.location} value={locale === "ar" ? supplier.locationAr : supplier.location} />
              <SettingRow label={t.settings.type} value={tSup.types[supplier.type]} />
              <SettingRow label={t.settings.status} value={supplier.status} />
              <SettingRow label={t.settings.verified} value={supplier.verified ? t.settings.verified : t.settings.notVerified} />
            </dl>
            <p className="mt-3 text-xs text-subtle">{t.settings.demoNote}</p>
          </section>
        )}
      </div>
    </div>
  );
}

function updateInventory(
  update: (id: string, input: ProductInput) => void,
  p: LocalProduct,
  status: InventoryStatus,
) {
  update(p.id, {
    ...toProductInput(p)!,
    inventoryStatus: status,
    stockStatus: status === "out_of_stock" ? "out-of-stock" : status === "made_to_order" ? "made-to-order" : "in-stock",
  });
}

function toProductInput(p: LocalProduct | null): ProductInput | null {
  if (!p) return null;
  const { id: _i, slug: _s, supplierId: _sup, createdAt: _c, updatedAt: _u, ...input } = p;
  void _i; void _s; void _sup; void _c; void _u;
  return input;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-elevated p-4">
      <p className="text-2xl font-semibold text-foreground tabular">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-subtle">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function statusTone(s: string): "neutral" | "success" | "warning" {
  return s === "active" ? "success" : s === "archived" ? "warning" : "neutral";
}

function LocalRow({
  product: p, t, locale, supplierName, onEdit, onPublish, onUnpublish, onArchive, onRestore, onDelete,
}: {
  product: LocalProduct;
  t: Dictionary["supplier"];
  locale: Locale;
  supplierName: string;
  onEdit: () => void; onPublish: () => void; onUnpublish: () => void;
  onArchive: () => void; onRestore: () => void; onDelete: () => void;
}) {
  const name = locale === "ar" ? p.nameAr || p.name : p.name;
  const preview = toPreviewProduct(toProductInput(p)!, p.slug, supplierName);
  const statusLabel = p.status === "active" ? t.products.statusActive : p.status === "archived" ? t.products.statusArchived : t.products.statusDraft;
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-border-subtle bg-elevated p-3">
      <span className="size-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle">
        <ImageFrame ratio="square"><ProductImage product={preview} alt={name} sizes="56px" /></ImageFrame>
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-medium text-foreground">{name || "—"}</p>
        <p className="text-sm text-muted tabular">{formatOmr(p.basePrice, locale)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={statusTone(p.status)}>{statusLabel}</Badge>
        <Badge tone="neutral">{t.products.localBadge}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <IconAction onClick={onEdit} label={t.products.edit} />
        {p.status !== "active" && <TextAction onClick={onPublish} icon={Upload} label={t.products.publish} />}
        {p.status === "active" && <TextAction onClick={onUnpublish} icon={RotateCcw} label={t.products.unpublish} />}
        {p.status !== "archived" ? (
          <TextAction onClick={onArchive} icon={Archive} label={t.products.archive} />
        ) : (
          <TextAction onClick={onRestore} icon={RotateCcw} label={t.products.restore} />
        )}
        <button type="button" onClick={onDelete} aria-label={t.products.delete}
          className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function IconAction({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-full border border-border bg-elevated px-3 py-1.5 text-sm font-medium text-foreground hover:border-taupe hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
      {label}
    </button>
  );
}

function TextAction({ onClick, icon: Icon, label }: { onClick: () => void; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      {label}
    </button>
  );
}

function SampleCard({ product: p, locale, sampleLabel }: { product: Product; locale: Locale; sampleLabel: string }) {
  const name = locale === "ar" ? p.nameAr : p.name;
  return (
    <Link href={`/${locale}/product/${p.slug}`} className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
      <ImageFrame ratio="square" rounded="lg" className="border border-border-subtle">
        <ProductImage product={p} alt={name} sizes="200px" />
      </ImageFrame>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="line-clamp-1 text-sm font-medium text-foreground">{name}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted tabular">{formatOmr(p.price, locale)}</p>
        <Badge tone="neutral">{sampleLabel}</Badge>
      </div>
    </Link>
  );
}
