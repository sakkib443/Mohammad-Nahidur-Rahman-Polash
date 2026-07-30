"use client";

import Image from "next/image";
import type { ReelItem } from "@/lib/types";
import { EmptyState } from "./Cards";
import { PlatformIcon, PlayIcon, platformColors } from "./icons";

export default function ReelsTab({ reels }: { reels: ReelItem[] }) {
  const usable = reels.filter((r) => r.url.trim() || r.file.trim());

  if (usable.length === 0) {
    return <EmptyState text="এখনো কোনো রিল যোগ করা হয়নি · No reels yet" />;
  }

  return (
    <section className="grid grid-cols-2 gap-3 px-4 pt-4">
      {usable.map((r) =>
        r.file.trim() ? (
          <div key={r.id} className="kp-card overflow-hidden">
            <video
              controls
              preload="none"
              playsInline
              poster={r.thumb || undefined}
              className="aspect-[9/16] w-full bg-black object-cover"
            >
              <source src={r.file} type="video/mp4" />
            </video>
            <p className="clamp-2 px-2 py-1.5 text-[11px] text-muted">
              {r.title}
            </p>
          </div>
        ) : (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="kp-card overflow-hidden active:scale-[0.98]"
          >
            <span className="relative block aspect-[9/16] w-full bg-surface-2">
              {r.thumb ? (
                <Image
                  src={r.thumb}
                  alt={r.title}
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
                style={{ background: platformColors[r.platform] ?? "#1a73e8" }}
              >
                <PlatformIcon platform={r.platform} size={15} />
              </span>
            </span>
            <span className="clamp-2 block px-2 py-1.5 text-[11px] text-muted">
              {r.title}
            </span>
          </a>
        ),
      )}
    </section>
  );
}
