"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPhoto } from "@/lib/types";
import Lightbox from "./Lightbox";
import { ChevronIcon } from "./icons";

const PREVIEW_COUNT = 9;

export default function GalleryPreview({
  photos,
  name,
  onSeeAll,
}: {
  photos: GalleryPhoto[];
  name: string;
  onSeeAll: () => void;
}) {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;

  const preview = photos.slice(0, PREVIEW_COUNT);
  const remaining = photos.length - preview.length;

  return (
    <section className="pt-5">
      <div className="flex items-baseline justify-between px-4 pb-2">
        <h2 className="text-[13px] font-semibold text-ink">
          Gallery{" "}
          <span className="font-normal text-muted">({photos.length})</span>
        </h2>
        {remaining > 0 && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-[12px] font-medium text-brand active:opacity-70"
          >
            See more
          </button>
        )}
      </div>

      {/* Tighter 3-up grid than the full Gallery tab — this is a taster, so it
          shows more photos in less height and drops the captions. */}
      <div className="grid grid-cols-3 gap-1.5 px-4">
        {preview.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`${name} — photo ${i + 1}`}
            className="relative aspect-square overflow-hidden rounded-lg bg-surface-2 active:scale-[0.97]"
          >
            <Image
              src={p.src}
              alt={p.caption || `${name} — photo ${i + 1}`}
              fill
              sizes="150px"
              loading={i < 3 ? "eager" : "lazy"}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {remaining > 0 && (
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={onSeeAll}
            className="flex w-full items-center justify-center gap-1 rounded-full border border-line bg-surface-2 py-2.5 text-[12.5px] font-medium text-brand active:opacity-70"
          >
            See all {photos.length} photos
            <ChevronIcon width={14} height={14} />
          </button>
        </div>
      )}

      {open !== null && (
        // The viewer spans the whole gallery, so swiping past the ninth photo
        // keeps going instead of dead-ending at the preview boundary.
        <Lightbox
          images={photos.map((p) => p.src)}
          index={open}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
