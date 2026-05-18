"use client";

import { useLocale } from "@/lib/i18n";

export function LangToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`inline-flex items-center border border-rule font-mono text-[10px] uppercase tracking-tag ${className}`}
    >
      {(["es", "en"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`px-2.5 py-1.5 transition-colors ${
              active
                ? "bg-accent text-surface"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
