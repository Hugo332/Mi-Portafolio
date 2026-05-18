"use client";

let cached: boolean | null = null;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;
  cached = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return cached;
}
