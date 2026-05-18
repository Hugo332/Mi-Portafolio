"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, ui } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { TechIcon } from "@/components/ui/TechIcon";

// Company logo tile — white background so brand-coloured PNGs render
// correctly on the dark theme; falls back to initials if the asset 404s.
function CompanyLogo({ src, company }: { src?: string; company: string }) {
  const [errored, setErrored] = useState(false);
  const initials = company
    .replace(/centro de especialidades médicas|empresa/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Shared classes — soft-rounded card with hairline ring, subtle elevation,
  // and a lime-accented hover state for tactile feedback.
  const tile =
    "exp-logo group/logo relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-rule transition-all duration-300 hover:ring-accent/60 hover:shadow-[0_10px_30px_-12px_rgba(190,242,100,0.25)] md:h-32 md:w-32";

  if (!src || errored) {
    return (
      <span
        aria-hidden
        title={company}
        className={`${tile} bg-surface-raised`}
      >
        <span className="font-mono text-2xl font-semibold text-fg-muted">
          {initials}
        </span>
        {/* Inner highlight for depth */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.03]" />
      </span>
    );
  }

  return (
    <span title={company} className={tile}>
      {/* Soft off-white gradient so the logo doesn't sit on flat pure white */}
      <span
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(120% 100% at 30% 20%, #ffffff 0%, #f5f5f5 100%)",
        }}
        aria-hidden
      />
      {/* Inner hairline for definition against the white */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5"
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={company}
        onError={() => setErrored(true)}
        className="relative block h-full w-full object-contain p-4 transition-transform duration-500 group-hover/logo:scale-105"
      />
    </span>
  );
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function extractYear(period: string): string {
  const match = period.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(".exp-head > *, .exp-entry, .exp-entry *")
          .forEach((el) => gsap.set(el, { autoAlpha: 1, y: 0 }));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".exp-head > *",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".exp-head", start: "top 85%" },
          }
        );

        Array.from(scope.querySelectorAll<HTMLElement>(".exp-entry")).forEach(
          (entry) => {
            const meta = entry.querySelectorAll(".exp-meta-item");
            const logo = entry.querySelector(".exp-logo");
            const role = entry.querySelector(".exp-role");
            const company = entry.querySelector(".exp-company");
            const bullets = entry.querySelectorAll(".exp-bullet");
            const stack = entry.querySelectorAll(".exp-stack-item");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: entry,
                start: "top 82%",
                toggleActions: "play none none none",
              },
              defaults: { ease: "power3.out" },
            });

            tl.fromTo(
              meta,
              { autoAlpha: 0, y: 8 },
              { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 }
            );
            if (logo)
              tl.fromTo(
                logo,
                { autoAlpha: 0, scale: 0.85 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.55,
                  ease: "back.out(1.7)",
                },
                "-=0.3"
              );
            if (role)
              tl.fromTo(
                role,
                { autoAlpha: 0, y: 16 },
                { autoAlpha: 1, y: 0, duration: 0.6 },
                "-=0.3"
              );
            if (company)
              tl.fromTo(
                company,
                { autoAlpha: 0, y: 8 },
                { autoAlpha: 1, y: 0, duration: 0.4 },
                "-=0.45"
              );
            if (bullets.length)
              tl.fromTo(
                bullets,
                { autoAlpha: 0, y: 6 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.05,
                  ease: "power2.out",
                },
                "-=0.3"
              );
            if (stack.length)
              tl.fromTo(
                stack,
                { autoAlpha: 0, y: 6 },
                { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.03 },
                "-=0.3"
              );
          }
        );
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="experiencia" className="relative py-24 md:py-32">
      <div className="container-x">
        <header className="exp-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">03 / {t(ui.experience.eyebrow)}</p>
            <h2 className="max-w-3xl text-display-sm font-semibold tracking-tightest text-fg">
              {t(ui.experience.title)}
            </h2>
          </div>
          <p className="mono-tag">
            {String(experiences.length).padStart(2, "0")} ·{" "}
            {locale === "es" ? "ROLES" : "ROLES"}
          </p>
        </header>

        <ol className="mt-12 flex flex-col">
          {experiences.map((exp, i) => {
            const year = extractYear(exp.period.es);
            const isLast = i === experiences.length - 1;
            return (
              <li
                key={i}
                className={`exp-entry grid grid-cols-12 gap-x-6 gap-y-6 py-10 md:gap-x-10 md:py-12 ${
                  !isLast ? "border-b border-rule" : ""
                }`}
              >
                {/* Year + meta + logo (left column) */}
                <div className="col-span-12 flex flex-col gap-3 md:col-span-3">
                  <span className="exp-meta-item font-mono text-2xl font-medium text-fg">
                    {year}
                  </span>
                  <span className="exp-meta-item mono-tag">
                    {t(exp.period)}
                  </span>
                  <span className="exp-meta-item mono-tag text-accent">
                    {t(exp.duration)}
                  </span>
                  <div className="mt-2">
                    <CompanyLogo src={exp.logo} company={exp.company} />
                  </div>
                </div>

                {/* Main: role + company + bullets */}
                <div className="col-span-12 md:col-span-9">
                  <h3 className="exp-role text-2xl font-semibold tracking-tight text-fg md:text-3xl">
                    {t(exp.role)}
                  </h3>
                  <p className="exp-company mt-2 text-sm text-fg-muted">
                    <span className="text-fg">{exp.company}</span>
                    {exp.location && (
                      <span className="ml-2 text-fg-subtle">
                        · {exp.location}
                      </span>
                    )}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {t(exp.bullets).map((b, j) => (
                      <li
                        key={j}
                        className="exp-bullet flex gap-3 text-sm leading-relaxed text-fg-muted md:text-base"
                      >
                        <span
                          className="mt-2 h-px w-3 shrink-0 bg-accent"
                          aria-hidden
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.stack.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-rule pt-5">
                      <span className="mono-tag mr-1">Stack</span>
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="exp-stack-item inline-flex items-center gap-1.5 border border-rule px-2 py-1 font-mono text-[11px] text-fg-muted transition-colors hover:border-accent/40 hover:text-fg"
                        >
                          <TechIcon name={tech} size={12} />
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
