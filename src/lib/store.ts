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
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // First boot (or a corrupted file): seed it and carry on.
    await writeJson(file, fallback);
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
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
  const byId = new Map(meta.map((m) => [m.id, m]));

  let files: string[] = [];
  try {
    files = await fs.readdir(GALLERY_DIR);
  } catch {
    files = [];
  }

  const photos = files
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map<GalleryPhoto>((f) => {
      const id = f.replace(/\.[^.]+$/, "");
      const existing = byId.get(id);
      return {
        id,
        src: `/gallery/${f}`,
        caption: existing?.caption ?? "",
        hidden: existing?.hidden ?? false,
      };
    });

  // Keep the admin-defined order for known ids, append brand-new files at the end.
  const order = new Map(meta.map((m, i) => [m.id, i]));
  photos.sort((a, b) => {
    const ai = order.has(a.id) ? order.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const bi = order.has(b.id) ? order.get(b.id)! : Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return a.id.localeCompare(b.id, "en", { numeric: true });
  });

  return photos;
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
