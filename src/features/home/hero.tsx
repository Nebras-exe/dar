import { ArrowRight, Sparkles, Wallet } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/ui/image-frame";
import { ProductImage } from "@/components/shop/product-image";
import { getAllProducts, formatOmr, type Product } from "@/lib/catalog";
import { RoomIllustration } from "./room-illustration";

/**
 * The hero — an editorial "show, don't tell" opening. Left: an oversized display
 * headline + the three-beat promise (room → budget/taste → real design) + CTAs.
 * Right: an immersive room scene with REAL catalog pieces floating over it (name
 * + OMR price) and the AI/budget cue — communicating room + AI + real furniture
 * in one glance. All product data is real; the render is a labelled sample.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const h = dict.home.hero;
  // Surface the first few real catalog pieces (empty until real products are added).
  const pieces: Product[] = getAllProducts().slice(0, 3);
  const steps = [h.step1, h.step2, h.step3];

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Warm ambient wash behind the whole hero. */}
      <div aria-hidden="true" className="bg-linen pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 end-[-10%] size-[42rem] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(240,228,218,0.9), transparent)" }}
      />

      <Container width="wide" className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* ── Copy ─────────────────────────────────────────────────────── */}
          <div className="relative z-10">
            <span className="kicker animate-fade-up">{h.eyebrow}</span>

            <h1
              className="text-display animate-fade-up mt-5"
              style={{ animationDelay: "60ms" }}
            >
              {h.titleLine1}{" "}
              <span className="text-brand">{h.titleLine2}</span>
            </h1>

            <p
              className="animate-fade-up measure mt-6 text-lg leading-relaxed text-muted sm:text-xl"
              style={{ animationDelay: "120ms" }}
            >
              {h.subtitle}
            </p>

            {/* Three-beat promise */}
            <ol
              className="animate-fade-up mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm"
              style={{ animationDelay: "160ms" }}
            >
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand tabular">
                    {i + 1}
                  </span>
                  <span className="font-medium text-foreground">{s}</span>
                  {i < steps.length - 1 && (
                    <ArrowRight className="ms-1 size-3.5 text-subtle rtl:rotate-180" strokeWidth={2} aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>

            <div
              className="animate-fade-up mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "200ms" }}
            >
              <Button
                size="lg"
                href={`/${locale}/design`}
                iconStart={<Sparkles className="size-5" strokeWidth={2} />}
              >
                {h.ctaPrimary}
              </Button>
              <Button size="lg" variant="outline" href={`/${locale}/shop`}>
                {h.ctaSecondary}
              </Button>
            </div>
          </div>

          {/* ── Visual centrepiece ───────────────────────────────────────── */}
          <div
            className="animate-fade-up relative"
            style={{ animationDelay: "140ms" }}
          >
            {/* Immersive room */}
            <ImageFrame
              ratio="wide"
              rounded="xl"
              className="shadow-[var(--shadow-lg)] ring-1 ring-black/[0.04]"
            >
              <RoomIllustration variant="after" />
            </ImageFrame>

            {/* Sample badge */}
            <span className="absolute start-4 top-4 rounded-full bg-elevated/90 px-2.5 py-1 text-[0.7rem] font-medium text-muted shadow-[var(--shadow-sm)] backdrop-blur-sm">
              {h.demoBadge}
            </span>

            {/* AI + budget cue */}
            <div className="absolute end-4 top-4 flex items-center gap-1.5 rounded-full bg-brand/95 px-3 py-1.5 text-xs font-medium text-brand-foreground shadow-[var(--shadow-md)]">
              <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {h.matchesValue}
            </div>

            {/* Floating REAL product references (hidden until real products exist) */}
            <div className="pointer-events-none absolute -bottom-5 start-2 end-2 flex items-end justify-between gap-3 sm:-bottom-6">
              {pieces.map((p, i) => {
                const name = locale === "ar" ? p.nameAr : p.name;
                return (
                  <figure
                    key={p.slug}
                    className={
                      "flex items-center gap-2.5 rounded-xl border border-border-subtle bg-elevated/95 p-2 shadow-[var(--shadow-md)] backdrop-blur-sm" +
                      (i === 1 ? " hidden sm:flex" : "")
                    }
                  >
                    <span className="size-11 shrink-0 overflow-hidden rounded-lg">
                      <ProductImage product={p} alt={name} sizes="44px" />
                    </span>
                    <figcaption className="pe-1">
                      <span className="block max-w-[8.5rem] truncate text-xs font-medium text-foreground">
                        {name}
                      </span>
                      <span className="block text-xs font-semibold text-brand tabular">
                        {formatOmr(p.price, locale)}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            {/* Budget + total strip under the floating cards */}
            <div className="mt-10 flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface/80 px-4 py-3 backdrop-blur-sm sm:mt-12">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <Wallet className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
                {h.budgetLabel}: <span className="font-semibold text-foreground tabular">{h.budgetValue}</span>
              </span>
              <span className="text-sm text-muted">
                {h.totalLabel}:{" "}
                <span className="font-semibold text-foreground tabular">{h.totalValue}</span>
              </span>
            </div>
            <p className="mt-2 text-center text-xs text-subtle">{h.realCaption}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
