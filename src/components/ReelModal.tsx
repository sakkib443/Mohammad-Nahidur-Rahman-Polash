"use client";

import { useEffect, useRef, useState } from "react";
import type { ReelItem } from "@/lib/types";
import { resolveReelSource } from "@/lib/embed";
import { CloseIcon } from "./icons";

/** A local clip: sized to its own aspect ratio, not forced into a box. */
function FileReel({ reel, active }: { reel: ReelItem; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  // Only the reel on screen plays; the rest pause so audio never overlaps.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      video.play().catch(() => {
        /* autoplay blocked — the controls are right there */
      });
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      controls
      playsInline
      loop
      preload="metadata"
      poster={reel.thumb || undefined}
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget;
        if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
      }}
      className="max-h-full w-full bg-black object-contain"
    >
      <source src={reel.file} type="video/mp4" />
      Your browser does not support video playback.
    </video>
  );
}

export default function ReelModal({
  reels,
  index,
  onClose,
}: {
  reels: ReelItem[];
  index: number;
  onClose: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(index);

  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollTop = index * track.clientHeight;

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

  // Which reel is on screen drives which one plays. IntersectionObserver is
  // used rather than a scroll listener because it reports the slide directly
  // and keeps working when the browser throttles scroll/rAF callbacks.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = slides.indexOf(entry.target as HTMLElement);
            if (i !== -1) setActive(i);
          }
        }
      },
      { root: track, threshold: 0.6 },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [reels.length]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Reel viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Same shell width as the photo viewer so it stays phone-shaped. */}
      <div className="mx-auto flex h-full w-full max-w-[440px] flex-col bg-black">
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <span className="min-w-0 truncate pr-2 text-sm text-white/70">
            {reels[active]?.title || "Reel"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reel viewer"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white active:scale-95"
          >
            <CloseIcon width={22} height={22} />
          </button>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar flex-1 snap-y snap-mandatory overflow-y-auto"
        >
          {reels.map((reel, i) => {
            const source = resolveReelSource(reel);
            return (
              <div
                key={reel.id}
                className="flex h-full w-full snap-center items-center justify-center"
              >
                {source.kind === "file" ? (
                  <FileReel reel={reel} active={i === active} />
                ) : source.kind === "iframe" ? (
                  <iframe
                    src={source.src}
                    title={reel.title}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {reels.length > 1 && (
          <p className="shrink-0 px-4 pb-6 pt-3 text-center text-xs text-white/50">
            Swipe up for next · {active + 1}/{reels.length}
          </p>
        )}
      </div>
    </div>
  );
}
