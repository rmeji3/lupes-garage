"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  ClockIcon,
  LanguagesIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/i18n";

export function Header() {
  const { t, toggle } = useLanguage();

  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#work", label: t.nav.work },
    { href: "#why-us", label: t.nav.whyUs },
    { href: "#service-area", label: t.nav.serviceArea },
  ];

  const isDev = process.env.NODE_ENV === "development";

  return (
    <header className="sticky top-0 z-50">
      {/* Dev mode banner */}
      {isDev && (
        <div className="bg-yellow-500 text-black px-4 py-1 text-center text-xs font-semibold">
          Development Mode — Form submissions are being tested
        </div>
      )}
      {/* Utility bar */}
      <div className="bg-surface-dark text-on-dark">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-xs font-medium sm:px-6">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-red" />
              {t.topbar.hours}
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPinIcon className="h-3.5 w-3.5 text-red" />
              {t.topbar.area}
            </span>
          </div>
          <span className="font-semibold uppercase tracking-wider">
            {t.topbar.bilingual}
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <img
              src="/logo.svg"
              alt=""
              className="h-9 w-auto sm:h-14"
            />
            <span className="flex flex-col justify-center">
              <span className="font-display text-xl font-extrabold uppercase leading-none text-red sm:text-[1.75rem]">
                Lupe&rsquo;s
              </span>
              <span className="mt-0.5 font-display text-sm font-bold uppercase leading-none tracking-wide text-foreground sm:mt-1 sm:text-lg">
                Garage Doors
              </span>
            </span>
          </a>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-base font-semibold uppercase tracking-wide text-foreground transition-colors duration-150 hover:text-red"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={t.nav.toggleLabel}
              className="flex h-11 shrink-0 cursor-pointer items-center gap-1.5 border border-foreground px-2.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors duration-150 hover:bg-foreground hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3"
            >
              <LanguagesIcon className="h-4 w-4" />
              {t.nav.toggleShort}
            </button>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap bg-red px-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5"
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="hidden md:inline">{PHONE_DISPLAY}</span>
              <span className="md:hidden">{t.nav.callNow}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
