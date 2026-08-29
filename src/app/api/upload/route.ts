import fs from "node:fs/promises";
import path from "node:path";
import { isAuthed, unauthorized } from "@/lib/auth";
import { blobEnabled, deleteBlobFile, putBlobFile } from "@/lib/blob";
import { addGalleryPhotos, removeGalleryPhoto } from "@/lib/store";

export const dynamic = "force-dynamic";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const GALLERY_DIR = path.join(PUBLIC_DIR, "gallery");
const MEDIA_DIR = path.join(PUBLIC_DIR, "media");

type Kind = { ext: string; dir: string; urlBase: string; max: number };

const IMAGE_MAX = 8 * 1024 * 1024; // 8 MB
const VIDEO_MAX = 64 * 1024 * 1024; // 64 MB

const ALLOWED: Record<string, Kind> = {
  "image/jpeg": { ext: ".jpg", dir: GALLERY_DIR, urlBase: "/gallery", max: IMAGE_MAX },
  "image/png": { ext: ".png", dir: GALLERY_DIR, urlBase: "/gallery", max: IMAGE_MAX },
  "image/webp": { ext: ".webp", dir: GALLERY_DIR, urlBase: "/gallery", max: IMAGE_MAX },
  "image/avif": { ext: ".avif", dir: GALLERY_DIR, urlBase: "/gallery", max: IMAGE_MAX },
  "video/mp4": { ext: ".mp4", dir: MEDIA_DIR, urlBase: "/media", max: VIDEO_MAX },
  "video/webm": { ext: ".webm", dir: MEDIA_DIR, urlBase: "/media", max: VIDEO_MAX },
  "video/quicktime": { ext: ".mp4", dir: MEDIA_DIR, urlBase: "/media", max: VIDEO_MAX },
};

const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);

/**
 * Admin-only upload: to `public/gallery` and `public/media` on a writable
 * disk, otherwise to Blob.
 *
 * Preferred only when the browser cannot upload on its own — a Vercel function
 * accepts at most a 4.5 MB request body, so large files must take the direct
 * route in /api/upload/client instead.
 */
export async function POST(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const form = await request.formData().catch(() => null);
  if (!form) {
    return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return Response.json({ ok: false, error: "No files" }, { status: 400 });
  }

  const saved: string[] = [];
  const skipped: string[] = [];
  const images: string[] = [];

  for (const file of files) {
    const kind = ALLOWED[file.type];
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
    const name = `upload-${stamp}-${rand}${kind.ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    let src: string;

    if (blobEnabled()) {
      // Only reached when the browser has no upload token of its own, so this
      // path is still bounded by the host's request body limit.
      src = await putBlobFile(
        `${kind.urlBase.slice(1)}/${name}`,
        buffer,
        file.type,
      );
    } else {
      await fs.mkdir(kind.dir, { recursive: true });
      await fs.writeFile(path.join(kind.dir, name), buffer);
      src = `${kind.urlBase}/${name}`;
    }

    saved.push(src);
    if (kind.urlBase === "/gallery") images.push(src);
  }

  // Blob has no folder to list, so every photo has to be recorded to show up.
  await addGalleryPhotos(images);

  return Response.json({ ok: true, saved, skipped });
}

/**
 * Records files the browser uploaded straight to Blob. The upload itself never
 * reaches this server, so without this the gallery would never learn about it.
 */
export async function PATCH(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const body = await request.json().catch(() => null);
  const srcs: unknown = body?.srcs;
  if (!Array.isArray(srcs)) {
    return Response.json({ ok: false, error: "No files" }, { status: 400 });
  }

  const clean = srcs.filter(
    (s): s is string =>
      typeof s === "string" &&
      /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/gallery\//.test(s),
  );

  await addGalleryPhotos(clean);
  return Response.json({ ok: true, added: clean.length });
}

/** Admin-only delete of an uploaded file under /gallery or /media. */
export async function DELETE(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";

  // Blob-hosted files are absolute URLs; only ours may be deleted.
  if (/^https?:\/\//.test(src)) {
    if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(src)) {
      return Response.json({ ok: false, error: "Invalid path" }, { status: 400 });
    }
    await deleteBlobFile(src).catch(() => {});
    await removeGalleryPhoto(src);
    return Response.json({ ok: true });
  }

  const match = src.match(/^\/(gallery|media)\/([^/\\]+)$/);
  if (!match) {
    return Response.json({ ok: false, error: "Invalid path" }, { status: 400 });
  }

  const dir = match[1] === "gallery" ? GALLERY_DIR : MEDIA_DIR;
  const base = path.basename(match[2]);
  const target = path.join(dir, base);

  // Belt and braces: the resolved path must still sit inside the folder.
  if (!target.startsWith(dir + path.sep)) {
    return Response.json({ ok: false, error: "Invalid path" }, { status: 400 });
  }

  // A failure here used to be swallowed, which left the file on disk for the
  // folder scan to re-add — the photo came back and nothing said why.
  try {
    await fs.unlink(target);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      return Response.json(
        { ok: false, error: `ফাইলটি মুছতে পারিনি (${code ?? "error"})` },
        { status: 500 },
      );
    }
  }

  await removeGalleryPhoto(src);
  return Response.json({ ok: true });
}
