import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function Card({ children, className = "", interactive = true }: CardProps) {
  const hover = interactive
    ? "transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-card hover:border-brand-blue/40"
    : "";
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-bg-card/80 p-6 backdrop-blur-sm ${hover} ${className}`}
    >
      {children}
    </div>
  );
}
