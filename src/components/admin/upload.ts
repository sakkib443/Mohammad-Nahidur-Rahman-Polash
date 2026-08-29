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
 * A serverless request body caps out at 4.5 MB, so anything going through the
 * API has to come in under that with room to spare for the multipart wrapper.
 */
const BODY_LIMIT = 3.8 * 1024 * 1024;

/** No gallery photo needs to be larger than this on a 440px-wide layout. */
const MAX_EDGE = 2400;

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality),
  );

/**
 * Re-encodes an oversized photo in the browser. Phone cameras produce 8–12 MB
 * files that no server route here can accept, and a gallery thumbnail gains
 * nothing from that resolution anyway.
 */
async function shrink(file: File): Promise<File> {
  if (file.size <= BODY_LIMIT) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // Not decodable here — let the server judge it.
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Step the quality down until it fits; 0.5 still looks fine at this size.
  for (const quality of [0.9, 0.8, 0.7, 0.6, 0.5]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= BODY_LIMIT) {
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], name, { type: "image/jpeg" });
    }
  }
  return file;
}

/**
 * Whether this deployment can hand the browser its own upload token. Asked
 * once and remembered: it cannot change without a redeploy.
 */
let directMode: boolean | null = null;

async function uploadsDirect(): Promise<boolean> {
  if (directMode === null) {
    const json = await fetch("/api/auth", { cache: "no-store" })
      .then((r) => r.json())
      .catch(() => ({}));
    directMode = Boolean(json?.blob);
  }
  return directMode;
}

/**
 * Sends files wherever this host keeps them: through the API on a writable
 * disk, or straight from the browser to Blob on Vercel — where a request body
 * over 4.5 MB never reaches the server at all.
 */
export async function uploadFiles(files: File[]): Promise<UploadResult> {
  if (files.length === 0) return { ok: true, saved: [], skipped: [] };

  if (!(await uploadsDirect())) {
    // Everything travels through the API here, so shrink photos to fit and
    // reject the videos that never could — silence would look like a hang.
    const form = new FormData();
    const skipped: string[] = [];
    let queued = 0;

    for (const file of files) {
      const ready = file.type.startsWith("image/") ? await shrink(file) : file;
      if (ready.size > BODY_LIMIT) {
        skipped.push(`${file.name} (${mb(file.size)}MB — এই হোস্টে সর্বোচ্চ 4MB)`);
        continue;
      }
      form.append("files", ready);
      queued += 1;
    }

    if (queued === 0) {
      return { ok: false, saved: [], skipped, error: skipped[0] };
    }

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({ ok: false }));
    return {
      ok: Boolean(json.ok),
      saved: json.saved ?? [],
      skipped: [...skipped, ...(json.skipped ?? [])],
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
