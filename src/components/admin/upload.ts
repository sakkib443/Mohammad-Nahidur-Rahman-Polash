"use client";

import { upload } from "@vercel/blob/client";

export type UploadResult = {
  ok: boolean;
  saved: string[];
  skipped: string[];
  error?: string;
};

const KINDS: Record<string, { ext: string; folder: "gallery" | "media"; max: number }> = {
  "image/jpeg": { ext: ".jpg", folder: "gallery", max: 8 * 1024 * 1024 },
  "image/png": { ext: ".png", folder: "gallery", max: 8 * 1024 * 1024 },
  "image/webp": { ext: ".webp", folder: "gallery", max: 8 * 1024 * 1024 },
  "image/avif": { ext: ".avif", folder: "gallery", max: 8 * 1024 * 1024 },
  "video/mp4": { ext: ".mp4", folder: "media", max: 64 * 1024 * 1024 },
  "video/webm": { ext: ".webm", folder: "media", max: 64 * 1024 * 1024 },
  "video/quicktime": { ext: ".mp4", folder: "media", max: 64 * 1024 * 1024 },
};

const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);

/**
 * Whether this deployment stores files in Blob. Asked once and remembered:
 * it cannot change without a redeploy.
 */
let blobMode: boolean | null = null;

async function usesBlob(): Promise<boolean> {
  if (blobMode === null) {
    const json = await fetch("/api/auth", { cache: "no-store" })
      .then((r) => r.json())
      .catch(() => ({}));
    blobMode = Boolean(json?.blob);
  }
  return blobMode;
}

/**
 * Sends files wherever this host keeps them: through the API on a writable
 * disk, or straight from the browser to Blob on Vercel — where a request body
 * over 4.5 MB never reaches the server at all.
 */
export async function uploadFiles(files: File[]): Promise<UploadResult> {
  if (files.length === 0) return { ok: true, saved: [], skipped: [] };

  if (!(await usesBlob())) {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({ ok: false }));
    return {
      ok: Boolean(json.ok),
      saved: json.saved ?? [],
      skipped: json.skipped ?? [],
      error: json.error,
    };
  }

  const saved: string[] = [];
  const skipped: string[] = [];
  const images: string[] = [];

  for (const file of files) {
    const kind = KINDS[file.type];
    if (!kind) {
      skipped.push(`${file.name} (unsupported type)`);
      continue;
    }
    if (file.size > kind.max) {
      skipped.push(`${file.name} (over ${mb(kind.max)}MB)`);
      continue;
    }

    // Never trust the client filename — build our own.
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 7);
    const pathname = `${kind.folder}/upload-${stamp}-${rand}${kind.ext}`;

    try {
      const blob = await upload(pathname, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/upload/client",
      });
      saved.push(blob.url);
      if (kind.folder === "gallery") images.push(blob.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "upload failed";
      skipped.push(`${file.name} (${message})`);
    }
  }

  // The upload bypassed our server, so the gallery has to be told separately.
  if (images.length > 0) {
    await fetch("/api/upload", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ srcs: images }),
    }).catch(() => {});
  }

  return {
    ok: saved.length > 0 || skipped.length === 0,
    saved,
    skipped,
    error: saved.length === 0 ? skipped[0] : undefined,
  };
}
