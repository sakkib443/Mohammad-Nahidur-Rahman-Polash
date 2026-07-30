import fs from "node:fs/promises";
import path from "node:path";
import { isAuthed, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per photo
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

/** Admin-only photo upload straight into `public/gallery`. */
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

  await fs.mkdir(GALLERY_DIR, { recursive: true });
  const saved: string[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const ext = ALLOWED[file.type];
    if (!ext) {
      skipped.push(`${file.name} (unsupported type)`);
      continue;
    }
    if (file.size > MAX_BYTES) {
      skipped.push(`${file.name} (over 8MB)`);
      continue;
    }

    // Never trust the client filename — build our own.
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 7);
    const name = `upload-${stamp}-${rand}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(GALLERY_DIR, name), buffer);
    saved.push(`/gallery/${name}`);
  }

  return Response.json({ ok: true, saved, skipped });
}

/** Admin-only delete of a gallery file. */
export async function DELETE(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";

  // Only ever touch a plain filename inside public/gallery.
  const base = path.basename(src);
  if (!base || base !== src.replace(/^\/gallery\//, "")) {
    return Response.json({ ok: false, error: "Invalid path" }, { status: 400 });
  }

  const target = path.join(GALLERY_DIR, base);
  if (!target.startsWith(GALLERY_DIR + path.sep)) {
    return Response.json({ ok: false, error: "Invalid path" }, { status: 400 });
  }

  await fs.unlink(target).catch(() => {});
  return Response.json({ ok: true });
}
