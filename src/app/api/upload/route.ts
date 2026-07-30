import fs from "node:fs/promises";
import path from "node:path";
import { isAuthed, unauthorized } from "@/lib/auth";

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
 * Admin-only upload. Images land in `public/gallery` (and so appear in the
 * gallery automatically); videos land in `public/media` for use as a reel or
 * video `file` path.
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

    await fs.mkdir(kind.dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(kind.dir, name), buffer);
    saved.push(`${kind.urlBase}/${name}`);
  }

  return Response.json({ ok: true, saved, skipped });
}

/** Admin-only delete of an uploaded file under /gallery or /media. */
export async function DELETE(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";

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

  await fs.unlink(target).catch(() => {});
  return Response.json({ ok: true });
}
