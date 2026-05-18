"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills, ui, type Skill } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { TechIcon } from "@/components/ui/TechIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Inline level bar — thin track with accent fill, technical feel.
function LevelBar({ level }: { level: number }) {
  return (
    <span
      className="relative block h-[2px] w-20 bg-rule md:w-24"
      aria-label={`${level} of 100`}
    >
      <span
        className="absolute left-0 top-0 h-full bg-accent"
        style={{ width: `${level}%` }}
      />
    </span>
  );
}

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();

  const grouped = useMemo(() => {
    return skills.reduce<Record<string, Skill[]>>((acc, s) => {
      const key = s.group[locale];
      (acc[key] ||= []).push(s);
      return acc;
    }, {});
  }, [locale]);

  const marqueeItems = skills.map((s) => s.name);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(".skills-head > *, .skill-group")
          .forEach((el) => gsap.set(el, { autoAlpha: 1, y: 0 }));
        scope
          .querySelectorAll<HTMLElement>(".skill-marquee-track")
          .forEach((el) => (el.style.animationPlayState = "paused"));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".skills-head > *",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".skills-head", start: "top 85%" },
          }
        );

        const groups = Array.from(
          scope.querySelectorAll<HTMLElement>(".skill-group")
        );
        ScrollTrigger.batch(groups, {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power3.out",
                overwrite: "auto",
              }
            ),
        });
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="habilidades" className="relative bg-surface-raised py-24 md:py-32">
      <div className="container-x">
        <header className="skills-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">04 / {t(ui.skills.eyebrow)}</p>
            <h2 className="max-w-3xl text-display-sm font-semibold tracking-tightest text-fg">
              {t(ui.skills.title)}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
              {t(ui.skills.subtitle)}
            </p>
          </div>
          <p className="mono-tag">
            {String(skills.length).padStart(2, "0")} ·{" "}
            {locale === "es" ? "TECNOLOGÍAS" : "TECHNOLOGIES"}
          </p>
        </header>
      </div>

      {/* Marquee — full-bleed, technical, monospace feel */}
      <div
        className="relative mt-12 select-none overflow-hidden border-y border-rule py-5"
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-surface-raised to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-surface-raised to-transparent" />
        <MarqueeRow items={marqueeItems} />
      </div>

      {/* Grouped breakdown */}
      <div className="container-x mt-20">
        <div className="grid grid-cols-1 gap-x-14 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([group, items], gi) => (
            <div key={group} className="skill-group">
              <header className="border-b border-rule pb-4">
                <p className="font-mono text-xs uppercase tracking-tag text-accent md:text-sm">
                  {String(gi + 1).padStart(2, "0")} · {group}
                </p>
              </header>

              <ul className="mt-6 divide-y divide-rule">
                {items.map((s) => (
                  <li
                    key={s.name}
                    className="group/skill flex items-center justify-between gap-4 py-4 md:py-5"
                  >
                    <span className="flex items-center gap-4">
                      <TechIcon name={s.name} size={22} />
                      <span className="text-base font-medium text-fg transition-colors group-hover/skill:text-accent md:text-lg">
                        {s.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-3">
                      <LevelBar level={s.level} />
                      <span className="w-6 text-right font-mono text-xs tabular-nums text-fg-subtle md:text-sm">
                        {s.level}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="skill-marquee-track flex shrink-0 items-center whitespace-nowrap will-change-transform"
      style={{ animation: `marquee 45s linear infinite` }}
    >
      {doubled.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="mx-8 inline-flex items-center gap-4 font-mono text-xl font-medium text-fg md:text-2xl"
        >
          <span>{name}</span>
          <span className="text-accent" aria-hidden>
            ·
          </span>
        </span>
      ))}
    </div>
  );
}
