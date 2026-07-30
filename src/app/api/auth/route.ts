import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  checkPassword,
  createToken,
  isAuthed,
  sessionCookieOptions,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: true, authed: await isAuthed() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (body?.action === "logout") {
    const jar = await cookies();
    jar.delete(SESSION_COOKIE);
    return Response.json({ ok: true, authed: false });
  }

  if (!checkPassword(body?.password)) {
    return Response.json(
      { ok: false, error: "ভুল পাসওয়ার্ড / Wrong password" },
      { status: 401 },
    );
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createToken(), sessionCookieOptions);
  return Response.json({ ok: true, authed: true });
}
