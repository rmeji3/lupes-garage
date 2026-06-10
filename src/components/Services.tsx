"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="scroll-mt-28 bg-white">
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_2fr] md:py-28">
        <div>
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.services.heading}
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
            {t.services.title}
          </h2>
        </div>

        <ol className="border-t border-foreground">
          {t.services.items.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-border py-7 sm:gap-x-10"
            >
              <span
                className="font-display text-2xl font-semibold text-red tabular-nums sm:text-3xl"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-prose leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
