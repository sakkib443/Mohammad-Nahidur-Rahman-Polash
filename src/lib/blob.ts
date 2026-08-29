import "server-only";
import { del, list, put } from "@vercel/blob";

/**
 * Vercel's filesystem is read-only, so anything the admin panel saves has to go
 * to Blob storage instead. Locally there is no token and everything falls back
 * to the `data/` and `public/` folders, which is what `blobEnabled()` gates.
 *
 * Vercel injects BLOB_READ_WRITE_TOKEN once a Blob store is linked to the
 * project — see the deployment notes in README.md.
 */
export function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Blob URLs carry a store id we can't guess, so the pathname has to be looked
 * up. One `list` per read is fine here: reads are rare and the payloads tiny.
 */
async function urlFor(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname, limit: 100 });
  const hit = blobs.find((b) => b.pathname === pathname);
  return hit?.url ?? null;
}

export async function readBlobJson<T>(pathname: string): Promise<T | null> {
  const url = await urlFor(pathname);
  if (!url) return null;

  // `no-store`: Blob URLs are CDN-cached, and a stale read here would silently
  // undo whatever the admin just saved.
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function writeBlobJson(
  pathname: string,
  value: unknown,
): Promise<void> {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Returns the public URL the uploaded file is served from. */
export async function putBlobFile(
  pathname: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const { url } = await put(pathname, body, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return url;
}

export async function deleteBlobFile(url: string): Promise<void> {
  await del(url);
}
