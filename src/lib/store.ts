import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type {
  BookItem,
  Content,
  GalleryPhoto,
  LinkItem,
  Message,
  NewsItem,
  Profile,
  ReelItem,
  Stats,
  VideoItem,
} from "./types";
import { blobEnabled, readBlobJson, writeBlobJson } from "./blob";
import {
  seedBooks,
  seedLinks,
  seedNews,
  seedProfile,
  seedReels,
  seedVideos,
} from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

/** Serialises writes so two concurrent admin saves can't interleave. */
let writeChain: Promise<unknown> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  // On Vercel the deployed `data/` folder is the build-time snapshot, so Blob
  // wins when it has the file and the bundled copy seeds the very first read.
  if (blobEnabled()) {
    try {
      const stored = await readBlobJson<T>(`data/${file}`);
      if (stored !== null) return stored;
    } catch {
      /* fall through to the bundled copy rather than blanking the site */
    }
  }

  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // First boot (or a corrupted file): seed it and carry on.
    await writeJson(file, fallback).catch(() => {});
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  if (blobEnabled()) {
    await writeBlobJson(`data/${file}`, value);
    return;
  }

  const run = async () => {
    await ensureDir();
    const target = path.join(DATA_DIR, file);
    const tmp = `${target}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await fs.rename(tmp, target);
  };
  writeChain = writeChain.then(run, run);
  await writeChain;
}

export const getProfile = () => readJson<Profile>("profile.json", seedProfile);
export const saveProfile = (p: Profile) => writeJson("profile.json", p);

export const getLinks = () => readJson<LinkItem[]>("links.json", seedLinks);
export const saveLinks = (l: LinkItem[]) => writeJson("links.json", l);

export const getVideos = () => readJson<VideoItem[]>("videos.json", seedVideos);
export const saveVideos = (v: VideoItem[]) => writeJson("videos.json", v);

export const getReels = () => readJson<ReelItem[]>("reels.json", seedReels);
export const saveReels = (r: ReelItem[]) => writeJson("reels.json", r);

export const getNews = () => readJson<NewsItem[]>("news.json", seedNews);
export const saveNews = (n: NewsItem[]) => writeJson("news.json", n);

export const getBooks = () => readJson<BookItem[]>("books.json", seedBooks);
export const saveBooks = (b: BookItem[]) => writeJson("books.json", b);

export const getMessages = () => readJson<Message[]>("messages.json", []);
export const saveMessages = (m: Message[]) => writeJson("messages.json", m);

/**
 * The gallery is filesystem-driven: drop a photo into `public/gallery` and it
 * shows up. `gallery.json` only stores the human-authored bits (caption,
 * order, hidden) so new files never need a manual entry.
 */
export async function getGallery(): Promise<GalleryPhoto[]> {
  const meta = await readJson<GalleryPhoto[]>("gallery.json", []);

  // Blob storage has no folder to walk, and uploads register themselves in
  // gallery.json, so the stored list is the whole truth there.
  if (blobEnabled()) return meta;

  // Locally the folder still drives things: drop a photo into public/gallery
  // and it shows up without touching the admin panel.
  let files: string[] = [];
  try {
    files = await fs.readdir(GALLERY_DIR);
  } catch {
    files = [];
  }

  const known = new Set(meta.map((m) => m.src));
  const extras = files
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .map<GalleryPhoto>((f) => ({
      id: f.replace(/\.[^.]+$/, ""),
      src: `/gallery/${f}`,
      caption: "",
      hidden: false,
    }))
    .filter((p) => !known.has(p.src))
    .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));

  // Anything the admin has ordered keeps its place; new files land at the end.
  return [...meta, ...extras];
}

/** Appends freshly uploaded images, skipping any already listed. */
export async function addGalleryPhotos(srcs: string[]): Promise<void> {
  if (srcs.length === 0) return;
  const current = await readJson<GalleryPhoto[]>("gallery.json", []);
  const known = new Set(current.map((p) => p.src));

  const added = srcs
    .filter((src) => !known.has(src))
    .map<GalleryPhoto>((src) => ({
      id: (src.split("/").pop() ?? src).replace(/\.[^.]+$/, ""),
      src,
      caption: "",
      hidden: false,
    }));

  if (added.length > 0) await writeJson("gallery.json", [...current, ...added]);
}

export async function removeGalleryPhoto(src: string): Promise<void> {
  const current = await readJson<GalleryPhoto[]>("gallery.json", []);
  const next = current.filter((p) => p.src !== src);
  if (next.length !== current.length) await writeJson("gallery.json", next);
}

export const saveGallery = (g: GalleryPhoto[]) => writeJson("gallery.json", g);

export async function getStats(): Promise<Stats> {
  return readJson<Stats>("stats.json", {
    views: 0,
    updatedAt: new Date(0).toISOString(),
  });
}

export async function bumpViews(): Promise<Stats> {
  const current = await getStats();
  const next: Stats = {
    views: current.views + 1,
    updatedAt: new Date().toISOString(),
  };
  await writeJson("stats.json", next);
  return next;
}

/** Everything the public page needs, in one read. */
export async function getContent(): Promise<Content> {
  const [profile, links, videos, reels, news, books, gallery] =
    await Promise.all([
      getProfile(),
      getLinks(),
      getVideos(),
      getReels(),
      getNews(),
      getBooks(),
      getGallery(),
    ]);
  return {
    profile,
    links,
    videos,
    reels,
    news,
    books,
    gallery: gallery.filter((g) => !g.hidden),
  };
}
