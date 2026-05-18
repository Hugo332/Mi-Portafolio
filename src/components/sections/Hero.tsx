"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { assets, personal, ui, type Bi } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

// Local bilingual strings — kept here so the Hero stays self-contained.
const HERO_I18N: Record<string, Bi> = {
  available: {
    es: "Disponible para nuevos proyectos",
    en: "Available for new projects",
  },
  buildLine: { es: "Construyo software ", en: "Building software " },
  buildAccent: { es: "que funciona.", en: "that works." },
  specRole: { es: "Rol", en: "Role" },
  specCurrently: { es: "Actualmente", en: "Currently" },
  specStack: { es: "Stack", en: "Stack" },
  specBased: { es: "Ubicación", en: "Based in" },
  specCurrentlyValue: {
    es: "Máster en Big Data @ U. Europea",
    en: "Big Data MSc @ U. Europea",
  },
  viewWork: { es: "Ver proyectos", en: "View work" },
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();
  const year = new Date().getFullYear();

  // Split full name into two display lines.
  // "Hugo Alexander Lima Bastidas" → ["Hugo Alexander", "Lima Bastidas"]
  const nameParts = personal.name.trim().split(/\s+/);
  const mid = Math.ceil(nameParts.length / 2);
  const lineOne = nameParts.slice(0, mid).join(" ");
  const lineTwo = nameParts.slice(mid).join(" ");

  // Entrance animation — runs ONCE on mount only.
  // We don't re-run on `locale` change because:
  //   1. The full name doesn't depend on locale — its chars don't unmount.
  //   2. Re-running would briefly hide elements (yPercent: 110) creating the
  //      "screen goes black" flash the user reported.
  // Bilingual text (build line, tagline, spec values) simply updates in
  // place — its parent spans already have opacity:1 from the finished anim.
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const meta = scope.querySelectorAll<HTMLElement>(".hero-meta");
      const status = scope.querySelector<HTMLElement>(".hero-status");
      const charsName = scope.querySelectorAll<HTMLElement>(".hero-char-name");
      const buildLine = scope.querySelector<HTMLElement>(".hero-build-line");
      const tagline = scope.querySelector<HTMLElement>(".hero-tagline");
      const rule = scope.querySelector<HTMLElement>(".hero-rule");
      const specs = scope.querySelectorAll<HTMLElement>(".hero-spec");
      const ctas = scope.querySelectorAll<HTMLElement>(".hero-cta > *");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [meta, status, charsName, buildLine, tagline, rule, specs, ctas],
          { autoAlpha: 1, x: 0, y: 0, yPercent: 0, scaleX: 1 }
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hide initially
        gsap.set(meta, { autoAlpha: 0, y: 8 });
        if (status) gsap.set(status, { autoAlpha: 0, y: 8 });
        gsap.set(charsName, { autoAlpha: 0, yPercent: 110 });
        if (buildLine) gsap.set(buildLine, { autoAlpha: 0, y: 24 });
        if (tagline) gsap.set(tagline, { autoAlpha: 0, y: 16 });
        if (rule)
          gsap.set(rule, {
            autoAlpha: 0,
            scaleX: 0,
            transformOrigin: "left center",
          });
        gsap.set(specs, { autoAlpha: 0, y: 12 });
        gsap.set(ctas, { autoAlpha: 0, y: 12 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.15,
        });

        tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 })
          .to(status, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.25")
          .to(
            charsName,
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.85,
              stagger: 0.022,
              ease: "expo.out",
            },
            "-=0.15"
          )
          .to(buildLine, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.4")
          .to(tagline, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.45")
          .to(
            rule,
            { autoAlpha: 1, scaleX: 1, duration: 0.7, ease: "expo.out" },
            "-=0.4"
          )
          .to(
            specs,
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 },
            "-=0.4"
          )
          .to(
            ctas,
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
            "-=0.3"
          );
      });
    },
    { scope: root }
    // NOTE: no dependencies → animation runs on mount only.
  );

  // Char-by-char span builder for the full name.
  // Keys are stable per index (name doesn't change with locale).
  const renderChars = (text: string, prefix: string) =>
    Array.from(text).map((c, i) => (
      <span
        key={`${prefix}-${i}`}
        className="hero-char-name inline-block"
        style={{ whiteSpace: c === " " ? "pre" : "normal" }}
      >
        {c}
      </span>
    ));

  return (
    <section
      ref={root}
      id="inicio"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-between pt-28 pb-12">
        {/* ── Top meta strip ─────────────────────────────────────── */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <span className="hero-meta mono-tag">
            {t(personal.location)} · {year}
          </span>
          <span className="hero-meta mono-tag hidden md:inline">
            {locale.toUpperCase()}
          </span>
        </header>

        {/* ── Main block ─────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-center py-12">
          <p className="hero-status status-dot mono-tag mb-8 text-fg">
            {t(HERO_I18N.available)} · {year}
          </p>

          <h1
            className="hero-heading max-w-5xl text-display font-semibold tracking-tightest text-fg"
            aria-label={personal.name}
          >
            <span className="block overflow-hidden" aria-hidden>
              <span className="block leading-[0.95]">
                {renderChars(lineOne, "ln1")}
              </span>
            </span>
            <span className="block overflow-hidden" aria-hidden>
              <span className="block leading-[0.95]">
                {renderChars(lineTwo, "ln2")}
                <span className="hero-char-name inline-block text-accent">.</span>
              </span>
            </span>
          </h1>

          {/* Secondary tagline — bilingual */}
          <p
            className="hero-build-line mt-6 max-w-3xl text-2xl font-medium leading-[1.15] tracking-tight text-fg-muted md:text-4xl"
          >
            {t(HERO_I18N.buildLine)}
            <span className="text-accent">{t(HERO_I18N.buildAccent)}</span>
          </p>

          <p className="hero-tagline mt-8 max-w-xl text-sm leading-relaxed text-fg-muted md:text-base">
            {t(personal.tagline)}
          </p>

          {/* Hairline rule that draws in after the headline */}
          <span
            className="hero-rule mt-10 block h-px w-full max-w-3xl bg-rule"
            aria-hidden
          />
        </div>

        {/* ── Bottom spec sheet + CTAs ───────────────────────────── */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-rule pt-10 md:grid-cols-12">
          <dl className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-6 md:col-span-8 md:grid-cols-4">
            <Spec label={t(HERO_I18N.specRole)} value={t(personal.role)} />
            <Spec
              label={t(HERO_I18N.specCurrently)}
              value={t(HERO_I18N.specCurrentlyValue)}
            />
            <Spec label={t(HERO_I18N.specStack)} value="TS · Next · Laravel · AWS" />
            <Spec label={t(HERO_I18N.specBased)} value={t(personal.location)} />
          </dl>

          <div className="hero-cta col-span-12 flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end">
            <a
              href="https://github.com/Hugo332"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3 text-sm font-medium"
            >
              <span>{t(HERO_I18N.viewWork)}</span>
              <span aria-hidden>→</span>
            </a>
            <a
              href={assets.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-6 py-3 text-sm font-medium"
            >
              <span>{t(ui.cta.viewCv)}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="hero-spec flex min-w-0 flex-col gap-2">
      <dt className="mono-tag">{label}</dt>
      <dd
        className="text-xs font-medium leading-snug text-fg md:text-sm"
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
