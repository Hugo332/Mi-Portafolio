"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Bi, Locale } from "@/lib/data";
import { initGsap } from "@/lib/gsap-init";
import { prefersReducedMotion } from "@/lib/motion";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: <T>(value: Bi<T>) => T;
};

const LocaleContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "portfolio.locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    initGsap();
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "es" || saved === "en") {
        setLocaleState(saved);
      } else if (typeof navigator !== "undefined") {
        const nav = navigator.language?.slice(0, 2).toLowerCase();
        if (nav === "en") setLocaleState("en");
      }
    } catch {
      /* no-op */
    }
  }, []);

  const lastAnimatedLocale = useRef<Locale | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale;

    // Animate only when this is a real user-initiated change — not the initial
    // mount and not the localStorage hydration to the same value.
    if (lastAnimatedLocale.current === null) {
      lastAnimatedLocale.current = locale;
      return;
    }
    if (lastAnimatedLocale.current === locale) return;
    lastAnimatedLocale.current = locale;

    if (prefersReducedMotion()) return;

    // Re-trigger the entrance on visible .reveal elements so the new text
    // slides in instead of swapping mid-air. Hero has its own dep-based replay.
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    if (revealEls.length > 0) {
      gsap.fromTo(
        revealEls,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
    }

    // Text length differs ES↔EN — re-measure scroll triggers so reveals
    // and the timeline scrub stay calibrated to the new layout.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* no-op */
    }
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "es" ? "en" : "es");
  }, [locale, setLocale]);

  const t = useCallback(
    <T,>(value: Bi<T>) => value[locale],
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
