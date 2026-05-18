"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  initials: string;
  className?: string;
};

export function Photo({ src, alt, initials, className = "" }: Props) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden border border-rule bg-surface-raised transition-colors hover:border-accent/40 ${className}`}
    >
      {!errored && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}

      {errored && (
        <div className="absolute inset-0 grid place-items-center font-mono text-6xl font-semibold text-fg-subtle">
          {initials}
        </div>
      )}

      {/* Subtle bottom vignette */}
      {!errored && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface/60 to-transparent"
          aria-hidden
        />
      )}
    </div>
  );
}
