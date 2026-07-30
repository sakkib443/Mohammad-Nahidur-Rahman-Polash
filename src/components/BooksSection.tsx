import Image from "next/image";
import type { BookItem } from "@/lib/types";
import { BookIcon, ChevronIcon } from "./icons";

/** Placeholder for entries with no cover image yet. */
function CoverFallback() {
  return (
    <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand to-accent text-white">
      <BookIcon width={24} height={24} />
    </span>
  );
}

export default function BooksSection({ books }: { books: BookItem[] }) {
  const visible = books.filter((b) => b.title.trim());
  if (visible.length === 0) return null;

  return (
    <section className="pt-5">
      <h2 className="px-4 pb-2 text-[13px] font-semibold text-ink">
        Published works
      </h2>

      <div className="space-y-3 px-4">
        {visible.map((b) => {
          const Wrapper = b.url ? "a" : "div";
          return (
            <Wrapper
              key={b.id}
              {...(b.url
                ? {
                    href: b.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {})}
              className="kp-card flex gap-3 p-3 active:scale-[0.99]"
            >
              <span className="relative block h-[92px] w-[64px] shrink-0 overflow-hidden rounded-md bg-surface-2">
                {b.cover ? (
                  <Image
                    src={b.cover}
                    alt={b.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <CoverFallback />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-snug text-ink">
                  {b.title}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-amber">
                  {b.subtitle ? <span>{b.subtitle}</span> : null}
                  {b.year ? <span>{b.year}</span> : null}
                  {b.publisher ? <span>{b.publisher}</span> : null}
                </span>
                {b.description ? (
                  <span className="clamp-3 mt-1 block text-[12px] leading-relaxed text-muted">
                    {b.description}
                  </span>
                ) : null}
                {b.url ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-brand">
                    View <ChevronIcon width={13} height={13} />
                  </span>
                ) : null}
              </span>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
