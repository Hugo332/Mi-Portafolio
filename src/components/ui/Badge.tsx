import type { ReactNode } from "react";

type Tone = "blue" | "gold" | "neutral" | "success";

const tones: Record<Tone, string> = {
  blue: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
  gold: "bg-brand-gold/15 text-brand-gold border-brand-gold/30",
  neutral: "bg-white/5 text-ink-muted border-white/10",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
