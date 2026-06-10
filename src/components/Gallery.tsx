"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  ThreeDImageCarousel,
  type CarouselSlide,
} from "@/components/ui/three-d-image-carousel";
import woodDoor from "@/assets/before.jpg";
import panelDoor from "@/assets/after.jpg";
import trackInstall from "@/assets/garage2.jpg";

// 3 photos shown twice for now — swap in more job photos as they come.
const photos = [woodDoor, panelDoor, trackInstall, woodDoor, panelDoor, trackInstall];

export function Gallery() {
  const { t } = useLanguage();

  const slides: CarouselSlide[] = photos.map((src, i) => {
    const caption = t.gallery.captions[i % t.gallery.captions.length];
    return {
      id: i,
      src,
      alt: `${caption.title}. ${caption.desc}`,
    };
  });

  return (
    <section id="work" className="scroll-mt-28 bg-surface-dark text-on-dark">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="max-w-2xl">
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.gallery.heading}
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
            {t.gallery.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-on-dark-muted">
            {t.gallery.desc}
          </p>
        </div>

        <ThreeDImageCarousel
          slides={slides}
          itemCount={5}
          autoplay
          delay={4}
          labels={{
            prev: t.gallery.prev,
            next: t.gallery.next,
            fullscreen: t.gallery.fullscreen,
            close: t.gallery.close,
          }}
          className="mt-10"
        />
      </div>
    </section>
  );
}
