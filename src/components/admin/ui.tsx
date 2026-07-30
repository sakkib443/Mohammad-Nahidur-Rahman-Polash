"use client";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
}) {
  const cls =
    "w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand";

  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted">
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </label>
  );
}

export function Btn({
  children,
  onClick,
  tone = "default",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "default" | "primary" | "danger" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const tones = {
    default: "border border-line bg-surface-2 text-ink",
    primary: "bg-brand text-white",
    danger: "border border-[#d93025] text-[#d93025]",
    ghost: "text-brand",
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-opacity active:opacity-70 disabled:opacity-50 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Row({
  children,
  onRemove,
  onUp,
  onDown,
  title,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  onUp?: () => void;
  onDown?: () => void;
  title: string;
}) {
  return (
    <div className="kp-card space-y-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[12px] font-semibold text-ink">{title}</p>
        <div className="flex shrink-0 items-center gap-1">
          {onUp && (
            <button
              type="button"
              onClick={onUp}
              aria-label="Move up"
              className="grid h-7 w-7 place-items-center rounded-full border border-line text-[12px] text-muted"
            >
              ↑
            </button>
          )}
          {onDown && (
            <button
              type="button"
              onClick={onDown}
              aria-label="Move down"
              className="grid h-7 w-7 place-items-center rounded-full border border-line text-[12px] text-muted"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="grid h-7 w-7 place-items-center rounded-full border border-[#d93025] text-[12px] text-[#d93025]"
          >
            ✕
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
