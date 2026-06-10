"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/i18n";

// Cicero, IL town center.
const MAP_LAT = 41.8445;
const MAP_LON = -87.7593;
const MAP_BBOX = "-87.85,41.79,-87.66,41.90";
const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
  MAP_BBOX,
)}&layer=mapnik&marker=${MAP_LAT}%2C${MAP_LON}`;

export function ServiceArea() {
  const { t } = useLanguage();

  return (
    <section id="service-area" className="scroll-mt-28 border-t border-border bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div>
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.serviceArea.heading}
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
            {t.serviceArea.title}
          </h2>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground">
            {t.serviceArea.desc}
          </p>

          <h3 className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t.serviceArea.labelArea}
          </h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:max-w-md">
            {t.serviceArea.areas.map((area) => (
              <li
                key={area}
                className="flex items-center gap-2 border-b border-border pb-2 font-medium"
              >
                <MapPinIcon className="h-4 w-4 shrink-0 text-red" />
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-prose text-sm text-muted-foreground">
            {t.serviceArea.outside}
          </p>

          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t.serviceArea.labelHours}
              </h3>
              <p className="mt-1.5 flex items-center gap-2 font-medium">
                <ClockIcon className="h-4 w-4 text-red" />
                {t.footer.hours}
              </p>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t.serviceArea.labelPhone}
              </h3>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-1.5 flex items-center gap-2 font-medium transition-colors duration-150 hover:text-red"
              >
                <PhoneIcon className="h-4 w-4 text-red" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative min-h-[24rem] flex-1 border-2 border-foreground">
            <iframe
              src={MAP_EMBED_URL}
              title={t.serviceArea.mapTitle}
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <p className="border-x-2 border-b-2 border-foreground bg-surface-dark px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Cicero, IL · Chicagoland
          </p>
        </div>
      </div>
    </section>
  );
}
