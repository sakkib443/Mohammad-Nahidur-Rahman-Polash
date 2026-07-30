import crypto from "node:crypto";
import { isAuthed, unauthorized } from "@/lib/auth";
import { getMessages, saveMessages } from "@/lib/store";
import type { Message } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Naive per-IP throttle — enough to stop a bot hammering a personal site. */
const lastSeen = new Map<string, number>();
const WINDOW_MS = 30_000;

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  const messages = await getMessages();
  return Response.json(
    { ok: true, data: messages },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  // Honeypot: real people never fill a hidden field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const ip = clientIp(request);
  const now = Date.now();
  const previous = lastSeen.get(ip) ?? 0;
  if (now - previous < WINDOW_MS) {
    return Response.json(
      { ok: false, error: "Please wait a moment before sending again." },
      { status: 429 },
    );
  }

  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().slice(0, 120);
  const text = String(body.body ?? "").trim().slice(0, 2000);

  if (!name || !text) {
    return Response.json(
      { ok: false, error: "Name and message are required." },
      { status: 400 },
    );
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  lastSeen.set(ip, now);

  const message: Message = {
    id: crypto.randomUUID(),
    name,
    email,
    body: text,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const messages = await getMessages();
  // Keep the newest 500 so the JSON file can't grow without bound.
  await saveMessages([message, ...messages].slice(0, 500));

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const messages = await getMessages();

  const next = id ? messages.filter((m) => m.id !== id) : [];
  await saveMessages(next);
  return Response.json({ ok: true, data: next });
}
