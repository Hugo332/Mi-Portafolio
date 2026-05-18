import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:pointer-events-none will-change-transform";

// `secondary` is treated as a slightly different primary (gold accent).
// `outline` is the transparent-with-border variant.
function classesFor(variant: ButtonVariant, size: ButtonSize, fullWidth?: boolean) {
  const sizing = sizeStyles[size];
  const width = fullWidth ? "w-full" : "";
  switch (variant) {
    case "primary":
      return `${base} ${sizing} ${width} btn-fill text-white`;
    case "secondary":
      return `${base} ${sizing} ${width} bg-brand-gold text-bg hover:bg-[#d8b659]`;
    case "outline":
      return `${base} ${sizing} ${width} btn-outline font-semibold`;
  }
}

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "ref"> & {
    href?: undefined;
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  fullWidth,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      className={`${classesFor(variant, size, fullWidth)} ${className}`}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

type LinkButtonProps = CommonProps & {
  href: string;
  external?: boolean;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  fullWidth,
  href,
  external = false,
}: LinkButtonProps) {
  const classes = `${classesFor(variant, size, fullWidth)} ${className}`;
  const content = (
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
    </span>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

// Tiny CSS-only spinner (no infinite GSAP, no Tailwind `animate-pulse`)
export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}
