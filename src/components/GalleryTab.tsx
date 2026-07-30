"use client";

import { useState } from "react";
import type { GalleryPhoto, VideoItem } from "@/lib/types";
import Gallery from "./Gallery";
import VideoTab from "./VideoTab";

type Sub = "Images" | "Videos";

export default function GalleryTab({
  photos,
  videos,
  name,
  channelUrl,
}: {
  photos: GalleryPhoto[];
  videos: VideoItem[];
  name: string;
  channelUrl?: string;
}) {
  const [sub, setSub] = useState<Sub>("Images");

  const playable = videos.filter((v) => v.youtubeId.trim() || v.file.trim());
  const subs: { key: Sub; count: number }[] = [
    { key: "Images", count: photos.length },
    { key: "Videos", count: playable.length },
  ];

  return (
    <>
      {/* Segmented control — deliberately lighter than the main tab pills so
          the two levels of navigation stay distinguishable. */}
      <div className="px-4 pt-4">
        <div
          role="tablist"
          aria-label="Gallery type"
          className="flex gap-1 rounded-full border border-line bg-surface-2 p-1"
        >
          {subs.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={sub === s.key}
              onClick={() => setSub(s.key)}
              className={`flex-1 rounded-full py-1.5 text-[12.5px] font-medium transition-colors ${
                sub === s.key
                  ? "bg-surface text-brand shadow-panel"
                  : "text-muted"
              }`}
            >
              {s.key}
              <span className="ml-1 font-normal">({s.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div key={sub} className="kp-enter">
        {sub === "Images" ? (
          <Gallery photos={photos} name={name} />
        ) : (
          <VideoTab videos={videos} channelUrl={channelUrl} />
        )}
      </div>
    </>
  );
}
