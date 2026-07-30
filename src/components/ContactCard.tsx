"use client";

import { useState } from "react";
import { MailIcon } from "./icons";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactCard() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          body: data.get("body"),
          company: data.get("company"),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error || "Could not send your message.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="px-4 pb-2 pt-5">
      <h2 className="pb-2 text-[13px] font-semibold text-ink">Contact</h2>

      <form onSubmit={onSubmit} className="kp-card space-y-2.5 p-3">
        {/* Honeypot — hidden from people, irresistible to bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <input
          name="name"
          required
          maxLength={80}
          placeholder="Your name"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand"
        />
        <input
          name="email"
          type="email"
          maxLength={120}
          placeholder="Email (optional)"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand"
        />
        <textarea
          name="body"
          required
          rows={4}
          maxLength={2000}
          placeholder="Your message"
          className="w-full resize-none rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          <MailIcon width={16} height={16} />
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "sent" && (
          <p className="text-center text-[12px] font-medium text-accent">
            ✓ Message sent
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-[12px] font-medium text-[#d93025]">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
