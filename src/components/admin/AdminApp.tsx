"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  BookItem,
  GalleryPhoto,
  LinkItem,
  Message,
  NewsItem,
  Profile,
  ReelItem,
  VideoItem,
} from "@/lib/types";
import { PlatformIcon, platformColors, platformIcons } from "../icons";
import { Btn, Field, Modal, Row, VideoUpload, move, uid } from "./ui";

const SECTIONS = [
  "Profile",
  "Links",
  "Videos",
  "Reels",
  "News",
  "Books",
  "Gallery",
  "Inbox",
] as const;
type Section = (typeof SECTIONS)[number];

type Loaded = {
  profile: Profile;
  links: LinkItem[];
  videos: VideoItem[];
  reels: ReelItem[];
  news: NewsItem[];
  books: BookItem[];
  gallery: GalleryPhoto[];
  messages: Message[];
};

async function getJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? null) as T | null;
}

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [section, setSection] = useState<Section>("Profile");
  const [data, setData] = useState<Loaded | null>(null);
  const [toast, setToast] = useState("");

  const flash = useCallback((text: string) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const loadAll = useCallback(async () => {
    const [profile, links, videos, reels, news, books, gallery, messages] =
      await Promise.all([
        getJson<Profile>("/api/profile"),
        getJson<LinkItem[]>("/api/links"),
        getJson<VideoItem[]>("/api/videos"),
        getJson<ReelItem[]>("/api/reels"),
        getJson<NewsItem[]>("/api/news"),
        getJson<BookItem[]>("/api/books"),
        getJson<GalleryPhoto[]>("/api/gallery"),
        getJson<Message[]>("/api/contact"),
      ]);

    if (!profile) return;
    setData({
      profile,
      links: links ?? [],
      videos: videos ?? [],
      reels: reels ?? [],
      news: news ?? [],
      books: books ?? [],
      gallery: gallery ?? [],
      messages: messages ?? [],
    });
  }, []);

  // Resolve the session on mount, and pull the content in the same pass so
  // there's no second render just to kick off the load.
  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then(async (j) => {
        const ok = Boolean(j.authed);
        setAuthed(ok);
        if (ok) await loadAll();
      })
      .catch(() => setAuthed(false));
  }, [loadAll]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (json.ok) {
      setAuthed(true);
      setPassword("");
      await loadAll();
    } else {
      setLoginError(json.error || "Login failed");
    }
  }

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthed(false);
    setData(null);
  }

  async function save(url: string, body: unknown, label: string) {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({ ok: false }));
    flash(json.ok ? `✓ ${label} সেভ হয়েছে` : `✕ ${json.error || "Save failed"}`);
  }

  if (authed === null) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <p className="text-[13px] text-muted">Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <form onSubmit={login} className="kp-card w-full space-y-3 p-4">
          <h1 className="text-[15px] font-bold text-ink">Admin Login</h1>
          <p className="text-[12px] text-muted">
            কন্টেন্ট এডিট করতে ইমেইল ও পাসওয়ার্ড দিন।
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            autoFocus
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-[13px] text-ink outline-none focus:border-brand"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-[13px] text-ink outline-none focus:border-brand"
          />
          {loginError && (
            <p className="text-[12px] text-[#d93025]">{loginError}</p>
          )}
          <Btn type="submit" tone="primary">
            Log in
          </Btn>
          <Link href="/" className="block pt-1 text-center text-[12px] text-brand">
            ← প্রোফাইলে ফিরে যান
          </Link>
        </form>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <p className="text-[13px] text-muted">Loading content…</p>
      </div>
    );
  }

  const set = <K extends keyof Loaded>(key: K, value: Loaded[K]) =>
    setData((d) => (d ? { ...d, [key]: value } : d));

  return (
    <div className="pb-16">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 pt-3">
          <h1 className="text-[16px] font-bold text-ink">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[12px] text-brand">
              View site
            </Link>
            <Btn onClick={logout}>Logout</Btn>
          </div>
        </div>
        {/* Wraps instead of scrolling: with eight tabs the last two used to sit
            off the right edge with nothing to hint they were there. */}
        <nav className="flex flex-wrap gap-2 px-4 pb-2.5 pt-2">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium ${
                section === s
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line bg-surface text-ink"
              }`}
            >
              {s}
              {s === "Inbox" && data.messages.length > 0
                ? ` (${data.messages.length})`
                : ""}
            </button>
          ))}
        </nav>
      </header>

      <Toast text={toast} />

      <div className="space-y-3 p-4">
        {section === "Profile" && (
          <ProfileEditor
            profile={data.profile}
            onChange={(p) => set("profile", p)}
            onSave={() => save("/api/profile", data.profile, "প্রোফাইল")}
          />
        )}
        {section === "Links" && (
          <LinksEditor
            links={data.links}
            onChange={(l) => set("links", l)}
            onSave={(next) => save("/api/links", next ?? data.links, "লিংক")}
          />
        )}
        {section === "Videos" && (
          <VideosEditor
            videos={data.videos}
            onChange={(v) => set("videos", v)}
            onSave={() => save("/api/videos", data.videos, "ভিডিও")}
            flash={flash}
          />
        )}
        {section === "Reels" && (
          <ReelsEditor
            reels={data.reels}
            onChange={(r) => set("reels", r)}
            onSave={() => save("/api/reels", data.reels, "রিলস")}
            flash={flash}
          />
        )}
        {section === "News" && (
          <NewsEditor
            news={data.news}
            onChange={(n) => set("news", n)}
            onSave={() => save("/api/news", data.news, "নিউজ")}
          />
        )}
        {section === "Books" && (
          <BooksEditor
            books={data.books}
            onChange={(b) => set("books", b)}
            onSave={() => save("/api/books", data.books, "বই")}
          />
        )}
        {section === "Gallery" && (
          <GalleryEditor
            gallery={data.gallery}
            onChange={(g) => set("gallery", g)}
            onSave={() => save("/api/gallery", data.gallery, "গ্যালারি")}
            reload={loadAll}
            flash={flash}
          />
        )}
        {section === "Inbox" && (
          <Inbox
            messages={data.messages}
            onChange={(m) => set("messages", m)}
            flash={flash}
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------- Profile -------------------------------- */

function ProfileEditor({
  profile,
  onChange,
  onSave,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onSave: () => void;
}) {
  const patch = (part: Partial<Profile>) => onChange({ ...profile, ...part });

  return (
    <div className="space-y-3">
      <div className="kp-card space-y-2.5 p-3">
        <Field label="Name" value={profile.name} onChange={(v) => patch({ name: v })} />
        <Field label="Name (Bangla)" value={profile.nameBn} onChange={(v) => patch({ nameBn: v })} />
        <Field label="Headline" value={profile.headline} onChange={(v) => patch({ headline: v })} />
        <Field label="Headline (Bangla)" value={profile.headlineBn} onChange={(v) => patch({ headlineBn: v })} />
        <Field label="Birth date (YYYY-MM-DD)" type="date" value={profile.birthDate} onChange={(v) => patch({ birthDate: v })} />
        <Field label="Birth place" value={profile.birthPlace} onChange={(v) => patch({ birthPlace: v })} placeholder="Bangladesh" />
        <p className="text-[11px] leading-relaxed text-muted">
          বয়সের কার্ড ও &ldquo;Born&rdquo; সারি এই তারিখ থেকে নিজে থেকেই হিসাব হয় —
          প্রতি বছর আলাদা করে বদলাতে হবে না।
        </p>
        <Field label="Location" value={profile.location} onChange={(v) => patch({ location: v })} />
        <Field label="Website" value={profile.website} onChange={(v) => patch({ website: v })} />
        <Field label="Avatar path" value={profile.avatar} onChange={(v) => patch({ avatar: v })} placeholder="/gallery/photo-47.jpg" />
        <label className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            checked={profile.verified}
            onChange={(e) => patch({ verified: e.target.checked })}
          />
          <span className="text-[12.5px] text-ink">Show verified badge</span>
        </label>
      </div>

      <div className="kp-card space-y-2.5 p-3">
        <Field label="Overview (English)" multiline rows={5} value={profile.overview} onChange={(v) => patch({ overview: v })} />
        <Field label="Overview (Bangla)" multiline rows={5} value={profile.overviewBn} onChange={(v) => patch({ overviewBn: v })} />
        <Field
          label="Hero images (one path per line)"
          multiline
          rows={4}
          value={profile.heroImages.join("\n")}
          onChange={(v) =>
            patch({ heroImages: v.split("\n").map((s) => s.trim()).filter(Boolean) })
          }
        />
        <Field
          label="SEO keywords (comma separated)"
          multiline
          rows={2}
          value={profile.seoKeywords.join(", ")}
          onChange={(v) =>
            patch({ seoKeywords: v.split(",").map((s) => s.trim()).filter(Boolean) })
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">Fact cards</p>
        {profile.facts.map((f, i) => (
          <Row
            key={f.id}
            title={f.label || `Fact ${i + 1}`}
            onRemove={() => patch({ facts: profile.facts.filter((x) => x.id !== f.id) })}
            onUp={i > 0 ? () => patch({ facts: move(profile.facts, i, i - 1) }) : undefined}
            onDown={i < profile.facts.length - 1 ? () => patch({ facts: move(profile.facts, i, i + 1) }) : undefined}
          >
            <Field label="Label" value={f.label} onChange={(v) => patch({ facts: profile.facts.map((x) => (x.id === f.id ? { ...x, label: v } : x)) })} />
            <Field label="Value" value={f.value} onChange={(v) => patch({ facts: profile.facts.map((x) => (x.id === f.id ? { ...x, value: v } : x)) })} />
            <Field label="Note (small orange line)" value={f.note ?? ""} onChange={(v) => patch({ facts: profile.facts.map((x) => (x.id === f.id ? { ...x, note: v } : x)) })} />
          </Row>
        ))}
        <Btn onClick={() => patch({ facts: [...profile.facts, { id: uid(), label: "", value: "", note: "" }] })}>
          + Fact যোগ করুন
        </Btn>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">About rows</p>
        {profile.about.map((a, i) => (
          <Row
            key={a.id}
            title={a.label || `Row ${i + 1}`}
            onRemove={() => patch({ about: profile.about.filter((x) => x.id !== a.id) })}
            onUp={i > 0 ? () => patch({ about: move(profile.about, i, i - 1) }) : undefined}
            onDown={i < profile.about.length - 1 ? () => patch({ about: move(profile.about, i, i + 1) }) : undefined}
          >
            <Field label="Label" value={a.label} onChange={(v) => patch({ about: profile.about.map((x) => (x.id === a.id ? { ...x, label: v } : x)) })} />
            <Field label="Value" value={a.value} onChange={(v) => patch({ about: profile.about.map((x) => (x.id === a.id ? { ...x, value: v } : x)) })} />
          </Row>
        ))}
        <Btn onClick={() => patch({ about: [...profile.about, { id: uid(), label: "", value: "" }] })}>
          + About row যোগ করুন
        </Btn>
      </div>

      <SaveBar onSave={onSave} />
    </div>
  );
}

/* --------------------------------- Links --------------------------------- */

// Driven off the icon registry so the dropdown can never offer a platform the
// grid has no icon for — or miss one it does. "twitter" is an alias of "x".
const PLATFORMS = Object.keys(platformIcons)
  .filter((p) => p !== "twitter")
  .sort();

function LinksEditor({
  links,
  onChange,
  onSave,
}: {
  links: LinkItem[];
  onChange: (l: LinkItem[]) => void;
  onSave: (next?: LinkItem[]) => void;
}) {
  // `null` means the dialog is shut. `isNew` decides append vs replace on submit.
  const [draft, setDraft] = useState<LinkItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [query, setQuery] = useState("");

  /** Reordering and deleting write straight through — no separate save step. */
  const commit = (next: LinkItem[]) => {
    onChange(next);
    onSave(next);
  };

  const openNew = () => {
    setDraft({ id: uid(), platform: "web", label: "", url: "", featured: false });
    setIsNew(true);
  };

  const submit = () => {
    if (!draft) return;
    const clean = { ...draft, label: draft.label.trim(), url: draft.url.trim() };
    commit(
      isNew
        ? [...links, clean]
        : links.map((l) => (l.id === clean.id ? clean : l)),
    );
    setDraft(null);
  };

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? links.filter((l) =>
        `${l.label} ${l.platform} ${l.url}`.toLowerCase().includes(needle),
      )
    : links;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-ink">
          লিংক <span className="font-normal text-muted">({links.length})</span>
        </p>
        <Btn tone="primary" onClick={openNew}>
          + Add new
        </Btn>
      </div>

      {links.length > 8 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="খুঁজুন — নাম, প্ল্যাটফর্ম বা URL"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand"
        />
      )}

      <div className="space-y-1.5">
        {shown.map((l) => {
          // Arrows act on the real position, so search never scrambles order.
          const i = links.indexOf(l);
          return (
            <div key={l.id} className="kp-card flex items-center gap-2.5 p-2.5">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
                style={{ background: platformColors[l.platform] ?? "#1a73e8" }}
              >
                <PlatformIcon platform={l.platform} size={17} />
              </span>

              <button
                type="button"
                onClick={() => {
                  setDraft({ ...l });
                  setIsNew(false);
                }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="flex items-center gap-1.5 truncate text-[12.5px] font-semibold text-ink">
                  {l.label || l.platform}
                  {l.featured && (
                    <span className="shrink-0 rounded-full bg-brand-soft px-1.5 py-px text-[9px] font-bold uppercase text-brand">
                      Top
                    </span>
                  )}
                </p>
                <p className="truncate text-[11px] text-muted">{l.url}</p>
              </button>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => commit(move(links, i, i - 1))}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="grid h-7 w-7 place-items-center rounded-full border border-line text-[12px] text-muted disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => commit(move(links, i, i + 1))}
                  disabled={i === links.length - 1}
                  aria-label="Move down"
                  className="grid h-7 w-7 place-items-center rounded-full border border-line text-[12px] text-muted disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`"${l.label || l.platform}" মুছে ফেলবেন?`)) {
                      commit(links.filter((x) => x.id !== l.id));
                    }
                  }}
                  aria-label="Remove"
                  className="grid h-7 w-7 place-items-center rounded-full border border-[#d93025] text-[12px] text-[#d93025]"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {shown.length === 0 && (
          <p className="py-6 text-center text-[12.5px] text-muted">
            {links.length === 0 ? "কোনো লিংক নেই।" : "কিছু পাওয়া যায়নি।"}
          </p>
        )}
      </div>

      {draft && (
        <Modal
          title={isNew ? "নতুন লিংক" : "লিংক এডিট"}
          onClose={() => setDraft(null)}
          footer={
            <>
              <Btn tone="primary" onClick={submit} disabled={!draft.url.trim()}>
                {isNew ? "যোগ করুন" : "আপডেট করুন"}
              </Btn>
              <Btn onClick={() => setDraft(null)}>বাতিল</Btn>
            </>
          }
        >
          <div className="flex items-center gap-2.5 pb-1">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white"
              style={{ background: platformColors[draft.platform] ?? "#1a73e8" }}
            >
              <PlatformIcon platform={draft.platform} size={20} />
            </span>
            <p className="text-[11.5px] text-muted">
              গ্রিডে এই আইকনটাই দেখাবে।
            </p>
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted">
              Platform
            </span>
            <select
              value={draft.platform}
              onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <Field
            label="Label"
            value={draft.label}
            placeholder="যেমন — Facebook (2)"
            onChange={(v) => setDraft({ ...draft, label: v })}
          />
          <Field
            label="URL"
            value={draft.url}
            placeholder="https://…"
            onChange={(v) => setDraft({ ...draft, url: v })}
          />

          <label className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            <span className="text-[12.5px] text-ink">গ্রিডে আগে দেখাবে</span>
          </label>
        </Modal>
      )}
    </div>
  );
}

/* --------------------------------- Videos --------------------------------- */

function VideosEditor({
  videos,
  onChange,
  onSave,
  flash,
}: {
  videos: VideoItem[];
  onChange: (v: VideoItem[]) => void;
  onSave: () => void;
  flash: (text: string) => void;
}) {
  const patch = (id: string, part: Partial<VideoItem>) =>
    onChange(videos.map((v) => (v.id === id ? { ...v, ...part } : v)));

  return (
    <div className="space-y-2">
      <p className="text-[11.5px] leading-relaxed text-muted">
        YouTube ভিডিওর জন্য শুধু ভিডিও আইডি দিন (youtu.be/<b>XXXXXXXX</b>)। নিজের
        ফাইল হলে নিচের বাটন দিয়ে আপলোড করুন — ভিডিও তার নিজের মাপেই দেখাবে,
        কোনো দিক কাটা যাবে না।
      </p>
      {videos.map((v, i) => (
        <Row
          key={v.id}
          title={v.title || `Video ${i + 1}`}
          onRemove={() => onChange(videos.filter((x) => x.id !== v.id))}
          onUp={i > 0 ? () => onChange(move(videos, i, i - 1)) : undefined}
          onDown={i < videos.length - 1 ? () => onChange(move(videos, i, i + 1)) : undefined}
        >
          <Field label="Title" value={v.title} onChange={(t) => patch(v.id, { title: t })} />
          <Field label="YouTube video id" value={v.youtubeId} onChange={(t) => patch(v.id, { youtubeId: t })} placeholder="dQw4w9WgXcQ" />
          <Field label="Or file path" value={v.file} onChange={(t) => patch(v.id, { file: t })} placeholder="/media/intro.mp4" />
          <VideoUpload onUploaded={(src) => patch(v.id, { file: src, youtubeId: "" })} flash={flash} />
          <Field label="Poster image" value={v.poster} onChange={(t) => patch(v.id, { poster: t })} placeholder="/gallery/photo-19.jpg" />
          <Field label="Date" value={v.date} onChange={(t) => patch(v.id, { date: t })} placeholder="2026-07-30" />
        </Row>
      ))}
      <Btn onClick={() => onChange([...videos, { id: uid(), title: "", youtubeId: "", file: "", poster: "", date: "" }])}>
        + ভিডিও যোগ করুন
      </Btn>
      <SaveBar onSave={onSave} />
    </div>
  );
}

/* ---------------------------------- Reels ---------------------------------- */

function ReelsEditor({
  reels,
  onChange,
  onSave,
  flash,
}: {
  reels: ReelItem[];
  onChange: (r: ReelItem[]) => void;
  onSave: () => void;
  flash: (text: string) => void;
}) {
  const patch = (id: string, part: Partial<ReelItem>) =>
    onChange(reels.map((r) => (r.id === id ? { ...r, ...part } : r)));

  return (
    <div className="space-y-2">
      <p className="text-[11.5px] leading-relaxed text-muted">
        ওয়েবসাইটেই মডালে চালাতে হলে দুটো উপায় — ভিডিও ফাইল আপলোড করুন,
        অথবা <b>একক ভিডিওর</b> লিংক দিন (যেমন{" "}
        <code>tiktok.com/@user/video/123…</code>,{" "}
        <code>instagram.com/reel/ABC…</code>, YouTube Shorts)। প্রোফাইল লিংক
        (<code>tiktok.com/@user</code>) দিলে TikTok/Instagram embed করতে দেয় না,
        তাই সেটা অ্যাপে খুলবে।
      </p>
      {reels.map((r, i) => (
        <Row
          key={r.id}
          title={r.title || `Reel ${i + 1}`}
          onRemove={() => onChange(reels.filter((x) => x.id !== r.id))}
          onUp={i > 0 ? () => onChange(move(reels, i, i - 1)) : undefined}
          onDown={i < reels.length - 1 ? () => onChange(move(reels, i, i + 1)) : undefined}
        >
          <Field label="Title" value={r.title} onChange={(v) => patch(r.id, { title: v })} />
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted">Platform</span>
            <select
              value={r.platform}
              onChange={(e) => patch(r.id, { platform: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <Field label="URL" value={r.url} onChange={(v) => patch(r.id, { url: v })} />
          <Field label="Thumbnail" value={r.thumb} onChange={(v) => patch(r.id, { thumb: v })} placeholder="/gallery/photo-05.jpg" />
          <Field label="Or local file" value={r.file} onChange={(v) => patch(r.id, { file: v })} placeholder="/media/reel.mp4" />
          <VideoUpload onUploaded={(src) => patch(r.id, { file: src })} flash={flash} />
        </Row>
      ))}
      <Btn onClick={() => onChange([...reels, { id: uid(), title: "", platform: "tiktok", url: "", thumb: "", file: "" }])}>
        + রিল যোগ করুন
      </Btn>
      <SaveBar onSave={onSave} />
    </div>
  );
}

/* ----------------------------------- News ----------------------------------- */

function NewsEditor({
  news,
  onChange,
  onSave,
}: {
  news: NewsItem[];
  onChange: (n: NewsItem[]) => void;
  onSave: () => void;
}) {
  const patch = (id: string, part: Partial<NewsItem>) =>
    onChange(news.map((n) => (n.id === id ? { ...n, ...part } : n)));

  return (
    <div className="space-y-2">
      {news.map((n, i) => (
        <Row
          key={n.id}
          title={n.title || `News ${i + 1}`}
          onRemove={() => onChange(news.filter((x) => x.id !== n.id))}
          onUp={i > 0 ? () => onChange(move(news, i, i - 1)) : undefined}
          onDown={i < news.length - 1 ? () => onChange(move(news, i, i + 1)) : undefined}
        >
          <Field label="Title" multiline rows={2} value={n.title} onChange={(v) => patch(n.id, { title: v })} />
          <Field label="Source" value={n.source} onChange={(v) => patch(n.id, { source: v })} />
          <Field label="Date" value={n.date} onChange={(v) => patch(n.id, { date: v })} placeholder="2026-04-30" />
          <Field label="URL" value={n.url} onChange={(v) => patch(n.id, { url: v })} />
          <Field label="Image" value={n.image} onChange={(v) => patch(n.id, { image: v })} placeholder="/gallery/photo-47.jpg" />
          <Field label="Excerpt" multiline rows={3} value={n.excerpt} onChange={(v) => patch(n.id, { excerpt: v })} />
        </Row>
      ))}
      <Btn onClick={() => onChange([...news, { id: uid(), title: "", source: "", date: "", url: "", image: "", excerpt: "" }])}>
        + নিউজ যোগ করুন
      </Btn>
      <SaveBar onSave={onSave} />
    </div>
  );
}

/* ---------------------------------- Books ---------------------------------- */

function BooksEditor({
  books,
  onChange,
  onSave,
}: {
  books: BookItem[];
  onChange: (b: BookItem[]) => void;
  onSave: () => void;
}) {
  const patch = (id: string, part: Partial<BookItem>) =>
    onChange(books.map((b) => (b.id === id ? { ...b, ...part } : b)));

  return (
    <div className="space-y-2">
      <p className="text-[11.5px] leading-relaxed text-muted">
        প্রকাশিত বই ও গাইড। কভার না দিলে বইয়ের নামের আদ্যক্ষর দিয়ে
        প্লেসহোল্ডার দেখাবে।
      </p>
      {books.map((b, i) => (
        <Row
          key={b.id}
          title={b.title || `Book ${i + 1}`}
          onRemove={() => onChange(books.filter((x) => x.id !== b.id))}
          onUp={i > 0 ? () => onChange(move(books, i, i - 1)) : undefined}
          onDown={i < books.length - 1 ? () => onChange(move(books, i, i + 1)) : undefined}
        >
          <Field label="Title" multiline rows={2} value={b.title} onChange={(v) => patch(b.id, { title: v })} />
          <Field label="Subtitle / type" value={b.subtitle} onChange={(v) => patch(b.id, { subtitle: v })} placeholder="Novel · Safety guide" />
          <Field label="Year" value={b.year} onChange={(v) => patch(b.id, { year: v })} placeholder="2026" />
          <Field label="Publisher" value={b.publisher} onChange={(v) => patch(b.id, { publisher: v })} placeholder="Google Books" />
          <Field label="URL" value={b.url} onChange={(v) => patch(b.id, { url: v })} />
          <Field label="Cover image" value={b.cover} onChange={(v) => patch(b.id, { cover: v })} placeholder="/gallery/photo-47.jpg" />
          <Field label="Description" multiline rows={3} value={b.description} onChange={(v) => patch(b.id, { description: v })} />
        </Row>
      ))}
      <Btn onClick={() => onChange([...books, { id: uid(), title: "", subtitle: "", year: "", publisher: "", url: "", cover: "", description: "" }])}>
        + বই যোগ করুন
      </Btn>
      <SaveBar onSave={onSave} />
    </div>
  );
}

/* --------------------------------- Gallery --------------------------------- */

function GalleryEditor({
  gallery,
  onChange,
  onSave,
  reload,
  flash,
}: {
  gallery: GalleryPhoto[];
  onChange: (g: GalleryPhoto[]) => void;
  onSave: () => void;
  reload: () => Promise<void>;
  flash: (t: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({ ok: false }));
    setBusy(false);

    if (!json.ok) {
      flash(`✕ ${json.error || "Upload failed"}`);
      return;
    }
    flash(`✓ ${json.saved.length}টি ছবি আপলোড হয়েছে`);
    if (fileRef.current) fileRef.current.value = "";
    await reload();
  }

  async function removePhoto(photo: GalleryPhoto) {
    if (!confirm(`ছবিটি স্থায়ীভাবে মুছে ফেলবেন?\n${photo.src}`)) return;
    setBusy(true);
    await fetch(`/api/upload?src=${encodeURIComponent(photo.src)}`, {
      method: "DELETE",
    });
    setBusy(false);
    flash("✓ ছবি মুছে ফেলা হয়েছে");
    await reload();
  }

  return (
    <div className="space-y-3">
      <div className="kp-card space-y-2 p-3">
        <p className="text-[12px] font-semibold text-ink">নতুন ছবি আপলোড</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => upload(e.target.files)}
          disabled={busy}
          className="w-full text-[12px] text-muted"
        />
        <p className="text-[11px] text-muted">
          সর্বোচ্চ ৮MB প্রতি ছবি। আপলোড করা ছবি সরাসরি গ্যালারিতে যোগ হবে।
        </p>
      </div>

      {gallery.map((p, i) => (
        <div key={p.id} className="kp-card flex gap-3 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="truncate text-[11px] text-muted">{p.src}</p>
            <input
              value={p.caption}
              placeholder="Caption"
              onChange={(e) =>
                onChange(
                  gallery.map((x) =>
                    x.id === p.id ? { ...x, caption: e.target.value } : x,
                  ),
                )
              }
              className="w-full rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-ink outline-none focus:border-brand"
            />
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-[11.5px] text-ink">
                <input
                  type="checkbox"
                  checked={p.hidden}
                  onChange={(e) =>
                    onChange(
                      gallery.map((x) =>
                        x.id === p.id ? { ...x, hidden: e.target.checked } : x,
                      ),
                    )
                  }
                />
                লুকান
              </label>
              {i > 0 && (
                <button type="button" onClick={() => onChange(move(gallery, i, i - 1))} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">↑</button>
              )}
              {i < gallery.length - 1 && (
                <button type="button" onClick={() => onChange(move(gallery, i, i + 1))} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">↓</button>
              )}
              <button
                type="button"
                onClick={() => removePhoto(p)}
                disabled={busy}
                className="rounded-full border border-[#d93025] px-2 py-0.5 text-[11px] text-[#d93025]"
              >
                ডিলিট
              </button>
            </div>
          </div>
        </div>
      ))}

      <SaveBar onSave={onSave} />
    </div>
  );
}

/* ---------------------------------- Inbox ---------------------------------- */

function Inbox({
  messages,
  onChange,
  flash,
}: {
  messages: Message[];
  onChange: (m: Message[]) => void;
  flash: (t: string) => void;
}) {
  async function remove(id?: string) {
    const url = id ? `/api/contact?id=${encodeURIComponent(id)}` : "/api/contact";
    if (!id && !confirm("সব বার্তা মুছে ফেলবেন?")) return;
    const res = await fetch(url, { method: "DELETE" });
    const json = await res.json().catch(() => ({ ok: false }));
    if (json.ok) {
      onChange(json.data ?? []);
      flash("✓ মুছে ফেলা হয়েছে");
    }
  }

  if (messages.length === 0) {
    return (
      <div className="kp-card px-4 py-10 text-center">
        <p className="text-[13px] text-muted">কোনো বার্তা নেই · No messages</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Btn tone="danger" onClick={() => remove()}>
          সব মুছুন
        </Btn>
      </div>
      {messages.map((m) => (
        <div key={m.id} className="kp-card space-y-1 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold text-ink">{m.name}</p>
            <button
              type="button"
              onClick={() => remove(m.id)}
              className="shrink-0 text-[11px] text-[#d93025]"
            >
              ✕
            </button>
          </div>
          {m.email && (
            <a href={`mailto:${m.email}`} className="block text-[11.5px] text-brand">
              {m.email}
            </a>
          )}
          <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink">
            {m.body}
          </p>
          <p className="text-[10.5px] text-muted">
            {new Date(m.createdAt).toLocaleString("en-GB")}
          </p>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- Save bar --------------------------------- */

/**
 * Floating confirmation for saves and uploads. `flash()` prefixes its text with
 * ✓ or ✕, which is all the tone we need — anything else reads as "in progress".
 */
function Toast({ text }: { text: string }) {
  if (!text) return null;

  const ok = text.startsWith("✓");
  const failed = text.startsWith("✕");
  const body = ok || failed ? text.slice(1).trim() : text;

  // bottom-24 clears the sticky save bar, which sits ~58px off the floor.
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6"
    >
      <div className="kp-toast flex max-w-[92%] items-center gap-2.5 rounded-full border border-line bg-surface py-2.5 pl-2.5 pr-4 shadow-lg">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white ${
            failed ? "bg-[#d93025]" : ok ? "bg-accent" : "bg-brand"
          }`}
        >
          {failed ? "✕" : ok ? "✓" : "…"}
        </span>
        <p className="truncate text-[13px] font-semibold text-ink">{body}</p>
      </div>
    </div>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="sticky bottom-3 z-20 pt-2">
      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-full bg-brand py-3 text-[13px] font-semibold text-white shadow-lg active:opacity-80"
      >
        সেভ করুন · Save changes
      </button>
    </div>
  );
}
