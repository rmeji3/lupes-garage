"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border-dark bg-surface-dark text-on-dark">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-bold uppercase tracking-tight">
            Lupe&apos;s <span className="text-red">Garage Doors</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
            {t.footer.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-2 font-medium transition-colors duration-150 hover:text-red"
          >
            <PhoneIcon className="h-4 w-4 text-red" />
            {PHONE_DISPLAY}
          </a>
          <p className="flex items-center gap-2 text-on-dark-muted">
            <MapPinIcon className="h-4 w-4 text-red" />
            Cicero, IL
          </p>
          <p className="flex items-center gap-2 text-on-dark-muted">
            <ClockIcon className="h-4 w-4 text-red" />
            {t.footer.hours}
          </p>
        </div>
      </div>
      <div className="border-t border-border-dark">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <a
            href="https://rafaelmejia.me"
            className="transition-colors duration-150 hover:text-red"
          >
            © {new Date().getFullYear()} Rafael Mejia. {t.footer.rights}
          </a>
          <p>
            Want a website like this?{" "}
            <a href="https://rafaelmejia.me" className="text-red underline">
              Contact me
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
