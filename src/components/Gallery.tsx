"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPhoto } from "@/lib/types";
import Lightbox from "./Lightbox";

const STEP = 12;

export default function Gallery({
  photos,
  name,
}: {
  photos: GalleryPhoto[];
  name: string;
}) {
  const [shown, setShown] = useState(STEP);
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) return null;
  const visible = photos.slice(0, shown);

  return (
    // No heading: the Gallery tab's own sub-tabs already label and count this.
    <section className="pt-4">
      <div className="grid grid-cols-2 gap-3 px-4">
        {visible.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(i)}
            className="kp-card overflow-hidden text-left active:scale-[0.98]"
          >
            <span className="relative block aspect-square w-full bg-surface-2">
              <Image
                src={p.src}
                alt={p.caption || `${name} — photo`}
                fill
                sizes="220px"
                loading={i < 4 ? "eager" : "lazy"}
                className="object-cover"
              />
            </span>
            <span className="block px-2 py-1.5 text-center text-[11px] text-muted">
              {p.caption || name.split(" ").slice(0, 2).join(" ")}
            </span>
          </button>
        ))}
      </div>

      {shown < photos.length && (
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={() => setShown((s) => s + STEP)}
            className="w-full rounded-full border border-line bg-surface-2 py-2.5 text-[12.5px] font-medium text-brand active:opacity-70"
          >
            Load more ({photos.length - shown})
          </button>
        </div>
      )}

      {open !== null && (
        <Lightbox
          images={photos.map((p) => p.src)}
          index={open}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
