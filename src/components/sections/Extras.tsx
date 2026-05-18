"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { languages, trainings, talks, ui, type Bi } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const LANG_PROFICIENCY: Record<string, number> = {
  Español: 5,
  Spanish: 5,
  Inglés: 4,
  English: 4,
};

export function Extras() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();
  const hasTrainings = trainings.length > 0;

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(
            ".extras-head > *, .extras-col, .extras-col *"
          )
          .forEach((el) => gsap.set(el, { autoAlpha: 1, y: 0, scaleX: 1 }));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section header
        gsap.fromTo(
          ".extras-head > *",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".extras-head", start: "top 85%" },
          }
        );

        // Per-column choreographed reveal
        Array.from(scope.querySelectorAll<HTMLElement>(".extras-col")).forEach(
          (col, ci) => {
            const header = col.querySelector(".extras-col-header");
            const items = col.querySelectorAll(".extras-item");
            const bars = col.querySelectorAll(".extras-bar-fill");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: col,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              defaults: { ease: "power3.out" },
              delay: ci * 0.12,
            });

            if (header)
              tl.fromTo(
                header,
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, duration: 0.5 }
              );
            if (items.length)
              tl.fromTo(
                items,
                { autoAlpha: 0, y: 12 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.45,
                  stagger: 0.07,
                  ease: "power2.out",
                },
                "-=0.3"
              );
            if (bars.length)
              tl.fromTo(
                bars,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 0.6,
                  stagger: 0.04,
                  ease: "power2.out",
                  transformOrigin: "left center",
                },
                "-=0.4"
              );
          }
        );
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="extras" className="relative bg-surface-raised py-24 md:py-32">
      <div className="container-x">
        <header className="extras-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">07 / {t(ui.extras.eyebrow)}</p>
            <h2 className="max-w-3xl text-display-sm font-semibold tracking-tightest text-fg">
              {t(ui.extras.title)}
            </h2>
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Languages */}
          <div className="extras-col">
            <header className="extras-col-header flex items-baseline justify-between border-b border-rule pb-3">
              <p className="mono-tag text-accent">
                01 · {t(ui.extras.languages)}
              </p>
              <span className="font-mono text-[10px] text-fg-subtle">
                {languages.length}
              </span>
            </header>
            <ul className="mt-5 divide-y divide-rule">
              {languages.map((l) => {
                const name = t(l.name);
                const prof = LANG_PROFICIENCY[name] ?? 3;
                return (
                  <li key={name} className="extras-item py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-base font-medium text-fg">
                        {name}
                      </span>
                      <span className="mono-tag">{t(l.level)}</span>
                    </div>
                    <ProficiencyBar value={prof} />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Trainings */}
          {hasTrainings && (
            <div className="extras-col">
              <header className="extras-col-header flex items-baseline justify-between border-b border-rule pb-3">
                <p className="mono-tag text-accent">
                  02 · {t(ui.extras.trainings)}
                </p>
                <span className="font-mono text-[10px] text-fg-subtle">
                  {trainings.length}
                </span>
              </header>
              <ul className="mt-5 space-y-3">
                {trainings.map((tr, i) => (
                  <li
                    key={i}
                    className="extras-item flex gap-3 text-sm leading-relaxed text-fg-muted"
                  >
                    <span
                      className="mt-2 h-px w-3 shrink-0 bg-accent"
                      aria-hidden
                    />
                    <span>{t(tr)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Talks */}
          <div className={`extras-col ${hasTrainings ? "" : "md:col-span-2 lg:col-span-2"}`}>
            <header className="extras-col-header flex items-baseline justify-between border-b border-rule pb-3">
              <p className="mono-tag text-accent">
                {hasTrainings ? "03" : "02"} · {t(ui.extras.talks)}
              </p>
              <span className="font-mono text-[10px] text-fg-subtle">
                {talks.length}
              </span>
            </header>
            <ul className="mt-5 divide-y divide-rule">
              {talks.map((talk, i) => (
                <TalkEntry key={i} title={talk.title} topic={talk.topic} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProficiencyBar({ value }: { value: number }) {
  const total = 5;
  return (
    <div className="mt-3 flex items-center gap-1" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-px flex-1 ${i < value ? "extras-bar-fill bg-accent" : "bg-rule"}`}
        />
      ))}
    </div>
  );
}

function TalkEntry({ title, topic }: { title: Bi; topic: Bi }) {
  const { t } = useLocale();
  return (
    <li className="extras-item py-4">
      <p className="text-sm leading-relaxed text-fg">{t(title)}</p>
      <p className="mt-2 font-mono text-xs text-accent">→ {t(topic)}</p>
    </li>
  );
}
