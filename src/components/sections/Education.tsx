"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCertificateModal } from "@/hooks/useCertificateModal";
import { education, ui, type EducationItem } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CertificateModal = dynamic(
  () =>
    import("@/components/ui/CertificateModal").then((m) => m.CertificateModal),
  { ssr: false }
);

type SchoolMeta = { short: string; logo?: string };

const SCHOOL_META: Record<string, SchoolMeta> = {
  "Universidad Internacional del Ecuador (UIDE)": {
    short: "UIDE",
    logo: "/certificates/institutos/logo-uide.png",
  },
  "Instituto Superior Tecnológico “Daniel Álvarez Burneo” (ISTDAB)": {
    short: "ISTDAB",
    logo: "/certificates/institutos/istdab-logo.png",
  },
  "Universidad Europea": {
    short: "U. EUROPEA",
    logo: "/certificates/institutos/UE-logo.png",
  },
};

function extractYear(period: string): string {
  const match = period.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

export function Education() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();
  const modal = useCertificateModal();

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(
            ".edu-head > *, .edu-entry, .edu-entry *"
          )
          .forEach((el) =>
            gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 })
          );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section header reveal
        gsap.fromTo(
          ".edu-head > *",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".edu-head", start: "top 85%" },
          }
        );

        // Per-entry choreographed timeline
        Array.from(scope.querySelectorAll<HTMLElement>(".edu-entry")).forEach(
          (entry) => {
            const year = entry.querySelector(".edu-year");
            const period = entry.querySelector(".edu-period");
            const status = entry.querySelector(".edu-status");
            const degree = entry.querySelector(".edu-degree");
            const school = entry.querySelector(".edu-school");
            const link = entry.querySelector(".edu-link");
            const logo = entry.querySelector(".edu-logo");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: entry,
                start: "top 82%",
                toggleActions: "play none none none",
              },
              defaults: { ease: "power3.out" },
            });

            if (year)
              tl.fromTo(
                year,
                { autoAlpha: 0, x: -24 },
                { autoAlpha: 1, x: 0, duration: 0.7 }
              );
            if (period)
              tl.fromTo(
                period,
                { autoAlpha: 0, x: -16 },
                { autoAlpha: 1, x: 0, duration: 0.5 },
                "-=0.45"
              );
            if (status)
              tl.fromTo(
                status,
                { autoAlpha: 0, x: -16 },
                { autoAlpha: 1, x: 0, duration: 0.5 },
                "-=0.4"
              );
            if (degree)
              tl.fromTo(
                degree,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.7 },
                "-=0.55"
              );
            if (school)
              tl.fromTo(
                school,
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.5 },
                "-=0.5"
              );
            if (link)
              tl.fromTo(
                link,
                { autoAlpha: 0, y: 8 },
                { autoAlpha: 1, y: 0, duration: 0.4 },
                "-=0.35"
              );
            if (logo)
              tl.fromTo(
                logo,
                { autoAlpha: 0, scale: 0.85 },
                { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.6"
              );
          }
        );
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="educacion" className="relative py-24 md:py-32">
      <div className="container-x">
        <header className="edu-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">05 / {t(ui.education.eyebrow)}</p>
            <h2 className="max-w-3xl text-display-sm font-semibold tracking-tightest text-fg">
              {t(ui.education.title)}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
              {t(ui.education.subtitle)}
            </p>
          </div>
          <p className="mono-tag">
            {String(education.length).padStart(2, "0")} ·{" "}
            {locale === "es" ? "ESTUDIOS" : "STUDIES"}
          </p>
        </header>

        <ol className="mt-12 flex flex-col">
          {education.map((item, i) => {
            const meta = SCHOOL_META[item.school] ?? { short: "EDU" };
            const isLast = i === education.length - 1;
            const onOpen = item.image
              ? () =>
                  modal.open({
                    imageUrl: item.image!,
                    title: t(item.degree),
                    institution: item.school,
                    date: t(item.period),
                  })
              : undefined;
            return (
              <li
                key={item.school + t(item.status)}
                className={`edu-entry py-10 md:py-12 ${
                  !isLast ? "border-b border-rule" : ""
                }`}
              >
                <EducationEntry item={item} meta={meta} onOpen={onOpen} />
              </li>
            );
          })}
        </ol>
      </div>

      {modal.item && (
        <CertificateModal
          isOpen={modal.isOpen}
          onClose={modal.close}
          imageUrl={modal.item.imageUrl}
          title={modal.item.title}
          institution={modal.item.institution}
          date={modal.item.date}
        />
      )}
    </section>
  );
}

function EducationEntry({
  item,
  meta,
  onOpen,
}: {
  item: EducationItem;
  meta: SchoolMeta;
  onOpen?: () => void;
}) {
  const { t } = useLocale();
  const statusLabel = t(item.status);
  const isInProgress =
    statusLabel === "En curso" || statusLabel === "In progress";
  const year = extractYear(item.period.es);

  return (
    <div className="group grid grid-cols-12 gap-x-6 gap-y-6 md:gap-x-10">
      <div className="col-span-12 flex flex-col gap-3 md:col-span-3">
        <span className="edu-year font-mono text-2xl font-medium text-fg">
          {year}
        </span>
        <span className="edu-period mono-tag">{t(item.period)}</span>
        {/* Status pill — red pulsing for "En curso", green static for graduated */}
        <span
          className={`edu-status mono-tag inline-flex items-center gap-1.5 ${
            isInProgress ? "text-err" : "text-ok"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isInProgress
                ? "animate-pulse-dot bg-err shadow-[0_0_10px_rgba(248,113,113,0.7)]"
                : "bg-ok shadow-[0_0_8px_rgba(74,222,128,0.5)]"
            }`}
          />
          {statusLabel}
        </span>
      </div>

      <div className="col-span-12 md:col-span-7">
        <h3 className="edu-degree text-2xl font-semibold tracking-tight text-fg md:text-3xl">
          {t(item.degree)}
        </h3>
        <p className="edu-school mt-2 text-sm text-fg-muted">{item.school}</p>

        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            className="edu-link link-ghost mt-6 font-mono text-xs uppercase tracking-tag"
          >
            <span>{t(ui.modal.viewDiploma)}</span>
            <span aria-hidden>↗</span>
          </button>
        )}
      </div>

      <aside className="col-span-12 md:col-span-2 md:flex md:justify-end">
        <button
          type="button"
          onClick={onOpen}
          disabled={!onOpen}
          className="edu-logo group/logo relative grid h-20 w-20 place-items-center overflow-hidden border border-rule bg-fg transition-colors disabled:cursor-default disabled:opacity-90 enabled:hover:border-accent"
          aria-label={
            onOpen ? `${t(ui.modal.viewDiploma)}: ${t(item.degree)}` : item.school
          }
          title={meta.short}
        >
          {meta.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta.logo}
              alt={meta.short}
              className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover/logo:scale-105"
            />
          ) : (
            <span className="font-mono text-xs font-semibold text-surface">
              {meta.short}
            </span>
          )}
        </button>
      </aside>
    </div>
  );
}
