import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Modern tech palette ─────────────────────────────────────────
        // Backgrounds: near-black with subtle cool undertone
        surface: {
          DEFAULT: "#08080a",  // base — deep near-black
          raised: "#101013",   // cards, raised surfaces
          sunken: "#050507",   // footers, modals overlay
          hover: "#16161a",    // hover states on raised surfaces
        },
        // Foreground: high-contrast neutral
        fg: {
          DEFAULT: "#fafafa",
          muted: "#a1a1aa",    // zinc-400
          subtle: "#71717a",   // zinc-500
          dim: "#52525b",      // zinc-600
        },
        // Accent: electric lime — confident, contemporary, distinctive
        accent: {
          DEFAULT: "#bef264",  // lime-300
          bright: "#d9f99d",   // lime-200 — hover
          dim: "#84cc16",      // lime-500 — pressed
          glow: "#a3e63522",   // semi-transparent for glow effects
        },
        // Status colors (sparingly)
        ok: "#4ade80",         // green-400
        warn: "#fbbf24",       // amber-400
        err: "#f87171",        // red-400
        rule: "#1a1a1d",       // very subtle hairline border

        // ── Legacy tokens (kept so orphaned UI primitives still compile) ─
        bg: { DEFAULT: "#08080a", soft: "#101013", card: "#16161a" },
        brand: { blue: "#bef264", gold: "#bef264" },
        ink: { DEFAULT: "#fafafa", muted: "#a1a1aa", subtle: "#71717a" },
        paper: { DEFAULT: "#08080a", raised: "#101013", sunken: "#050507" },
        cream: { DEFAULT: "#fafafa", muted: "#a1a1aa", subtle: "#71717a" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        // Display = sans (no serif in tech direction)
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tight sans display scale
        "display-sm": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.0", letterSpacing: "-0.035em" }],
        "display":    ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(4rem, 10vw, 8rem)",  { lineHeight: "0.95", letterSpacing: "-0.045em" }],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tag: "0.12em",
      },
      boxShadow: {
        // Tech: sharp, low-spread, accent-tinted glow on hover
        glow: "0 0 0 1px rgba(190,242,100,0.4), 0 0 24px -4px rgba(190,242,100,0.25)",
        card: "0 8px 24px -12px rgba(0,0,0,0.8)",
        editorial: "0 8px 24px -12px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.9)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        marquee: "marquee 40s linear infinite",
        "pulse-dot": "pulse_dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
