"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReelItem } from "@/lib/types";
import { isPlayableInApp } from "@/lib/embed";
import { EmptyState } from "./Cards";
import ReelModal from "./ReelModal";
import { LinkIcon, PlatformIcon, PlayIcon, platformColors } from "./icons";

function Thumb({ reel }: { reel: ReelItem }) {
  return (
    <>
      <span className="relative block aspect-[9/16] w-full bg-surface-2">
        {reel.thumb ? (
          <Image
            src={reel.thumb}
            alt={reel.title}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : null}
        <span className="absolute inset-0 grid place-items-center bg-black/25">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-black">
            <PlayIcon width={20} height={20} />
          </span>
        </span>
        <span
          className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full text-white"
          style={{ background: platformColors[reel.platform] ?? "#1a73e8" }}
        >
          <PlatformIcon platform={reel.platform} size={15} />
        </span>
        {!isPlayableInApp(reel) && (
          <span
            className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white"
            title="Opens on the platform"
          >
            <LinkIcon width={12} height={12} />
          </span>
        )}
      </span>
      <span className="clamp-2 block px-2 py-1.5 text-[11px] text-muted">
        {reel.title}
      </span>
    </>
  );
}

export default function ReelsTab({ reels }: { reels: ReelItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const usable = reels.filter((r) => r.url.trim() || r.file.trim());

  if (usable.length === 0) {
    return <EmptyState text="No reels yet." />;
  }

  // Only the in-app playable ones go in the modal, so swiping never lands on
  // a dead frame for a link the platform refuses to embed.
  const playable = usable.filter(isPlayableInApp);

  return (
    <>
      <section className="grid grid-cols-2 gap-3 px-4 pt-4">
        {usable.map((reel) =>
          isPlayableInApp(reel) ? (
            <button
              key={reel.id}
              type="button"
              onClick={() => setOpen(playable.findIndex((p) => p.id === reel.id))}
              aria-label={`Play ${reel.title}`}
              className="kp-card overflow-hidden text-left active:scale-[0.98]"
            >
              <Thumb reel={reel} />
            </button>
          ) : (
            <a
              key={reel.id}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="kp-card overflow-hidden active:scale-[0.98]"
            >
              <Thumb reel={reel} />
            </a>
          ),
        )}
      </section>

      {playable.length < usable.length && (
        <p className="px-4 pt-3 text-[11px] leading-relaxed text-muted">
          Reels marked ↗ are profile links. TikTok and Instagram only allow
          single videos to be embedded, not profile pages, so those open on the
          platform.
        </p>
      )}

      {open !== null && open >= 0 && (
        <ReelModal
          reels={playable}
          index={open}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
