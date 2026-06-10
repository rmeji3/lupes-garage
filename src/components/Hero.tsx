"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { PHONE_TEL } from "@/lib/i18n";
import heroBg from "@/assets/heroBg1.jpg";

export function Hero() {
  const { t } = useLanguage();

  const trustPoints = [t.hero.trust1, t.hero.trust2, t.hero.trust3, t.hero.trust4];

  return (
    <section id="top" className="relative bg-surface-dark">
      <Image
        src={heroBg}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Legibility overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:pb-36 lg:pt-40">
        <div className="max-w-2xl">
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.hero.badge}
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {t.hero.title}
          </h1>
          <div className="mt-6 h-1 w-24 bg-red" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-200 sm:text-xl">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#quote"
              className="inline-flex h-14 items-center justify-center bg-red px-8 font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex h-14 items-center justify-center gap-2.5 border-2 border-white px-8 font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-white hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PhoneIcon className="h-5 w-5" />
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Trust band */}
      <div className="relative border-t border-white/15 bg-black/60 backdrop-blur-sm">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-2 px-4 py-4 sm:px-6">
          {trustPoints.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-white"
            >
              <CheckIcon className="h-4 w-4 text-red" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
