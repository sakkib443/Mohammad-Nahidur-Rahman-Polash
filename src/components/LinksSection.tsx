import type { LinkItem } from "@/lib/types";
import { PlatformIcon, platformColors } from "./icons";

export default function LinksSection({ links }: { links: LinkItem[] }) {
  const valid = links.filter((l) => l.url.trim());
  if (valid.length === 0) return null;

  // Everything is on screen at once — a horizontal strip hid most of the 18
  // links behind a scroll almost nobody performs. `featured` now only decides
  // which ones lead the grid.
  const ordered = [
    ...valid.filter((l) => l.featured),
    ...valid.filter((l) => !l.featured),
  ];

  return (
    <section className="pt-5">
      <h2 className="px-4 pb-2 text-[13px] font-semibold text-ink">
        Profile Links{" "}
        <span className="font-normal text-muted">({ordered.length})</span>
      </h2>

      <div className="grid grid-cols-4 gap-x-2 gap-y-3.5 px-4">
        {ordered.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer me"
            title={l.label}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-full text-white shadow-panel transition-transform active:scale-90"
              style={{ background: platformColors[l.platform] ?? "#1a73e8" }}
            >
              <PlatformIcon platform={l.platform} size={22} />
            </span>
            <span className="clamp-2 w-full text-center text-[10px] leading-tight text-muted">
              {l.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
