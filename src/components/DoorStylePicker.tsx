"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ColumnsIcon,
  LanguagesIcon,
  MaximizeIcon,
  XIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";
import logo from "@/assets/logo.svg";
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

// Order matches t.doorStyles.items. Photo grouping was done by eye; confirm with the client.
const DOOR_TYPES: { key: string; photos: StaticImageData[] }[] = [
  { key: "carriage", photos: [garage5, garage9, garage1] },
  { key: "raised-panel", photos: [garage7, garage3, garage6] },
  { key: "windowed", photos: [garage4] },
  { key: "flush", photos: [garage8] },
  { key: "openers", photos: [garage10, garage2] },
];

type Slot = "a" | "b";
type RailPosition = "side" | "bottom";
type Copy = Dictionary["doorStyles"];

// Below md the rail always sits under the photo; server render assumes a wide screen.
const WIDE_QUERY = "(min-width: 768px)";

function subscribeWide(onChange: () => void) {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true
  );
}

function wrap(index: number, length: number) {
  return (index + length) % length;
}

// Which photo is showing, plus which way the carousel moved to get there. The
// direction matters for wrap-around (and with 2 photos, next and previous land
// on the same index), so the carousel knows which way to slide.
type PhotoNav = { index: number; dir: 1 | -1 };

const FIRST_PHOTO: PhotoNav = { index: 0, dir: 1 };

function stepNav(nav: PhotoNav, dir: 1 | -1, count: number): PhotoNav {
  return { index: wrap(nav.index + dir, count), dir };
}

function jumpNav(nav: PhotoNav, index: number): PhotoNav {
  return { index, dir: index >= nav.index ? 1 : -1 };
}

export function DoorStylePicker() {
  const { t, toggle } = useLanguage();
  const copy = t.doorStyles;
  const isWide = useIsWide();

  const [a, setA] = useState(0);
  const [aPhoto, setAPhoto] = useState<PhotoNav>(FIRST_PHOTO);
  const [b, setB] = useState(1);
  const [bPhoto, setBPhoto] = useState<PhotoNav>(FIRST_PHOTO);
  const [compare, setCompare] = useState(false);
  const [activeSlot, setActiveSlot] = useState<Slot>("b");
  const [collapsed, setCollapsed] = useState<Record<RailPosition, boolean>>({
    side: false,
    bottom: false,
  });

  const railPosition: RailPosition = compare || !isWide ? "bottom" : "side";

  const selectType = (index: number) => {
    if (!compare) {
      setA(index);
      setAPhoto(FIRST_PHOTO);
    } else if (index === a) {
      setActiveSlot("a");
    } else if (index === b) {
      setActiveSlot("b");
    } else if (activeSlot === "a") {
      setA(index);
      setAPhoto(FIRST_PHOTO);
    } else {
      setB(index);
      setBPhoto(FIRST_PHOTO);
    }
  };

  const toggleCompare = () => {
    if (!compare) {
      setB(wrap(a + 1, DOOR_TYPES.length));
      setBPhoto(FIRST_PHOTO);
      setActiveSlot("b");
    }
    setCompare(!compare);
  };

  const toggleRail = () =>
    setCollapsed((prev) => ({ ...prev, [railPosition]: !prev[railPosition] }));

  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenButton = useRef<HTMLButtonElement>(null);

  // The viewer is an in-page overlay; where the browser supports the Fullscreen
  // API (desktop, iPad Safari) we also hide the browser chrome.
  const openFullscreen = () => {
    setFullscreen(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const closeFullscreen = () => {
    setFullscreen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  // Return focus to the trigger once the viewer is gone and the page is no longer inert
  const wasFullscreen = useRef(false);
  useEffect(() => {
    if (wasFullscreen.current && !fullscreen) fullscreenButton.current?.focus();
    wasFullscreen.current = fullscreen;
  }, [fullscreen]);

  // Leaving browser fullscreen (Esc, system gesture) also closes the viewer
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface-dark">
      {/* App bar */}
      <header
        inert={fullscreen}
        className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-5">
        <div className="flex min-w-0 items-center">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image src={logo} alt="Lupe's Garage Doors" className="h-10 w-auto" loading="eager" />
            <span className="hidden flex-col sm:flex" aria-hidden="true">
              <span className="font-display text-[22px] font-extrabold uppercase leading-none text-red">
                Lupe&rsquo;s
              </span>
              <span className="mt-0.5 font-display text-sm font-bold uppercase leading-none tracking-wide text-foreground">
                Garage Doors
              </span>
            </span>
          </Link>
          <h1 className="sr-only font-display text-base font-semibold uppercase tracking-[0.2em] text-red sm:not-sr-only sm:ml-[18px] sm:border-l sm:border-border sm:pl-[18px]">
            {copy.eyebrow}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={t.nav.toggleLabel}
            className="flex h-11 cursor-pointer items-center gap-1.5 border border-foreground bg-white px-3.5 font-display text-[15px] font-semibold uppercase tracking-wide text-foreground transition-colors duration-150 hover:bg-foreground hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <LanguagesIcon className="h-4 w-4" />
            {t.nav.toggleShort}
          </button>
          <Link
            href="/#quote"
            className="flex h-11 items-center whitespace-nowrap bg-red px-4 font-display text-[15px] font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5"
          >
            {copy.freeQuote}
          </Link>
        </div>
      </header>

      {/* Body: rail beside the stage, or under it while comparing / on narrow screens */}
      <div
        inert={fullscreen}
        className={cn(
          "flex min-h-0 flex-1",
          railPosition === "side" ? "flex-row" : "flex-col"
        )}
      >
        <main className="relative min-h-0 min-w-0 flex-1">
          <div className="absolute left-5 top-5 z-30 flex gap-2">
            <button
              type="button"
              onClick={toggleCompare}
              aria-pressed={compare}
              className={cn(
                "flex h-12 cursor-pointer items-center gap-2 border-2 border-white px-[18px] font-display text-base font-semibold uppercase tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                compare
                  ? "bg-white text-foreground hover:bg-neutral-200"
                  : "bg-black/60 text-white hover:bg-black/80"
              )}
            >
              <ColumnsIcon className="h-[18px] w-[18px]" />
              {compare ? copy.closeCompare : copy.compare}
            </button>
            <button
              ref={fullscreenButton}
              type="button"
              onClick={openFullscreen}
              aria-label={copy.fullscreen}
              className="flex h-12 w-12 cursor-pointer items-center justify-center border-2 border-white bg-black/60 text-white transition-colors duration-150 hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MaximizeIcon className="h-5 w-5" />
            </button>
          </div>

          {compare ? (
            <>
              <p className="pointer-events-none absolute right-6 top-5 z-30 hidden bg-black/60 px-3.5 py-2 font-display text-sm font-semibold uppercase tracking-widest text-white lg:block">
                {copy.swapHint}
              </p>
              <div className="grid h-full grid-rows-2 gap-0.5 md:grid-cols-2 md:grid-rows-1">
                <PhotoPanel
                  variant="half"
                  copy={copy}
                  typeIndex={a}
                  photo={aPhoto}
                  onPhotoChange={setAPhoto}
                  slot="a"
                  active={activeSlot === "a"}
                  onActivate={() => setActiveSlot("a")}
                />
                <PhotoPanel
                  variant="half"
                  copy={copy}
                  typeIndex={b}
                  photo={bPhoto}
                  onPhotoChange={setBPhoto}
                  slot="b"
                  active={activeSlot === "b"}
                  onActivate={() => setActiveSlot("b")}
                />
              </div>
            </>
          ) : (
            <PhotoPanel
              variant="single"
              copy={copy}
              typeIndex={a}
              photo={aPhoto}
              onPhotoChange={setAPhoto}
            />
          )}
        </main>

        <StyleRail
          copy={copy}
          position={railPosition}
          collapsed={collapsed[railPosition]}
          onToggleCollapsed={toggleRail}
          compare={compare}
          a={a}
          b={b}
          onSelect={selectType}
        />
      </div>

      {fullscreen && (
        <FullscreenViewer
          copy={copy}
          onClose={closeFullscreen}
          panes={
            compare
              ? [
                  { slot: "a", typeIndex: a, photo: aPhoto, onPhotoChange: setAPhoto },
                  { slot: "b", typeIndex: b, photo: bPhoto, onPhotoChange: setBPhoto },
                ]
              : [{ typeIndex: a, photo: aPhoto, onPhotoChange: setAPhoto }]
          }
        />
      )}
    </div>
  );
}

function StyleRail({
  copy,
  position,
  collapsed,
  onToggleCollapsed,
  compare,
  a,
  b,
  onSelect,
}: {
  copy: Copy;
  position: RailPosition;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  compare: boolean;
  a: number;
  b: number;
  onSelect: (index: number) => void;
}) {
  const side = position === "side";

  return (
    // Wrapper lets the notch stick out past the rail, which clips its own content while resizing
    <div className={cn("relative z-40 flex shrink-0", side && "order-first")}>
      <nav
        aria-label={copy.railLabel}
        className={cn(
          "flex shrink-0 overflow-hidden bg-surface-dark transition-[width,height] duration-300 ease-out motion-reduce:transition-none",
          side
            ? cn(
                "flex-col border-r border-border-dark",
                collapsed ? "w-[158px]" : "w-[380px]"
              )
            : cn(
                "flex-row border-t border-border-dark",
                collapsed ? "h-14" : "h-[120px]"
              )
        )}
      >
        <ul
          className={cn(
            "flex min-h-0 min-w-0 flex-1",
            side ? "flex-col" : "flex-row overflow-x-auto"
          )}
        >
          {copy.items.map((item, index) => {
            const slot: Slot | null = !compare
              ? null
              : index === a
                ? "a"
                : index === b
                  ? "b"
                  : null;
            const selected = compare ? slot !== null : index === a;
            const photos = DOOR_TYPES[index].photos;
            const number = String(index + 1).padStart(2, "0");
            const count = `${photos.length} ${photos.length === 1 ? copy.photo : copy.photos}`;

            return (
              <li
                key={DOOR_TYPES[index].key}
                className={cn(
                  "flex min-h-0",
                  side ? "flex-1" : "min-w-[180px] flex-1"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={selected ? "true" : undefined}
                  aria-label={
                    slot
                      ? `${item.name}, ${copy.slot} ${slot.toUpperCase()}`
                      : item.name
                  }
                  className={cn(
                    "relative flex w-full cursor-pointer overflow-hidden text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
                    selected
                      ? "bg-surface-dark-2"
                      : "bg-surface-dark hover:bg-surface-dark-2/60",
                    side
                      ? "grid grid-cols-[6px_120px_1fr] items-center gap-4 border-b border-border-dark pr-5"
                      : cn(
                          "items-center gap-3 border-r border-border-dark px-3.5",
                          slot && collapsed && "pr-12"
                        )
                  )}
                >
                  {/* Accent bar: left edge beside the stage, top edge under it */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      selected ? "bg-red" : "bg-transparent",
                      side
                        ? "self-stretch"
                        : "absolute inset-x-0 top-0 h-1.5"
                    )}
                  />

                  {(side || !collapsed) && (
                    <span
                      className={cn(
                        "relative block aspect-[4/3] shrink-0 overflow-hidden bg-surface-dark-2",
                        side ? "w-[120px]" : "w-20"
                      )}
                    >
                      <Image
                        src={photos[0]}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      {side && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-0 left-0 bg-black/75 px-1.5 py-0.5 font-display text-sm font-semibold tabular-nums transition-opacity duration-150",
                            selected ? "text-red" : "text-white",
                            collapsed ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {number}
                        </span>
                      )}
                      {slot && (
                        <SlotBadge slot={slot} className="left-0 top-0 h-7 w-7 text-base" />
                      )}
                    </span>
                  )}

                  <span
                    className={cn(
                      "flex min-w-0 flex-col",
                      side ? "min-w-[190px] gap-1" : "gap-0.5",
                      !side && collapsed && "flex-row items-baseline gap-2"
                    )}
                  >
                    <span
                      className={cn(
                        "font-display font-semibold tabular-nums",
                        side ? "text-base" : "text-sm",
                        selected ? "text-red" : "text-muted-foreground"
                      )}
                    >
                      {number}
                    </span>
                    <span
                      className={cn(
                        "font-display font-semibold uppercase leading-none tracking-[-0.01em]",
                        side ? "text-[23px]" : "text-base leading-tight",
                        !side && collapsed && "truncate",
                        selected ? "text-white" : "text-on-dark-muted"
                      )}
                    >
                      {item.name}
                    </span>
                    {!(!side && collapsed) && (
                      <span
                        className={cn(
                          "whitespace-nowrap font-semibold uppercase tracking-widest text-on-dark-muted",
                          side ? "text-[13px]" : "text-xs"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </span>

                  {slot && collapsed && (
                    <SlotBadge
                      slot={slot}
                      className="right-3.5 top-1/2 h-7 w-7 -translate-y-1/2 text-base"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

      </nav>

        {/* Notch: a tab on the rail's inner edge that collapses / expands it */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? copy.expandRail : copy.collapseRail}
          className={cn(
            "absolute flex cursor-pointer items-center justify-center border border-border-dark bg-surface-dark text-on-dark-muted transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white before:absolute before:content-['']",
            side
              ? "left-[calc(100%-1px)] top-1/2 h-16 w-5 border-l-0 before:-left-6 before:inset-y-0 before:right-0"
              : "bottom-[calc(100%-1px)] left-1/2 h-5 w-16 -translate-x-1/2 border-b-0 before:-bottom-6 before:inset-x-0 before:top-0"
          )}
        >
          <ChevronLeftIcon
            className={cn(
              "h-4 w-4 transition-transform duration-300 motion-reduce:transition-none",
              side
                ? collapsed && "rotate-180"
                : collapsed
                  ? "rotate-90"
                  : "-rotate-90"
            )}
          />
        </button>
    </div>
  );
}

function SlotBadge({ slot, className }: { slot: Slot; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute flex items-center justify-center bg-red font-display font-bold text-white",
        className
      )}
    >
      {slot.toUpperCase()}
    </span>
  );
}

function PhotoPanel({
  variant,
  copy,
  typeIndex,
  photo,
  onPhotoChange,
  slot,
  active = false,
  onActivate,
}: {
  variant: "single" | "half";
  copy: Copy;
  typeIndex: number;
  photo: PhotoNav;
  onPhotoChange: (nav: PhotoNav) => void;
  slot?: Slot;
  active?: boolean;
  onActivate?: () => void;
}) {
  const item = copy.items[typeIndex];
  const photos = DOOR_TYPES[typeIndex].photos;
  const count = photos.length;
  const single = variant === "single";
  const photoIndex = photo.index;
  const step = (dir: 1 | -1) => onPhotoChange(stepNav(photo, dir, count));
  const swipe = useSwipe(step, count > 1);

  return (
    <section
      aria-label={slot ? `${copy.slot} ${slot.toUpperCase()}: ${item.name}` : item.name}
      {...swipe.handlers}
      onPointerDown={(e) => {
        onActivate?.();
        swipe.handlers.onPointerDown(e);
      }}
      onFocusCapture={onActivate}
      className="relative h-full min-h-0 touch-pan-y select-none overflow-hidden bg-surface-dark-2 [-webkit-touch-callout:none]"
    >
      {/* Keyed by style: a new style gets a fresh track instead of sliding across styles */}
      <PhotoCarousel
        key={typeIndex}
        photos={photos}
        photo={photo}
        offset={swipe.offset}
        dragging={swipe.dragging}
        alt={`${item.name}, ${copy.photo} ${photoIndex + 1} ${copy.of} ${count}`}
        sizes={single ? "(min-width: 768px) 70vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          single
            ? "bg-[linear-gradient(to_top,rgba(0,0,0,.9),rgba(0,0,0,.35)_45%,transparent_70%)]"
            : "bg-[linear-gradient(to_top,rgba(0,0,0,.92),rgba(0,0,0,.4)_50%,transparent_75%)]"
        )}
      />

      {slot && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-4 top-[84px] z-10 flex h-10 w-10 items-center justify-center font-display text-[22px] font-bold text-white transition-colors duration-150",
              active ? "bg-red" : "bg-surface-dark"
            )}
          >
            {slot.toUpperCase()}
          </span>
          {active && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_0_4px_var(--red)]"
            />
          )}
        </>
      )}

      <p
        className={cn(
          "absolute z-10 bg-black/60 font-display font-semibold uppercase tracking-widest text-white tabular-nums",
          single
            ? "right-5 top-5 px-3.5 py-2 text-[15px]"
            : "right-4 top-[84px] px-3 py-1.5 text-sm"
        )}
      >
        {photoIndex + 1} {copy.of} {count}
      </p>

      {count > 1 && (
        <>
          <PhotoArrow dir={-1} label={copy.prev} single={single} onClick={() => step(-1)} />
          <PhotoArrow dir={1} label={copy.next} single={single} onClick={() => step(1)} />
        </>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 text-white",
          single ? "p-5 sm:p-8" : "p-4 lg:p-[22px]"
        )}
      >
        {single && count > 1 && (
          <PhotoDots
            photos={photos}
            photoIndex={photoIndex}
            onSelect={(i) => onPhotoChange(jumpNav(photo, i))}
            label={copy.showPhoto}
          />
        )}

        {single ? (
          <div>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-[56px]">
              {item.name}
            </h2>
            <div className="mt-4 h-1 w-20 bg-red" aria-hidden="true" />
            <p className="mt-4 hidden max-w-[52ch] text-lg leading-[1.55] text-neutral-200 sm:block">
              {item.desc}
            </p>
            <TagList tags={item.tags} className="mt-4 flex flex-wrap gap-x-6 gap-y-2" />
          </div>
        ) : (
          <>
            <h2 className="text-balance font-display text-2xl font-bold uppercase leading-[0.95] tracking-tight lg:text-[38px]">
              {item.name}
            </h2>
            <div className="mt-3 h-1 w-14 bg-red" aria-hidden="true" />
            <TagList tags={item.tags} className="mt-3 hidden flex-wrap gap-x-5 gap-y-1.5 md:flex" />
          </>
        )}
      </div>
    </section>
  );
}

const SWIPE_START = 8;
const SWIPE_DISTANCE = 0.2; // fraction of the photo's width
const SWIPE_FLICK_SPEED = 0.4; // px per ms
const SWIPE_FLICK_MIN = 30; // px

// Horizontal swipe on a photo: returns pointer handlers plus the live drag
// offset (1:1 with the finger) for the carousel track.
// - Gestures that start on a button or link are ignored, so taps on the
//   arrows, dots and CTAs never share state with a swipe.
// - The pointer is only captured once a sideways drag is clearly underway, so
//   the swipe always gets its pointerup even if the finger leaves the photo.
// - Releasing past 20% of the width, or a quick flick, moves one photo.
function useSwipe(onStep: (dir: 1 | -1) => void, enabled: boolean) {
  const gesture = useRef<{
    x: number;
    y: number;
    t: number;
    id: number;
    dragging: boolean;
  } | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const end = () => {
    gesture.current = null;
    setOffset(0);
    setDragging(false);
  };

  return {
    offset,
    dragging,
    handlers: {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        if (!enabled || !e.isPrimary || e.button !== 0) return;
        if ((e.target as Element).closest("button, a")) return;
        gesture.current = {
          x: e.clientX,
          y: e.clientY,
          t: e.timeStamp,
          id: e.pointerId,
          dragging: false,
        };
      },
      onPointerMove(e: PointerEvent<HTMLElement>) {
        const g = gesture.current;
        if (!g || g.id !== e.pointerId) return;
        // A mouse that was released outside the photo: drop the stale gesture
        if (e.pointerType === "mouse" && e.buttons === 0) return end();
        const dx = e.clientX - g.x;
        if (!g.dragging) {
          if (Math.abs(dx) < SWIPE_START || Math.abs(dx) <= Math.abs(e.clientY - g.y)) return;
          g.dragging = true;
          setDragging(true);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Pointer already released; the drag still ends on pointerup/cancel
          }
        }
        setOffset(dx);
      },
      onPointerUp(e: PointerEvent<HTMLElement>) {
        const g = gesture.current;
        if (!g || g.id !== e.pointerId) return;
        const dx = e.clientX - g.x;
        const distance = Math.abs(dx);
        const speed = distance / Math.max(1, e.timeStamp - g.t);
        const far = distance > e.currentTarget.clientWidth * SWIPE_DISTANCE;
        const flick = distance > SWIPE_FLICK_MIN && speed > SWIPE_FLICK_SPEED;
        if (g.dragging && (far || flick)) onStep(dx < 0 ? 1 : -1);
        end();
      },
      onPointerCancel: end,
    },
  };
}

// All of a style's photos sit side by side on one track, so every photo stays
// mounted and loaded: changing photos slides the track instead of swapping
// images (no flash). With 2+ photos the track holds three copies of the set
// and rests on the middle copy; each change moves one step (or the dot jump)
// in the direction it was asked, so wrapping around keeps sliding the same
// way. When a slide ends in an outer copy, the track silently re-centres.
function PhotoCarousel({
  photos,
  photo,
  offset,
  dragging,
  alt,
  sizes,
  fit = "cover",
}: {
  photos: StaticImageData[];
  photo: PhotoNav;
  offset: number;
  dragging: boolean;
  alt: string;
  sizes: string;
  fit?: "cover" | "contain";
}) {
  const count = photos.length;
  const looping = count > 1;
  const slides = looping ? [...photos, ...photos, ...photos] : photos;
  const centre = (index: number) => (looping ? count + index : index);

  const [shown, setShown] = useState(photo.index);
  const [pos, setPos] = useState(centre(photo.index));
  const [instant, setInstant] = useState(false);

  // Adjust state during render when the photo changes (no effect needed)
  if (photo.index !== shown) {
    const isStep = wrap(shown + photo.dir, count) === photo.index;
    const delta = isStep ? photo.dir : photo.index - shown;
    setShown(photo.index);
    setPos(Math.max(0, Math.min(slides.length - 1, pos + delta)));
    setInstant(false);
  }

  // After an instant re-centre, re-enable the slide once it has painted
  useEffect(() => {
    if (!instant) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setInstant(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [instant]);

  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !looping) return;
    if (pos < count || pos >= count * 2) {
      setInstant(true);
      setPos(centre(shown));
    }
  };

  return (
    <div
      className={cn(
        "absolute inset-0 flex",
        !dragging &&
          !instant &&
          "transition-transform duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
      )}
      style={{ transform: `translateX(calc(${-pos * 100}% + ${offset}px))` }}
      onTransitionEnd={onTransitionEnd}
    >
      {slides.map((src, i) => (
        <div key={i} className="relative h-full w-full shrink-0" aria-hidden={i !== pos || undefined}>
          <Image
            src={src}
            alt={i === pos ? alt : ""}
            fill
            sizes={sizes}
            placeholder="blur"
            loading="eager"
            fetchPriority={i === pos ? "high" : undefined}
            draggable={false}
            className={fit === "cover" ? "object-cover" : "object-contain"}
          />
        </div>
      ))}
    </div>
  );
}

type FullscreenPaneData = {
  slot?: Slot;
  typeIndex: number;
  photo: PhotoNav;
  onPhotoChange: (nav: PhotoNav) => void;
};

// Photos only: no names, tags or CTAs. One pane in single mode, A and B side
// by side in compare mode, each still browsable with arrows, dots and swipe.
function FullscreenViewer({
  copy,
  panes,
  onClose,
}: {
  copy: Copy;
  panes: FullscreenPaneData[];
  onClose: () => void;
}) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    // Arrow keys only make sense with a single photo on screen
    if (panes.length !== 1) return;
    const { photo, onPhotoChange, typeIndex } = panes[0];
    const count = DOOR_TYPES[typeIndex].photos.length;
    if (count < 2) return;
    if (e.key === "ArrowRight") onPhotoChange(stepNav(photo, 1, count));
    if (e.key === "ArrowLeft") onPhotoChange(stepNav(photo, -1, count));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.fullscreen}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 bg-black"
    >
      <div
        className={cn(
          "grid h-full gap-0.5",
          panes.length === 2 && "grid-rows-2 md:grid-cols-2 md:grid-rows-1"
        )}
      >
        {panes.map((pane) => (
          <FullscreenPane
            key={pane.slot ?? "single"}
            copy={copy}
            wide={panes.length === 1}
            {...pane}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={copy.exitFullscreen}
        autoFocus
        className="absolute right-4 top-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center bg-black/60 text-white transition-colors duration-150 hover:bg-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <XIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

function FullscreenPane({
  copy,
  wide,
  slot,
  typeIndex,
  photo,
  onPhotoChange,
}: FullscreenPaneData & { copy: Copy; wide: boolean }) {
  const item = copy.items[typeIndex];
  const photos = DOOR_TYPES[typeIndex].photos;
  const count = photos.length;
  const photoIndex = photo.index;
  const step = (dir: 1 | -1) => onPhotoChange(stepNav(photo, dir, count));
  const swipe = useSwipe(step, count > 1);

  return (
    <section
      aria-label={slot ? `${copy.slot} ${slot.toUpperCase()}: ${item.name}` : item.name}
      {...swipe.handlers}
      className="relative h-full min-h-0 touch-pan-y select-none overflow-hidden [-webkit-touch-callout:none]"
    >
      <PhotoCarousel
        key={typeIndex}
        photos={photos}
        photo={photo}
        offset={swipe.offset}
        dragging={swipe.dragging}
        alt={`${item.name}, ${copy.photo} ${photoIndex + 1} ${copy.of} ${count}`}
        sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
        fit="contain"
      />

      {slot && (
        <SlotBadge slot={slot} className="left-4 top-4 z-10 h-10 w-10 text-[22px]" />
      )}

      {count > 1 && (
        <>
          <PhotoArrow dir={-1} label={copy.prev} single={wide} onClick={() => step(-1)} />
          <PhotoArrow dir={1} label={copy.next} single={wide} onClick={() => step(1)} />
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
            <PhotoDots
              photos={photos}
              photoIndex={photoIndex}
              onSelect={(i) => onPhotoChange(jumpNav(photo, i))}
              label={copy.showPhoto}
            />
          </div>
        </>
      )}
    </section>
  );
}

function PhotoDots({
  photos,
  photoIndex,
  onSelect,
  label,
}: {
  photos: StaticImageData[];
  photoIndex: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  return (
    <div className="flex gap-2">
      {photos.map((photo, i) => (
        <button
          key={photo.src}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${label} ${i + 1}`}
          aria-current={i === photoIndex ? "true" : undefined}
          className="cursor-pointer py-[17px] focus-visible:outline-2 focus-visible:outline-white"
        >
          <span
            className={cn(
              "block h-2.5 transition-[width,background-color] duration-200 motion-reduce:transition-none",
              i === photoIndex ? "w-7 bg-red" : "w-2.5 bg-white/60"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function PhotoArrow({
  dir,
  label,
  single,
  onClick,
}: {
  dir: 1 | -1;
  label: string;
  single: boolean;
  onClick: () => void;
}) {
  const Chevron = dir === 1 ? ChevronRightIcon : ChevronLeftIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute z-10 flex cursor-pointer items-center justify-center bg-black/60 text-white transition-colors duration-150 hover:bg-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        single ? "top-[38%] h-[60px] w-[60px]" : "top-[40%] h-[52px] w-[52px]",
        dir === 1 ? (single ? "right-5" : "right-3") : single ? "left-5" : "left-3"
      )}
    >
      <Chevron className={single ? "h-7 w-7" : "h-6 w-6"} />
    </button>
  );
}

function TagList({ tags, className }: { tags: readonly string[]; className?: string }) {
  return (
    <ul className={className}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="flex items-center gap-2 font-display text-[15px] font-semibold uppercase tracking-wide"
        >
          <CheckIcon className="h-4 w-4 shrink-0 text-red" />
          {tag}
        </li>
      ))}
    </ul>
  );
}
