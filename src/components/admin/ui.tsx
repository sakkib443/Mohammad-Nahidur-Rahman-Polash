"use client";

import { useEffect } from "react";
import { uploadFiles } from "./upload";

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

/**
 * Centred dialog for add/edit forms. Rendered only while open, so the fields
 * inside reset themselves between openings without extra bookkeeping.
 */
export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  // Esc closes, and the page behind must not scroll while the sheet is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 shadow-lg sm:rounded-2xl"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-[14px] font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-[13px] text-muted"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5">{children}</div>

        {footer && <div className="mt-4 flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/** Uploads a clip to /media and hands the resulting path back. */
export function VideoUpload({
  onUploaded,
  flash,
}: {
  onUploaded: (src: string) => void;
  flash: (text: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted">
        Or upload a video file (max 64MB)
      </span>
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const input = e.currentTarget;

          flash("Uploading…");

          const result = await uploadFiles([file]);
          input.value = "";

          if (result.saved.length === 0) {
            flash(`✕ ${result.error || result.skipped[0] || "Upload failed"}`);
            return;
          }
          onUploaded(result.saved[0]);
          flash("✓ Video uploaded — now save");
        }}
        className="w-full text-[12px] text-muted"
      />
    </label>
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
