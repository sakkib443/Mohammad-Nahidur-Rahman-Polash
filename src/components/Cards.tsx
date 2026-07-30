import type { AboutRow, Fact } from "@/lib/types";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-4 pb-2 pt-5 text-[13px] font-semibold tracking-wide text-ink">
      {children}
    </h2>
  );
}

export function FactGrid({ facts }: { facts: Fact[] }) {
  const visible = facts.filter((f) => f.value.trim());
  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pt-4">
      {visible.map((f) => (
        <div key={f.id} className="kp-card px-3 py-2.5">
          <p className="text-[11px] font-medium text-muted">{f.label}</p>
          <p className="mt-0.5 text-[15px] font-bold leading-tight text-ink">
            {f.value}
          </p>
          {f.note ? (
            <p className="mt-0.5 text-[11px] text-amber">{f.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function OverviewCard({
  text,
  textBn,
}: {
  text: string;
  textBn: string;
}) {
  if (!text && !textBn) return null;

  return (
    <div className="px-4 pt-3">
      <div className="kp-card overflow-hidden">
        <div className="border-l-4 border-brand px-3 py-3">
          <p className="text-[13px] font-semibold text-ink">Overview</p>
          {text ? (
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {text}
            </p>
          ) : null}
          {textBn ? (
            <p className="mt-2 border-t border-line pt-2 text-[13px] leading-[1.9] text-muted">
              {textBn}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AboutCard({ rows }: { rows: AboutRow[] }) {
  const visible = rows.filter((r) => r.value.trim());
  if (visible.length === 0) return null;

  return (
    <div className="px-4 pt-3">
      <div className="kp-card px-3 py-3">
        <p className="text-[13px] font-semibold text-ink">About</p>
        <dl className="mt-2 divide-y divide-line">
          {visible.map((r) => (
            <div key={r.id} className="flex gap-3 py-2">
              <dt className="w-28 shrink-0 text-[12px] text-muted">{r.label}</dt>
              <dd className="text-[12.5px] font-medium text-amber">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="px-4 pt-4">
      <div className="kp-card px-4 py-10 text-center">
        <p className="text-[13px] text-muted">{text}</p>
      </div>
    </div>
  );
}
