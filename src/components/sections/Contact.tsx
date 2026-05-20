"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FiMail, FiLinkedin, FiMapPin } from "react-icons/fi";
import { SiWhatsapp } from "react-icons/si";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal, ui } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Status = "idle" | "sending" | "sent" | "fallback" | "error";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "sent" && status !== "fallback") return;
    const id = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(id);
  }, [status]);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scope
          .querySelectorAll<HTMLElement>(
            ".contact-head > *, .contact-arrow, .contact-field, .contact-cta > *, .contact-channels, .contact-channels li, .contact-footer > *"
          )
          .forEach((el) =>
            gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 })
          );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header
        const headTl = gsap.timeline({
          scrollTrigger: { trigger: ".contact-head", start: "top 85%" },
          defaults: { ease: "power3.out" },
        });
        headTl
          .fromTo(
            ".contact-head > *",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }
          )
          .fromTo(
            ".contact-arrow",
            { autoAlpha: 0, x: -20 },
            { autoAlpha: 1, x: 0, duration: 0.7, ease: "expo.out" },
            "-=0.35"
          );

        // Form fields cascade
        gsap.fromTo(
          ".contact-field",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".contact-form", start: "top 85%" },
          }
        );
        gsap.fromTo(
          ".contact-cta > *",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".contact-form", start: "top 78%" },
          }
        );

        // Channels list — staggered items
        gsap.fromTo(
          ".contact-channels li",
          { autoAlpha: 0, x: 12 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: ".contact-channels", start: "top 85%" },
          }
        );

        // Footer
        gsap.fromTo(
          ".contact-footer > *",
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".contact-footer", start: "top 92%" },
          }
        );
      });
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="contacto" className="relative pt-24 md:pt-32">
      <div className="container-x">
        <header className="contact-head flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-tag mb-4">08 / {t(ui.contact.eyebrow)}</p>
            <h2 className="max-w-3xl text-display font-semibold tracking-tightest text-fg">
              {t(ui.contact.title)}{" "}
              <span className="contact-arrow inline-block text-accent">→</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
              {t(ui.contact.subtitle)}
            </p>
          </div>
          <p className="status-dot mono-tag text-fg">
            Available · {new Date().getFullYear()}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-12 gap-x-10 gap-y-12">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus("sending");
              const form = e.currentTarget;
              const data = new FormData(form);
              const name = String(data.get("name") ?? "");
              const email = String(data.get("email") ?? "");
              const message = String(data.get("message") ?? "");

              // Last-resort fallback: open the user's mail client with the
              // message pre-filled so it's never lost if the API can't send
              // (missing key, send rejected, unverified domain, network error…).
              const openMailto = () => {
                const subject = encodeURIComponent(
                  `Contacto desde portafolio — ${name}`
                );
                const body = encodeURIComponent(
                  `Hola Hugo,\n\nMi nombre es ${name} (${email}).\n\n${message}`
                );
                window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
              };

              try {
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, message }),
                });
                if (res.ok) {
                  setStatus("sent");
                  form.reset();
                  return;
                }
                // Any non-OK response → fall back to mailto instead of a
                // dead-end "error" with no way to reach me.
                openMailto();
                setStatus("fallback");
                form.reset();
              } catch {
                openMailto();
                setStatus("fallback");
              }
            }}
            className="contact-form col-span-12 md:col-span-7"
          >
            <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
              <Field
                label={t(ui.contact.name)}
                name="name"
                type="text"
                placeholder={t(ui.contact.namePh)}
                required
              />
              <Field
                label={t(ui.about.email)}
                name="email"
                type="email"
                placeholder={t(ui.contact.emailPh)}
                required
              />
            </div>
            <div className="mt-6">
              <Field
                label={t(ui.contact.message)}
                name="message"
                as="textarea"
                placeholder={t(ui.contact.messagePh)}
                required
              />
            </div>

            <div className="contact-cta mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary px-6 py-3 text-sm font-medium disabled:opacity-60"
              >
                {status === "sending" && t(ui.cta.sending)}
                {status === "sent" && `✓ ${t(ui.cta.sent)}`}
                {status === "fallback" && `✓ ${t(ui.cta.fallbackOpened)}`}
                {(status === "idle" || status === "error") && (
                  <>
                    <span>{t(ui.cta.send)}</span>
                    <span aria-hidden>→</span>
                  </>
                )}
              </button>
              {status === "error" && (
                <p className="mono-tag text-err">{t(ui.cta.error)}</p>
              )}
            </div>
          </form>

          <aside className="contact-channels col-span-12 md:col-span-4 md:col-start-9">
            <p className="mono-tag border-b border-rule pb-3">
              Direct channels
            </p>
            <ul className="mt-4 divide-y divide-rule">
              <ChannelItem
                icon={FiMail}
                label="Email"
                value={personal.email}
                href={`mailto:${personal.email}`}
              />
              <ChannelItem
                icon={FiLinkedin}
                label="LinkedIn"
                value={t(ui.about.viewProfile)}
                href={personal.linkedin}
                external
              />
              <ChannelItem
                icon={SiWhatsapp}
                label="WhatsApp"
                value={personal.phone}
                href={`https://wa.me/${personal.phone.replace(/[^\d]/g, "")}`}
                external
              />
              <ChannelItem
                icon={FiMapPin}
                label={t(ui.about.location)}
                value={t(personal.location)}
              />
            </ul>
          </aside>
        </div>
      </div>

      <footer className="mt-20 border-t border-rule py-8">
        <div className="contact-footer container-x grid grid-cols-1 items-center gap-3 md:grid-cols-3">
          <p className="mono-tag md:text-left">
            © {new Date().getFullYear()} — Hugo Lima
          </p>
          <p className="text-center font-mono text-xs text-fg-subtle">
            hugo.dev — v{new Date().getFullYear()}.1
          </p>
          <p className="mono-tag md:text-right">
            {t(ui.contact.builtWith)}
          </p>
        </div>
      </footer>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  as = "input",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  as?: "input" | "textarea";
}) {
  const base =
    "block w-full border border-rule bg-surface-raised px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors";
  return (
    <label className="contact-field block">
      <span className="mono-tag mb-2 block">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={base}
        />
      )}
    </label>
  );
}

function ChannelItem({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: IconType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <span className="flex items-center justify-between gap-3">
      {/* Left: icon tile + label stack */}
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center border border-rule bg-surface-raised text-fg-muted transition-all duration-300 group-hover:border-accent/60 group-hover:bg-accent/10 group-hover:text-accent"
        >
          <Icon size={15} />
        </span>
        <span className="mono-tag">{label}</span>
      </span>
      {/* Right: value */}
      <span className="text-sm font-medium text-fg transition-colors group-hover:text-accent">
        {value}{" "}
        {href && (
          <span className="text-fg-subtle transition-colors group-hover:text-accent" aria-hidden>
            ↗
          </span>
        )}
      </span>
    </span>
  );
  if (!href) return <li className="group py-3">{inner}</li>;
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group block py-3"
      >
        {inner}
      </a>
    </li>
  );
}
