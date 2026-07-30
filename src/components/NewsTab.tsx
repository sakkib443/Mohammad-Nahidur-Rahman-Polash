import Image from "next/image";
import type { NewsItem } from "@/lib/types";
import { ChevronIcon } from "./icons";

function formatDate(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsTab({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <div className="px-4 pt-4">
        <div className="kp-card px-3 py-3">
          <p className="text-[13px] font-semibold text-ink">Latest News</p>
          <p className="mt-1 text-[12.5px] text-muted">
            Stay tuned for <span className="text-brand">updates</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-3 px-4 pt-4">
      {news.map((n) => (
        <a
          key={n.id}
          href={n.url || "#"}
          target={n.url ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="kp-card block overflow-hidden active:scale-[0.99]"
        >
          {n.image ? (
            <span className="relative block aspect-[16/10] w-full bg-surface-2">
              <Image
                src={n.image}
                alt={n.title}
                fill
                sizes="440px"
                className="object-cover"
              />
            </span>
          ) : null}
          <span className="block px-3 py-3">
            <span className="flex items-center gap-2 text-[11px]">
              <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">
                {n.source}
              </span>
              <span className="text-muted">{formatDate(n.date)}</span>
            </span>
            <span className="clamp-3 mt-1.5 block text-[13.5px] font-semibold leading-snug text-ink">
              {n.title}
            </span>
            {n.excerpt ? (
              <span className="clamp-3 mt-1 block text-[12px] leading-relaxed text-muted">
                {n.excerpt}
              </span>
            ) : null}
            {n.url ? (
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-brand">
                Read more <ChevronIcon width={14} height={14} />
              </span>
            ) : null}
          </span>
        </a>
      ))}
    </section>
  );
}
