"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { navLinks } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { LangToggle } from "@/components/layout/LangToggle";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(navLinks[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);
  const scrollLockUntil = useRef(0);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const compute = () => {
      if (performance.now() < scrollLockUntil.current) return;
      const sections = navLinks
        .map((l) => document.getElementById(l.id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (sections.length === 0) return;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }
      const triggerY = 120;
      let current = sections[0].id;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top - triggerY <= 0) current = sec.id;
      }
      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const scrollTo = useScrollToSection();

  const handleNavClick = (id: string) => {
    setActive(id);
    scrollLockUntil.current = performance.now() + 900;
    scrollTo(id);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // fromTo (not from): the brand + links are pre-hidden in CSS to avoid an
      // SSR flash, so we need an explicit visible end state to animate toward.
      tl.fromTo(
        ".nav-brand",
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.5 }
      ).fromTo(
        ".nav-link",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.4 },
        "-=0.25"
      );
    },
    { scope: navRef }
  );

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-rule bg-surface/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-6">
        {/* Brand — "Mi Portafolio" with accent dot */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("inicio");
          }}
          className="nav-brand group flex shrink-0 items-baseline gap-0.5 whitespace-nowrap text-sm font-semibold tracking-tight text-fg"
          aria-label="Mi Portafolio"
        >
          <span>Mi Portafolio</span>
          <span
            className="text-accent transition-transform group-hover:translate-y-0.5"
            aria-hidden
          >
            .
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id);
                  }}
                  data-active={isActive ? "true" : "false"}
                  className={`nav-link inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm transition-colors ${
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <span
                      className="h-1 w-1 rounded-full bg-accent"
                      aria-hidden
                    />
                  )}
                  <span>{t(link.label)}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LangToggle className="hidden sm:inline-flex" />

          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center border border-rule text-fg transition-colors hover:border-accent hover:text-accent lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-px w-5 bg-current transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-rule bg-surface/95 backdrop-blur lg:hidden">
          <ul className="container-x flex flex-col py-2">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="border-b border-rule/60 last:border-b-0">
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 py-3 text-sm transition-colors ${
                      isActive ? "text-accent" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                    )}
                    {t(link.label)}
                  </a>
                </li>
              );
            })}
            <li className="mt-3 pb-3">
              <LangToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
