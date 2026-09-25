"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { PhoneIcon } from "@/components/icons";
import { PHONE_TEL } from "@/lib/i18n";

export function NotFoundContent() {
  const { t } = useLanguage();

  const links = [
    { href: "/#services", label: t.notFound.linkServices },
    { href: "/#work", label: t.notFound.linkWork },
    { href: "/#quote", label: t.notFound.linkQuote },
  ];

  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-surface-dark">
      {/* Decorative oversized "404" watermark */}
      <p
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[12rem] font-extrabold leading-none text-surface-dark-2 sm:text-[18rem] lg:-right-8 lg:text-[26rem]"
        aria-hidden="true"
      >
        404
      </p>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.notFound.badge}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
            {t.notFound.title}
          </h1>
          <div className="mt-6 h-1 w-24 bg-red" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-200 sm:text-xl">
            {t.notFound.desc}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-14 items-center justify-center bg-red px-8 font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t.notFound.ctaHome}
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex h-14 items-center justify-center gap-2.5 border-2 border-white px-8 font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-white hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PhoneIcon className="h-5 w-5" />
              {t.notFound.ctaCall}
            </a>
          </div>

          <nav
            aria-label={t.notFound.helpful}
            className="mt-12 border-t border-border-dark pt-6"
          >
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-on-dark-muted">
              {t.notFound.helpful}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-display text-base font-semibold uppercase tracking-wide text-white underline decoration-red decoration-2 underline-offset-4 transition-colors duration-150 hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
