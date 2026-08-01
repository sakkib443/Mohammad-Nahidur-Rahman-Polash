"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AboutRow, Content, Fact } from "@/lib/types";
import { AboutCard, FactGrid, OverviewCard } from "./Cards";
import BooksSection from "./BooksSection";
import ContactCard from "./ContactCard";
import FloatingActions from "./FloatingActions";
import Gallery from "./Gallery";
import GalleryPreview from "./GalleryPreview";
import HeroCarousel from "./HeroCarousel";
import Lightbox from "./Lightbox";
import LinksSection from "./LinksSection";
import NewsTab from "./NewsTab";
import ReelsTab from "./ReelsTab";
import ThemeToggle from "./ThemeToggle";
import VideoTab from "./VideoTab";
import { EyeIcon, ShareIcon, VerifiedIcon } from "./icons";

const TABS = ["Overview", "Images", "Videos", "Reels", "News"] as const;
type Tab = (typeof TABS)[number];

export default function ProfileApp({
  content,
  age,
  bornLabel,
  bornYear,
}: {
  content: Content;
  /** Derived on the server from `profile.birthDate` — see src/lib/derive.ts. */
  age: number | null;
  bornLabel: string;
  bornYear: string;
}) {
  const { profile, links, videos, reels, news, books, gallery } = content;

  const [tab, setTab] = useState<Tab>("Overview");
  const [hero, setHero] = useState<number | null>(null);
  const [views, setViews] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Deep-linkable tabs: /#video survives a refresh and a shared URL.
  useEffect(() => {
    const fromHash = () => {
      const raw = decodeURIComponent(window.location.hash.replace("#", ""));
      const match = TABS.find((t) => t.toLowerCase() === raw.toLowerCase());
      if (match) setTab(match);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // One view per browser session.
  useEffect(() => {
    let cancelled = false;
    const counted = sessionStorage.getItem("polash-counted") === "1";

    fetch("/api/stats", { method: counted ? "GET" : "POST" })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.ok) setViews(j.data.views);
        if (!counted) sessionStorage.setItem("polash-counted", "1");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const selectTab = useCallback((next: Tab) => {
    setTab(next);
    history.replaceState(null, "", `#${next.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function share() {
    const url = window.location.origin + window.location.pathname;
    const payload = {
      title: profile.name,
      text: `${profile.name} — ${profile.headline}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        /* user dismissed the sheet */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  const heroImages =
    profile.heroImages.length > 0
      ? profile.heroImages
      : gallery.slice(0, 5).map((g) => g.src);

  // The Age card and Born row come from birthDate, so the admin only ever
  // edits one field. An admin-authored row with the same label wins.
  const facts = useMemo<Fact[]>(() => {
    if (age === null) return profile.facts;
    const hasAge = profile.facts.some((f) => /^age$/i.test(f.label.trim()));
    if (hasAge) return profile.facts;
    return [
      { id: "auto-age", label: "Age", value: `${age} years`, note: bornYear },
      ...profile.facts,
    ];
  }, [age, bornYear, profile.facts]);

  const about = useMemo<AboutRow[]>(() => {
    const rows = [...profile.about];
    const hasLabel = (pattern: RegExp) =>
      rows.some((r) => pattern.test(r.label.trim()));

    if (bornLabel && !hasLabel(/^born$/i)) {
      const value = profile.birthPlace
        ? `${bornLabel}, ${profile.birthPlace}`
        : bornLabel;
      // Slot "Born" straight after the name rows, like a knowledge panel does.
      rows.splice(Math.min(2, rows.length), 0, {
        id: "auto-born",
        label: "Born",
        value,
      });
    }

    // The Bengali name and role no longer live in the header, so surface them
    // here. Labels stay English like every other row; only the values are Bangla.
    if (profile.nameBn && !hasLabel(/^name \(bangla\)$/i)) {
      rows.push({
        id: "auto-name-bn",
        label: "Name (Bangla)",
        value: profile.nameBn,
      });
    }
    if (profile.headlineBn && !hasLabel(/^role \(bangla\)$/i)) {
      rows.push({
        id: "auto-role-bn",
        label: "Role (Bangla)",
        value: profile.headlineBn,
      });
    }

    return rows;
  }, [bornLabel, profile.about, profile.birthPlace, profile.headlineBn, profile.nameBn]);

  const youtube = links.find((l) => l.platform === "youtube")?.url;

  return (
    <div className="pb-10">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="flex items-start gap-2 px-4 pt-3">
          <div className="min-w-0 flex-1">
            {/* Long names wrap to a second line rather than being clipped. */}
            <h1 className="text-[18px] font-bold leading-tight text-ink">
              {profile.name}
            </h1>
            {/* English role + badge only — the Bengali headline would push the
                sticky header to three lines and eat the viewport on a phone. */}
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-medium text-accent">
              <span>{profile.headline}</span>
              {profile.verified && (
                <span
                  className="inline-flex items-center gap-0.5 rounded-full bg-brand-soft px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand"
                  title="Verified profile"
                >
                  <VerifiedIcon width={11} height={11} />
                  Verified
                </span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={share}
              aria-label="Share this profile"
              className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 active:scale-95"
            >
              <ShareIcon />
            </button>
            <ThemeToggle />
          </div>
        </div>

        <nav
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2.5 pt-2"
          aria-label="Profile sections"
        >
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => selectTab(t)}
              aria-current={tab === t ? "page" : undefined}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                tab === t
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line bg-surface text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        {copied && (
          <p className="bg-accent/10 py-1 text-center text-[11px] font-medium text-accent">
            Link copied
          </p>
        )}
      </header>

      <main key={tab} className="kp-enter">
        {tab === "Overview" && (
          <>
            <HeroCarousel
              images={heroImages}
              alt={profile.name}
              onOpen={(src) => setHero(heroImages.indexOf(src))}
            />
            <FactGrid facts={facts} />
            <OverviewCard text={profile.overview} textBn={profile.overviewBn} />
            <AboutCard rows={about} />
            <BooksSection books={books} />
            <LinksSection links={links} />
            <GalleryPreview
              photos={gallery}
              name={profile.name}
              onSeeAll={() => selectTab("Images")}
            />
            <ContactCard />
          </>
        )}

        {tab === "Images" && <Gallery photos={gallery} name={profile.name} />}
        {tab === "Videos" && (
          <VideoTab videos={videos} channelUrl={youtube} />
        )}
        {tab === "Reels" && <ReelsTab reels={reels} />}
        {tab === "News" && <NewsTab news={news} />}
      </main>

      <footer className="mt-8 border-t border-line px-4 py-5 text-center">
        {views !== null && (
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <EyeIcon width={14} height={14} />
            {views.toLocaleString("en-US")} views
          </p>
        )}
        <p className="mt-2 text-[11px] text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        {profile.location ? (
          <p className="mt-0.5 text-[11px] text-muted">{profile.location}</p>
        ) : null}
      </footer>

      {/* Outside <main> on purpose: the .kp-enter animation puts a transform on
          it mid-run, which would re-anchor these fixed elements to its box. */}
      <FloatingActions phone={profile.phone} />

      {hero !== null && hero >= 0 && (
        <Lightbox
          images={heroImages}
          index={hero}
          onClose={() => setHero(null)}
        />
      )}
    </div>
  );
}
