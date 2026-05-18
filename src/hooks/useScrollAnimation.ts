"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Options = {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  batch?: boolean;
};

/**
 * Reveals elements as they enter the viewport.
 *
 * - Uses `gsap.matchMedia()` so animations auto-revert when the OS
 *   `prefers-reduced-motion` setting changes (no reload needed).
 * - Uses `ScrollTrigger.batch()` for `.reveal` items so N reveal targets
 *   share a single trigger and visible-at-once items stagger together.
 * - `.reveal-group > *` children still use the legacy single-trigger
 *   approach (more deterministic for known sibling groups).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: Options = {}
): RefObject<T | null> {
  const {
    selector = ".reveal",
    y = 24,
    duration = 0.7,
    stagger = 0.1,
    start = "top 85%",
  } = options;

  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      // Reduced motion: skip animations, just reveal everything
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root
          .querySelectorAll<HTMLElement>(`${selector}, .reveal-group > *`)
          .forEach((el) => gsap.set(el, { autoAlpha: 1, y: 0 }));
      });

      // Default: full animations
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = Array.from(
          root.querySelectorAll<HTMLElement>(selector)
        );

        if (targets.length > 0) {
          ScrollTrigger.batch(targets, {
            start,
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { autoAlpha: 0, y },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration,
                  stagger: 0.08,
                  ease: "power3.out",
                  overwrite: "auto",
                }
              ),
          });
        }

        // Sibling group reveal — one trigger per group, staggered children
        Array.from(root.querySelectorAll<HTMLElement>(".reveal-group")).forEach(
          (group) => {
            const children = Array.from(group.children) as HTMLElement[];
            gsap.fromTo(
              children,
              { autoAlpha: 0, y },
              {
                autoAlpha: 1,
                y: 0,
                duration,
                stagger,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: group,
                  start,
                },
              }
            );
          }
        );
      });
    },
    { scope: ref }
  );

  return ref;
}
