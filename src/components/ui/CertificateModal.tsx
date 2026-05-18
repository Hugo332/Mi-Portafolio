"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ui } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  institution?: string;
  date?: string;
};

export function CertificateModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  institution,
  date,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;
    const overlay = overlayRef.current;
    const dialog = dialogRef.current;
    if (!overlay || !dialog) return;
    const reduced = prefersReducedMotion();

    if (isOpen) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(dialog, { scale: reduced ? 1 : 0.95, opacity: 0 });
      gsap.to(overlay, {
        opacity: 1,
        duration: reduced ? 0.01 : 0.3,
        ease: "power2.out",
      });
      gsap.to(dialog, {
        scale: 1,
        opacity: 1,
        duration: reduced ? 0.01 : 0.35,
        ease: reduced ? "none" : "power3.out",
      });
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: reduced ? 0.01 : 0.25,
        ease: "power2.in",
      });
      gsap.to(dialog, {
        scale: reduced ? 1 : 0.95,
        opacity: 0,
        duration: reduced ? 0.01 : 0.25,
        ease: reduced ? "none" : "power3.in",
        onComplete: () => setShouldRender(false),
      });
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-[100] grid place-items-center bg-surface/85 p-4 backdrop-blur-md sm:p-8"
      style={{ opacity: 0 }}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[800px] flex-col overflow-hidden border border-rule bg-surface-raised"
        style={{ maxHeight: "95vh", opacity: 0 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t(ui.modal.close)}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center border border-rule bg-surface/70 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 overflow-auto bg-surface-sunken">
          <CertAsset src={imageUrl} alt={title} />
        </div>

        <div className="border-t border-rule bg-surface-raised p-5 sm:p-6">
          {date && <p className="mono-tag">{date}</p>}
          <h3
            id="cert-modal-title"
            className="mt-2 text-lg font-semibold leading-snug text-fg sm:text-xl"
          >
            {title}
          </h3>
          {institution && (
            <p className="mt-1 text-sm text-fg-muted">{institution}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function CertAsset({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  const { t } = useLocale();
  const isPdf = src.toLowerCase().endsWith(".pdf");

  if (errored) {
    return (
      <div className="grid aspect-[4/3] place-items-center bg-surface-sunken">
        <div className="px-6 text-center">
          <span className="font-mono text-3xl font-semibold text-fg-subtle/40">
            {"</>"}
          </span>
          <p className="mt-4 mono-tag">{t(ui.modal.pending)}</p>
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="relative bg-surface-sunken">
        <iframe
          src={`${src}#toolbar=0&navpanes=0&view=FitH`}
          title={alt}
          className="block w-full border-0"
          style={{ height: "75vh" }}
          onError={() => setErrored(true)}
        />
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 font-mono text-[10px] uppercase tracking-tag text-surface transition-colors hover:bg-accent-bright"
        >
          <span>{t(ui.modal.openTab)}</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="mx-auto block h-auto w-full bg-surface-sunken object-contain"
      style={{ maxHeight: "80vh" }}
    />
  );
}
