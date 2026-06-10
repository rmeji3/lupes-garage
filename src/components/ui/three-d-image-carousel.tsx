"use client";

import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Adapted from Lightswind UI "3d-image-carousel":
// - square corners (no border-radius), brand-styled square arrows
// - click center slide to open a fullscreen lightbox; click side slides to navigate
// - next/image instead of <img>, real <button> controls, reduced-motion-aware autoplay

export interface CarouselSlide {
  id: number;
  src: StaticImageData;
  alt: string;
}

export interface CarouselLabels {
  prev: string;
  next: string;
  fullscreen: string;
  close: string;
}

interface ThreeDImageCarouselProps {
  /** The array of image data for the slider. */
  slides: CarouselSlide[];
  /** Number of visible items in the slider (3 or 5). Default is 5. */
  itemCount?: 3 | 5;
  /** Enables/Disables automatic sliding. Default is false. */
  autoplay?: boolean;
  /** Delay in seconds for autoplay. Default is 3. */
  delay?: number;
  /** Pauses autoplay when the mouse hovers over the slider. Default is true. */
  pauseOnHover?: boolean;
  /** Localized labels for the carousel controls. */
  labels: CarouselLabels;
  /** Tailwind class for the main container (e.g., margins, padding). */
  className?: string;
}

// Core 3D positioning and responsive layout (structural CSS).
const EMBEDDED_CSS = `
.cascade-slider_container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    height: 38vh;
    z-index: 20;
    user-select: none;
    -webkit-user-select: none;
    touch-action: pan-y;
}

.cascade-slider_slides {
    position: relative;
    height: 100%;
}

.cascade-slider_item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(0.3);
    transition: all 1s ease;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 1;
    cursor: grab;
}
.cascade-slider_item:active {
    cursor: grabbing;
}

/* Slide positioning classes (core 3D logic) */
.cascade-slider_item.next {
    left: 50%;
    transform: translateY(-50%) translateX(-120%) scale(0.6);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 4;
}
.cascade-slider_item.prev {
    left: 50%;
    transform: translateY(-50%) translateX(20%) scale(0.6);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 4;
}
.cascade-slider_item.now {
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 5;
    cursor: zoom-in;
}
.cascade-slider_item.next2,
.cascade-slider_item.prev2 {
    visibility: visible;
    pointer-events: auto;
}

/* Arrows — structural positioning/size; Tailwind handles color/bg */
.cascade-slider_arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 6;
    transform: translate(0, -50%);
    width: 44px;
    height: 44px;
    transition: all 0.3s ease;
}

@media screen and (max-width: 575px) {
    .cascade-slider_arrow-left { left: 5px; }
    .cascade-slider_arrow-right { right: 5px; }
}
@media screen and (min-width: 576px) {
    .cascade-slider_arrow-left { left: -4%; }
    .cascade-slider_arrow-right { right: -4%; }
}

/* Images — square corners, full color in every position */
.cascade-slider_slides img {
    max-width: 180px;
    height: auto;
    display: block;
}

@media screen and (min-width: 414px) {
    .cascade-slider_container { height: 40vh; }
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-110%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(10%) scale(0.6); }
    .cascade-slider_slides img { max-width: 220px; }
}
@media screen and (min-width: 576px) {
    .cascade-slider_container { height: 60vh; }
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-115%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(15%) scale(0.6); }
    .cascade-slider_slides img { max-width: 300px; }
}
@media screen and (min-width: 768px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-125%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(25%) scale(0.6); }
    .cascade-slider_slides img { max-width: 360px; }
}
@media screen and (min-width: 991px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-115%) scale(0.55); z-index: 4; }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(15%) scale(0.55); z-index: 4; }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-150%) scale(0.37); opacity: 1; z-index: 1; }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(50%) scale(0.37); opacity: 1; z-index: 2; }
    .cascade-slider_slides img { max-width: 400px; }
    .cascade-slider_container { height: 44vh; }
}
@media screen and (min-width: 1100px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-130%) scale(0.55); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(30%) scale(0.55); }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-160%) scale(0.37); }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(60%) scale(0.37); }
    .cascade-slider_slides img { max-width: 420px; }
    .cascade-slider_container { height: 46vh; }
}
@media screen and (min-width: 1280px) {
    .cascade-slider_slides img { max-width: 480px; }
    .cascade-slider_container { height: 50vh; }
}
`;

const getSlideClasses = (
  index: number,
  activeIndex: number,
  total: number,
  visibleCount: 3 | 5,
): string => {
  const diff = index - activeIndex;
  if (diff === 0) return "now";
  if (diff === 1 || diff === -total + 1) return "next";
  if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return "next2";
  if (diff === -1 || diff === total - 1) return "prev";
  if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return "prev2";
  return "";
};

export const ThreeDImageCarousel: React.FC<ThreeDImageCarouselProps> = ({
  slides,
  itemCount = 5,
  autoplay = false,
  delay = 3,
  pauseOnHover = true,
  labels,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenSlide, setFullscreenSlide] = useState<CarouselSlide | null>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const total = slides.length;

  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const startXRef = useRef(0);
  const swipeThreshold = 50;

  const navigate = useCallback(
    (direction: "next" | "prev") => {
      setActiveIndex((current) =>
        direction === "next" ? (current + 1) % total : (current - 1 + total) % total,
      );
    },
    [total],
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoplay || total <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopAutoplay();
    autoplayIntervalRef.current = window.setInterval(() => {
      navigate("next");
    }, delay * 1000);
  }, [autoplay, delay, navigate, stopAutoplay, total]);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  // Fullscreen lightbox: close on Escape, lock page scroll, pause autoplay.
  useEffect(() => {
    if (!fullscreenSlide) return;
    stopAutoplay();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenSlide(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      startAutoplay();
    };
  }, [fullscreenSlide, startAutoplay, stopAutoplay]);

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) stopAutoplay();
  };

  // --- Touch/Mouse drag logic ---
  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    didDragRef.current = false;
    startXRef.current = clientX;
    stopAutoplay();
  };

  const handleEnd = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const distance = clientX - startXRef.current;
    if (Math.abs(distance) > swipeThreshold) {
      didDragRef.current = true;
      navigate(distance < 0 ? "next" : "prev");
    }
    isDraggingRef.current = false;
    startXRef.current = 0;
  };

  const handleExit = (e: React.MouseEvent) => {
    if (autoplay && pauseOnHover && !fullscreenSlide) startAutoplay();
    if (isDraggingRef.current) handleEnd(e.clientX);
  };

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX);
    if (!fullscreenSlide) startAutoplay();
  };
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
    if (!fullscreenSlide) startAutoplay();
  };

  const handleSlideClick = (index: number) => {
    if (didDragRef.current) return;
    if (index === activeIndex) {
      setFullscreenSlide(slides[index]);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EMBEDDED_CSS }} />

      <div
        className={cn("cascade-slider_container bg-transparent", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleExit}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cascade-slider_slides">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id}
                className={`cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`}
                data-slide-number={index}
              >
                <button
                  type="button"
                  onClick={() => handleSlideClick(index)}
                  aria-label={isActive ? `${labels.fullscreen}: ${slide.alt}` : slide.alt}
                  className="block cursor-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    sizes="(min-width: 1280px) 480px, (min-width: 1100px) 420px, (min-width: 991px) 400px, (min-width: 768px) 360px, (min-width: 576px) 300px, (min-width: 414px) 220px, 180px"
                  />
                </button>
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label={labels.prev}
              className="cascade-slider_arrow cascade-slider_arrow-left bg-black/50 text-white hover:bg-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              onClick={(e) => {
                e.stopPropagation();
                navigate("prev");
              }}
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              className="cascade-slider_arrow cascade-slider_arrow-right bg-black/50 text-white hover:bg-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              onClick={(e) => {
                e.stopPropagation();
                navigate("next");
              }}
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {fullscreenSlide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fullscreenSlide.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={() => setFullscreenSlide(null)}
        >
          <button
            type="button"
            autoFocus
            aria-label={labels.close}
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenSlide(null);
            }}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center bg-white/10 text-white transition-colors duration-150 hover:bg-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <Image
            src={fullscreenSlide.src}
            alt={fullscreenSlide.alt}
            sizes="100vw"
            className="max-h-full w-auto max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ThreeDImageCarousel;
