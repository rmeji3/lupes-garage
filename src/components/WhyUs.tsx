"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function WhyUs() {
  const { t } = useLanguage();

  return (
    <section id="why-us" className="scroll-mt-28 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="max-w-2xl">
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.whyUs.heading}
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
            {t.whyUs.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {t.whyUs.items.map((item) => (
            <div key={item.title} className="border-t-2 border-foreground pt-5">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
