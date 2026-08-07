import { MailIcon, PhoneIcon } from "./icons";

type Row = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function ContactInfo({
  emails,
  phones,
}: {
  emails: string[];
  phones: string[];
}) {
  const rows: Row[] = [
    ...emails
      .map((e) => e.trim())
      .filter(Boolean)
      .map((e) => ({
        key: `mail:${e}`,
        label: e,
        href: `mailto:${e}`,
        icon: <MailIcon width={18} height={18} />,
      })),
    ...phones
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => ({
        key: `tel:${p}`,
        label: p,
        href: `tel:${p.replace(/[^\d+]/g, "")}`,
        icon: <PhoneIcon width={18} height={18} />,
      })),
  ];

  if (rows.length === 0) return null;

  return (
    <section className="px-4 pt-5">
      <h2 className="pb-2 text-[13px] font-semibold text-ink">Contact info</h2>
      <ul className="kp-card divide-y divide-line">
        {rows.map((r) => (
          <li key={r.key}>
            <a
              href={r.href}
              className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-ink transition-colors active:bg-surface-2"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-brand">
                {r.icon}
              </span>
              <span className="truncate font-medium text-brand">{r.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
