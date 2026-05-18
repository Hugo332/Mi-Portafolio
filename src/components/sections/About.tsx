"use client";

import { useRef } from "react";
import type { IconType } from "react-icons";
import { FiMail, FiLinkedin, FiMapPin, FiPhone } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, assets, personal, ui } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { Photo } from "@/components/ui/Photo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function About() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();

  const initials = personal.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(
            ".about-head > *, .about-photo, .about-body, .about-item"
          )
          .forEach((el) =>
            gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 })
          );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header — eyebrow + title
        gsap.fromTo(
          ".about-head > *",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-head", start: "top 85%" },
          }
        );

        // Photo — slides in from left with subtle scale
        gsap.fromTo(
          ".about-photo",
          { autoAlpha: 0, x: -24, scale: 0.96 },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: ".about-photo", start: "top 85%" },
          }
        );

        // Body paragraph
        gsap.fromTo(
          ".about-body",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-body", start: "top 85%" },
          }
        );

        // Colophon items — cascade stagger
        gsap.fromTo(
          ".about-item",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-colophon", start: "top 88%" },
          }
        );
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="sobre-mi" className="relative py-24 md:py-32">
      <div className="container-x">
        <header className="about-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">02 / {t(ui.about.eyebrow)}</p>
            <h2 className="max-w-3xl text-display-sm font-semibold tracking-tightest text-fg">
              {t(ui.about.title)}
            </h2>
          </div>
        </header>

        <div className="mt-16 grid grid-cols-12 gap-x-8 gap-y-10 md:gap-x-12">
          <div className="about-photo col-span-12 md:col-span-4">
            <Photo
              src={assets.photo}
              alt={personal.name}
              initials={initials}
              className="mx-auto aspect-[3/4] w-56 md:mx-0 md:w-full"
            />
          </div>

          <div className="col-span-12 md:col-span-8">
            <p className="about-body text-base leading-relaxed text-fg-muted md:text-lg">
              {t(about)}
            </p>

            <dl className="about-colophon mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-rule pt-8 sm:grid-cols-4">
              <Item
                icon={FiMapPin}
                label={t(ui.about.location)}
                value={t(personal.location)}
              />
              <Item
                icon={FiMail}
                label={t(ui.about.email)}
                value={personal.email}
                href={`mailto:${personal.email}`}
              />
              <Item
                icon={FiPhone}
                label={t(ui.about.phone)}
                value={personal.phone}
              />
              <Item
                icon={FiLinkedin}
                label={t(ui.about.linkedin)}
                value={t(ui.about.viewProfile)}
                href={personal.linkedin}
                external
              />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: IconType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  // The icon tile + label live in a row; the value sits underneath.
  // When the row is a link, the whole `group` triggers a unified hover.
  const head = (
    <>
      <span
        aria-hidden
        className="grid h-8 w-8 shrink-0 place-items-center border border-rule bg-surface-raised text-fg-muted transition-all duration-300 group-hover:border-accent/60 group-hover:bg-accent/10 group-hover:text-accent"
      >
        <Icon size={13} />
      </span>
      <dt className="mono-tag">{label}</dt>
    </>
  );

  // Render the value: if it contains "@", split at it and insert a soft
  // break opportunity (<wbr>) so the browser can wrap user/domain cleanly
  // instead of breaking mid-word (e.g. "hugo…/gm/ail.com").
  const renderValue = (text: string) => {
    if (!text.includes("@")) return text;
    const idx = text.indexOf("@");
    return (
      <>
        {text.slice(0, idx)}
        <wbr />
        {text.slice(idx)}
      </>
    );
  };

  const valueEl = href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex flex-col gap-2.5"
      title={value}
    >
      <span className="flex items-center gap-2.5">{head}</span>
      <span className="break-words text-xs font-medium leading-snug text-fg transition-colors group-hover:text-accent md:text-sm">
        {renderValue(value)}
        {external && (
          <span className="ml-1 text-fg-subtle transition-colors group-hover:text-accent" aria-hidden>
            ↗
          </span>
        )}
      </span>
    </a>
  ) : (
    <div className="group" title={value}>
      <div className="flex items-center gap-2.5">{head}</div>
      <dd className="mt-2.5 break-words text-xs font-medium leading-snug text-fg md:text-sm">
        {renderValue(value)}
      </dd>
    </div>
  );

  return <div className="about-item min-w-0">{valueEl}</div>;
}
