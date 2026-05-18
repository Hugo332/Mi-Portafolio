"use client";

import { useCallback } from "react";

const NAV_GAP_PX = 16;

/**
 * Scrolls to a section id, accounting for the fixed navbar height.
 *
 * Uses `getBoundingClientRect().top + window.scrollY` instead of `offsetTop`
 * because offsetTop is unreliable when ancestors have relative/absolute
 * positioning. Reads the navbar height live with `offsetHeight` so the offset
 * stays correct if the bar shrinks/grows (mobile menu open, etc.).
 */
export function useScrollToSection() {
  return useCallback((sectionId: string) => {
    if (typeof window === "undefined") return;

    const navbar = document.querySelector("nav") as HTMLElement | null;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionTop - navbarHeight - NAV_GAP_PX,
      behavior: "smooth",
    });
  }, []);
}
