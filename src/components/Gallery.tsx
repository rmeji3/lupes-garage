"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  ThreeDImageCarousel,
  type CarouselSlide,
} from "@/components/ui/three-d-image-carousel";
import garage1 from "@/assets/garage1.jpg";
import garage2 from "@/assets/garage2.jpg";
import garage3 from "@/assets/garage3.jpg";
import garage4 from "@/assets/garage4.jpg";
import garage5 from "@/assets/garage5.jpg";
import garage6 from "@/assets/garage6.jpg";
import garage7 from "@/assets/garage7.jpg";
import garage8 from "@/assets/garage8.jpg";
import garage9 from "@/assets/garage9.jpg";
import garage10 from "@/assets/garage10.jpg";

// 3 photos shown twice for now — swap in more job photos as they come.
const photos = [garage1, garage2, garage3, garage4, garage5, garage6, garage7, garage8, garage9, garage10];

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
