"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon, WhatsappIcon } from "./icons";

/** wa.me wants bare digits. Local 0-prefixed numbers get Bangladesh's 880. */
function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^00/, "");
  return digits.startsWith("0") ? `880${digits.slice(1)}` : digits;
}

export default function FloatingActions({ phone }: { phone: string }) {
  const [showTop, setShowTop] = useState(false);

  // Back-to-top only earns its space once there's something to go back up to.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = waNumber(phone);

  if (!wa && !showTop) return null;

  return (
    // Pinned to the shell's right edge, not the viewport's, so the buttons stay
    // beside the phone-width column on a desktop monitor.
    <div className="pointer-events-none fixed inset-0 z-40 mx-auto max-w-[440px]">
      {/* Back-to-top sits above WhatsApp: it keeps its slot while hidden, so
          WhatsApp stays put in the corner instead of sliding down. */}
      <div className="pointer-events-auto absolute bottom-4 right-4 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const reduce = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          }}
          aria-label="Back to top"
          aria-hidden={!showTop}
          tabIndex={showTop ? 0 : -1}
          className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink shadow-panel transition-all active:scale-90 ${
            showTop
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }`}
        >
          <ArrowUpIcon width={18} height={18} />
        </button>

        {wa ? (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white shadow-panel transition-transform active:scale-90"
          >
            <WhatsappIcon width={19} height={19} />
          </a>
        ) : null}
      </div>
    </div>
  );
}
