/**
 * Works out whether a reel can play inside the site or has to open on the
 * platform. Only individual-post URLs are embeddable — a profile link like
 * `tiktok.com/@user` has no embed form, so it stays external.
 */

export type ReelSource =
  | { kind: "file"; src: string }
  | { kind: "iframe"; src: string; platform: string }
  | { kind: "external"; src: string };

const patterns: {
  platform: string;
  test: RegExp;
  embed: (m: RegExpMatchArray) => string;
}[] = [
  {
    platform: "tiktok",
    test: /tiktok\.com\/(?:@[^/]+\/)?video\/(\d+)/i,
    embed: (m) => `https://www.tiktok.com/embed/v2/${m[1]}`,
  },
  {
    platform: "instagram",
    test: /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i,
    embed: (m) => `https://www.instagram.com/p/${m[1]}/embed`,
  },
  {
    platform: "youtube",
    test: /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]{6,})/i,
    embed: (m) => `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`,
  },
];

export function resolveReelSource(reel: {
  file: string;
  url: string;
}): ReelSource {
  const file = reel.file.trim();
  if (file) return { kind: "file", src: file };

  const url = reel.url.trim();
  if (!url) return { kind: "external", src: "" };

  for (const p of patterns) {
    const match = url.match(p.test);
    if (match) return { kind: "iframe", src: p.embed(match), platform: p.platform };
  }

  return { kind: "external", src: url };
}

export const isPlayableInApp = (reel: { file: string; url: string }) =>
  resolveReelSource(reel).kind !== "external";
