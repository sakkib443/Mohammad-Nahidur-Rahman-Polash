"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HeroCarousel({
  images,
  alt,
  onOpen,
}: {
  images: string[];
  alt: string;
  onOpen?: (src: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }, []);

  // Derive the active dot from the scroll position rather than tracking taps,
  // so drag-scrolling stays in sync too.
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

  useEffect(() => {
    if (paused || images.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const width = track.clientWidth || 1;
      const next = (Math.round(track.scrollLeft / width) + 1) % images.length;
      track.scrollTo({ left: next * width, behavior: "smooth" });
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="px-4 pt-3"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-xl border border-line bg-surface-2">
        <div
          ref={trackRef}
          className="no-scrollbar snap-x-strip flex overflow-x-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${alt} photos`}
        >
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => onOpen?.(src)}
              className="relative aspect-[5/4] w-full shrink-0"
              aria-label={`${alt} — photo ${i + 1} of ${images.length}`}
            >
              <Image
                src={src}
                alt={`${alt} — ${i + 1}`}
                fill
                sizes="440px"
                priority={i === 0}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-brand" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
