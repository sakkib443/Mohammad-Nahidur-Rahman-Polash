"use client";

import Image from "next/image";
import { useState } from "react";
import type { VideoItem } from "@/lib/types";
import { EmptyState } from "./Cards";
import { PlayIcon } from "./icons";

function YoutubeCard({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const poster =
    video.poster || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <div className="kp-card overflow-hidden">
      <div className="relative aspect-video w-full bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Click-to-load: no YouTube script runs until the user asks for it.
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="group absolute inset-0"
          >
            {video.poster ? (
              <Image
                src={poster}
                alt={video.title}
                fill
                sizes="440px"
                className="object-cover"
              />
            ) : (
              // Remote thumbnail: plain <img> keeps next.config free of remote patterns.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt={video.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            )}
            <span className="absolute inset-0 grid place-items-center bg-black/25">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FF0000] text-white shadow-lg transition-transform group-active:scale-90">
                <PlayIcon width={26} height={26} />
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="px-3 py-2.5 text-[13px] font-medium text-ink">
        {video.title}
      </p>
    </div>
  );
}

function FileCard({ video }: { video: VideoItem }) {
  const [ratio, setRatio] = useState<number | null>(null);

  return (
    <div className="kp-card overflow-hidden">
      {/* No fixed aspect box: `preload="metadata"` gives us the clip's real
          dimensions and the element is sized to those, so nothing is cropped
          or letterboxed. intro.mp4, for instance, is square — not 16:9. */}
      <video
        controls
        preload="metadata"
        playsInline
        poster={video.poster || undefined}
        style={{ aspectRatio: ratio ? String(ratio) : "16 / 9" }}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
        }}
        className="w-full bg-black"
      >
        <source src={video.file} type="video/mp4" />
        Your browser does not support video playback.
      </video>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-medium text-ink">{video.title}</p>
        {video.date ? (
          <p className="mt-0.5 text-[11px] text-muted">{video.date}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function VideoTab({
  videos,
  channelUrl,
}: {
  videos: VideoItem[];
  channelUrl?: string;
}) {
  const usable = videos.filter((v) => v.youtubeId.trim() || v.file.trim());

  if (usable.length === 0) {
    return <EmptyState text="No videos yet." />;
  }

  return (
    <section className="space-y-3 px-4 pt-4">
      {usable.map((v) =>
        v.youtubeId.trim() ? (
          <YoutubeCard key={v.id} video={v} />
        ) : (
          <FileCard key={v.id} video={v} />
        ),
      )}

      {channelUrl ? (
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-[#FF0000] py-2.5 text-center text-[13px] font-semibold text-white active:opacity-90"
        >
          Visit YouTube channel
        </a>
      ) : null}
    </section>
  );
}
