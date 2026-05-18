"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

/**
 * One-shot global GSAP configuration.
 * - `force3D: true` promotes transforms to their own GPU layer for smoother movement
 * - `nullTargetWarn: false` silences false positives from conditional refs
 * Also registers ScrollTrigger globally so individual modules don't have to.
 */
export function initGsap() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });

  gsap.defaults({
    ease: "power3.out",
    duration: 0.6,
  });

  // Recalculate trigger positions after every image finishes loading.
  // Cert/photo images load after the initial render and shift layout.
  const refreshOnImageLoad = () => {
    const images = Array.from(document.querySelectorAll("img"));
    let pending = images.length;
    if (pending === 0) {
      ScrollTrigger.refresh();
      return;
    }
    const done = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    images.forEach((img) => {
      if (img.complete) {
        done();
      } else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  };

  if (document.readyState === "complete") {
    refreshOnImageLoad();
  } else {
    window.addEventListener("load", refreshOnImageLoad, { once: true });
  }

  // Re-measure once webfonts settle — Inter via next/font may shift line heights
  if (typeof document.fonts?.ready?.then === "function") {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
