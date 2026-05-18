"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCertificateModal } from "@/hooks/useCertificateModal";
import {
  certifications,
  ui,
  type Certification,
  type CertIssuer,
} from "@/lib/data";
import { useLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CertificateModal = dynamic(
  () =>
    import("@/components/ui/CertificateModal").then((m) => m.CertificateModal),
  { ssr: false }
);

type Filter = "all" | CertIssuer;

type IssuerMeta = {
  short: string;
  label: { es: string; en: string };
  logo?: string;
};

const ISSUER_META: Record<CertIssuer, IssuerMeta> = {
  aws: {
    short: "AWS",
    label: { es: "AWS", en: "AWS" },
    logo: "/certificates/institutos/aws-logo.png",
  },
  uide: {
    short: "UIDE",
    label: { es: "UIDE", en: "UIDE" },
    logo: "/certificates/institutos/logo-uide.png",
  },
  istdab: {
    short: "ISTDAB",
    label: { es: "ISTDAB", en: "ISTDAB" },
    logo: "/certificates/institutos/istdab-logo.png",
  },
  self: {
    short: "SELF",
    label: { es: "Autodidacta", en: "Self-taught" },
  },
};

const FILTER_ORDER: Filter[] = ["all", "aws", "istdab", "uide", "self"];
const ALL_LABEL = { es: "Todas", en: "All" };

export function Certifications() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();
  const modal = useCertificateModal();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c = { all: certifications.length, aws: 0, uide: 0, istdab: 0, self: 0 };
    certifications.forEach((cert) => {
      c[cert.issuerKey]++;
    });
    return c;
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? certifications
        : certifications.filter((c) => c.issuerKey === filter),
    [filter]
  );

  // Initial mount animations — header + filter strip + first batch of cards
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(
            ".cert-head > *, .cert-filter, .cert-card"
          )
          .forEach((el) => gsap.set(el, { autoAlpha: 1, y: 0, scale: 1 }));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".cert-head > *",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".cert-head", start: "top 85%" },
          }
        );

        gsap.fromTo(
          ".cert-filter",
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: { trigger: ".cert-filter", start: "top 88%" },
          }
        );

        // Batch all cards — entering staggered as they scroll into view
        const cards = Array.from(
          scope.querySelectorAll<HTMLElement>(".cert-card")
        );
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { autoAlpha: 0, y: 30, scale: 0.96 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.65,
                stagger: { each: 0.08, from: "start" },
                ease: "power3.out",
                overwrite: "auto",
              }
            ),
        });
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  // When the filter changes, re-animate the visible cards (subtle pop-in)
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const cards = scope.querySelectorAll<HTMLElement>(".cert-card");
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 14, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.04,
        ease: "power3.out",
        overwrite: "auto",
      }
    );
  }, [filter]);

  return (
    <section ref={root} id="certificaciones" className="relative py-24 md:py-32">
      <div className="container-x">
        <header className="cert-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">06 / {t(ui.certifications.eyebrow)}</p>
            <h2 className="max-w-3xl text-display-sm font-semibold tracking-tightest text-fg">
              {t(ui.certifications.title)}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
              {t(ui.certifications.subtitle)}
            </p>
          </div>
        </header>

        {/* Filter strip */}
        <div className="cert-filter mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule pb-5">
          <span className="mono-tag mr-2">Filter</span>
          {FILTER_ORDER.map((key) => {
            const active = filter === key;
            const count = counts[key];
            if (count === 0) return null;
            const isAll = key === "all";
            const meta = isAll ? null : ISSUER_META[key];
            const label = isAll ? ALL_LABEL[locale] : meta!.label[locale];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] uppercase tracking-tag transition-colors ${
                  active
                    ? "border-accent bg-accent text-surface"
                    : "border-rule text-fg-muted hover:border-accent/40 hover:text-fg"
                }`}
              >
                <span>{label}</span>
                <sup
                  className={`text-[9px] ${
                    active ? "text-surface/70" : "text-fg-subtle"
                  }`}
                >
                  {count}
                </sup>
              </button>
            );
          })}
        </div>

        {/* Gallery */}
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((cert, i) => (
            <CertCard
              key={cert.title}
              cert={cert}
              index={i}
              onOpen={
                cert.image
                  ? () =>
                      modal.open({
                        imageUrl: cert.image!,
                        title: cert.title,
                        institution: cert.issuer,
                        date: t(cert.date),
                      })
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {modal.item && (
        <CertificateModal
          isOpen={modal.isOpen}
          onClose={modal.close}
          imageUrl={modal.item.imageUrl}
          title={modal.item.title}
          institution={modal.item.institution}
          date={modal.item.date}
        />
      )}
    </section>
  );
}

function CertCard({
  cert,
  index,
  onOpen,
}: {
  cert: Certification;
  index: number;
  onOpen?: () => void;
}) {
  const { t } = useLocale();
  const meta = ISSUER_META[cert.issuerKey];
  const hasAsset = Boolean(cert.image);
  const isPdf = cert.image?.toLowerCase().endsWith(".pdf") ?? false;

  return (
    <article className="cert-card group flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        disabled={!hasAsset}
        className="relative block aspect-[4/3] w-full overflow-hidden border border-rule bg-surface-raised transition-colors duration-300 focus:outline-none focus-visible:border-accent enabled:hover:border-accent disabled:cursor-default"
        aria-label={hasAsset ? `${t(ui.modal.viewCert)}: ${cert.title}` : cert.title}
      >
        {!hasAsset && <FallbackTile />}
        {hasAsset && !isPdf && <ImageTile src={cert.image!} alt={cert.title} />}
        {hasAsset && isPdf && <PdfTile />}

        <span className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-tag text-fg/80 mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
          {cert.hours && (
            <span className="border border-rule bg-surface/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-tag text-fg backdrop-blur-sm">
              {cert.hours}
            </span>
          )}
          {isPdf && (
            <span className="bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-tag text-surface">
              PDF
            </span>
          )}
        </div>

        {/* Hover overlay */}
        {hasAsset && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center bg-surface/0 opacity-0 transition-all duration-300 group-hover:bg-surface/55 group-hover:opacity-100"
          >
            <span className="bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-tag text-surface">
              {t(ui.modal.viewCert)} ↗
            </span>
          </span>
        )}
      </button>

      <div className="mt-4 flex flex-col">
        <p className="mono-tag">
          {meta.short} · {t(cert.date)}
        </p>
        <h3 className="mt-2 text-base font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
          {cert.title}
        </h3>
        <p className="mt-1 text-sm text-fg-muted">{cert.issuer}</p>
      </div>
    </article>
  );
}

function ImageTile({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) return <FallbackTile />;
  return (
    <span className="absolute inset-0 bg-surface-sunken">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        onError={() => setErrored(true)}
      />
    </span>
  );
}

function PdfTile() {
  return (
    <span className="absolute inset-0 grid place-items-center bg-surface-sunken">
      <span className="border border-rule bg-surface-raised p-3">
        <span className="block h-1 w-12 bg-fg-muted/70" />
        <span className="mt-1.5 block h-px w-10 bg-fg-subtle/60" />
        <span className="mt-1.5 block h-px w-14 bg-fg-subtle/60" />
        <span className="mt-1.5 block h-px w-8 bg-fg-subtle/60" />
        <span className="mt-3 inline-block bg-accent px-1.5 py-0.5 font-mono text-[9px] text-surface">
          PDF
        </span>
      </span>
    </span>
  );
}

function FallbackTile() {
  return (
    <span className="absolute inset-0 grid place-items-center bg-surface-sunken">
      <span className="font-mono text-3xl font-semibold text-fg-subtle/40">
        {"</>"}
      </span>
    </span>
  );
}
