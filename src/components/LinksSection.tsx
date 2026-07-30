"use client";

import { useState } from "react";
import type { LinkItem } from "@/lib/types";
import { ChevronIcon, PlatformIcon, platformColors } from "./icons";

export default function LinksSection({ links }: { links: LinkItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const valid = links.filter((l) => l.url.trim());
  if (valid.length === 0) return null;

  const featured = valid.filter((l) => l.featured);
  const strip = featured.length > 0 ? featured : valid.slice(0, 7);
  const rest = valid.filter((l) => !strip.includes(l));

  return (
    <section className="pt-5">
      <h2 className="px-4 pb-2 text-[13px] font-semibold text-ink">
        Profile Links
      </h2>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {strip.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer me"
            title={l.label}
            className="flex w-14 shrink-0 flex-col items-center gap-1"
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-white shadow-panel transition-transform active:scale-90"
              style={{ background: platformColors[l.platform] ?? "#1a73e8" }}
            >
              <PlatformIcon platform={l.platform} size={21} />
            </span>
            <span className="w-full truncate text-center text-[10px] text-muted">
              {l.label}
            </span>
          </a>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="px-4 pt-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-[12.5px] font-medium text-brand active:opacity-70"
          >
            <span>
              {expanded ? "কম দেখুন" : `আরও ${rest.length}টি লিংক`} ·{" "}
              {expanded ? "Show less" : "More links"}
            </span>
            <ChevronIcon
              width={16}
              height={16}
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>

          {expanded && (
            <ul className="kp-enter mt-1 divide-y divide-line overflow-hidden rounded-xl border border-line">
              {rest.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="flex items-center gap-3 bg-surface px-3 py-2.5 active:bg-surface-2"
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                      style={{
                        background: platformColors[l.platform] ?? "#1a73e8",
                      }}
                    >
                      <PlatformIcon platform={l.platform} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-ink">
                        {l.label}
                      </span>
                      <span className="block truncate text-[11px] text-muted">
                        {l.url.replace(/^https?:\/\//, "")}
                      </span>
                    </span>
                    <ChevronIcon
                      width={15}
                      height={15}
                      className="shrink-0 text-muted"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
