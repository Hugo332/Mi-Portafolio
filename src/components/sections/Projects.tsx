"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projects, ui } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { TechIcon } from "@/components/ui/TechIcon";

export function Projects() {
  const ref = useScrollAnimation<HTMLElement>();
  const { t } = useLocale();

  return (
    <section ref={ref} id="proyectos" className="relative py-28 md:py-40">
      <div className="container-x">
        {/* ── Section header ──────────────────────────────────────── */}
        <header className="grid grid-cols-12 items-end gap-6 border-b border-rule pb-8">
          <p className="reveal section-no col-span-12 md:col-span-2">
            № 03 / {t(ui.projects.eyebrow)}
          </p>
          <h2 className="reveal col-span-12 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-light leading-[1.02] tracking-editorial text-cream md:col-span-7">
            {t(ui.projects.title).split(" ").map((word, i, arr) => {
              const isAccent = i === arr.length - 1;
              return (
                <span key={i}>
                  {isAccent ? (
                    <span className="italic-editorial text-accent">{word}</span>
                  ) : (
                    word
                  )}
                  {i < arr.length - 1 ? " " : ""}
                </span>
              );
            })}
          </h2>
          <p className="reveal col-span-12 max-w-md text-sm leading-relaxed text-cream-muted md:col-span-3">
            {t(ui.projects.subtitle)}
          </p>
        </header>

        {/* ── Editorial entries — stacked numbered articles ──────── */}
        <div className="mt-16 flex flex-col">
          {projects.map((p, idx) => {
            const num = String(idx + 1).padStart(3, "0");
            const isLast = idx === projects.length - 1;
            return (
              <article
                key={p.title}
                className={`reveal group relative grid grid-cols-12 gap-x-6 gap-y-6 py-12 md:gap-x-10 md:py-16 ${
                  !isLast ? "border-b border-rule" : ""
                }`}
              >
                {/* Number marker — huge, low-contrast, set against the gutter */}
                <div className="col-span-12 md:col-span-2">
                  <span className="font-display text-5xl font-light leading-none text-cream-subtle/40 transition-colors duration-500 group-hover:text-accent md:text-7xl">
                    {num}
                  </span>
                </div>

                {/* Main content */}
                <div className="col-span-12 md:col-span-7">
                  <h3 className="font-display text-3xl font-light leading-[1.05] tracking-tight text-cream transition-colors duration-500 group-hover:text-accent md:text-5xl">
                    {p.title}
                  </h3>

                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream-muted md:text-lg">
                    {t(p.summary)}
                  </p>

                  <ul className="mt-6 space-y-2 border-l border-rule pl-5 text-sm text-cream-muted md:text-base">
                    {t(p.highlights).map((h, i) => (
                      <li key={i} className="leading-relaxed">
                        <span className="mr-2 font-mono text-[10px] text-cream-subtle">
                          —
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  {(p.href || p.repo) && (
                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.18em]">
                      {p.href && (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cream underline decoration-rule decoration-1 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
                        >
                          {t(ui.projects.live)} ↗
                        </a>
                      )}
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cream-muted underline decoration-rule decoration-1 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
                        >
                          {t(ui.projects.repo)} ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Tech stack — right column, listed vertically as a colophon */}
                <aside className="col-span-12 md:col-span-3">
                  <p className="section-no mb-3 text-cream-subtle">
                    Tech stack
                  </p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:gap-y-2.5">
                    {p.tags.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cream-muted"
                      >
                        <TechIcon name={tag} size={14} />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </aside>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
