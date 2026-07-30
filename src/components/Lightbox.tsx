"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon, CloseIcon } from "./icons";

export default function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(index);

  // The track's own scroll position is the source of truth, so stepping never
  // goes stale between a swipe, an arrow key and a button tap.
  const step = useCallback(
    (delta: number) => {
      const track = trackRef.current;
      if (!track) return;
      const width = track.clientWidth || 1;
      const current = Math.round(track.scrollLeft / width);
      const next = Math.min(Math.max(current + delta, 0), images.length - 1);
      track.scrollTo({ left: next * width, behavior: "smooth" });
    },
    [images.length],
  );

  // Jump to the tapped photo without animating. Kept apart from the listener
  // effect below so a re-rendered parent's new onClose doesn't scroll us back.
  // No setActive here — the assignment fires a scroll event, and the listener
  // further down turns that into the counter update.
  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = index * track.clientWidth;
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, step]);

  // Derive the counter from the scroll offset so a swipe updates it too.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = track.clientWidth || 1;
        setActive(Math.round(track.scrollLeft / width));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Portalled to <body>: a transformed ancestor (the .kp-enter tab animation,
  // for one) would otherwise become the containing block for `fixed` and pin
  // the overlay to that element's box instead of the viewport.
  if (typeof document === "undefined") return null;

  const many = images.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Kept at the shell width so the viewer stays phone-shaped on desktop. */}
      <div className="relative mx-auto flex h-full w-full max-w-[440px] flex-col bg-black">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-white/70">
            {many ? `${active + 1} / ${images.length}` : "1 photo"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="grid h-10 w-10 place-items-center rounded-full text-white active:scale-95"
          >
            <CloseIcon width={22} height={22} />
          </button>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar snap-x-strip flex flex-1 overflow-x-auto"
        >
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt={`Photo ${i + 1}`}
                fill
                sizes="440px"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Swiping already works via scroll-snap; these are the mouse and
            keyboard affordance for the same movement. */}
        {many && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={active === 0}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition-opacity active:scale-95 disabled:pointer-events-none disabled:opacity-0"
            >
              <span className="rotate-180">
                <ChevronIcon width={22} height={22} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={active === images.length - 1}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition-opacity active:scale-95 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronIcon width={22} height={22} />
            </button>
          </>
        )}

        <p className="px-4 pb-6 pt-3 text-center text-xs text-white/50">
          {many ? "Swipe or use ← →" : "Tap outside to close"}
        </p>
      </div>
    </div>,
    document.body,
  );
}
