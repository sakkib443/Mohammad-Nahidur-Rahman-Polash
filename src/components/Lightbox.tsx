"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CloseIcon } from "./icons";

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

  // Jump to the tapped photo without animating, then trap Escape.
  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = index * track.clientWidth;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, onClose]);

  return (
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
      <div className="mx-auto flex h-full w-full max-w-[440px] flex-col bg-black">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-white/70">
            {images.length} photo{images.length === 1 ? "" : "s"}
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

        <p className="px-4 pb-6 pt-3 text-center text-xs text-white/50">
          সোয়াইপ করে পরের ছবি দেখুন · Swipe for more
        </p>
      </div>
    </div>
  );
}
