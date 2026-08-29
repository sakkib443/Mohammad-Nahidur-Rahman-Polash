import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  checkCredentials,
  checkPassword,
  createToken,
  isAuthed,
  passwordProblem,
  sessionCookieOptions,
  setPassword,
  usingStoredPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    authed: await isAuthed(),
    storedPassword: await usingStoredPassword(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const jar = await cookies();

  if (body?.action === "logout") {
    jar.delete(SESSION_COOKIE);
    return Response.json({ ok: true, authed: false });
  }

  if (body?.action === "change-password") {
    if (!(await isAuthed())) {
      return Response.json(
        { ok: false, error: "আগে লগইন করুন" },
        { status: 401 },
      );
    }
    if (!(await checkPassword(body?.current))) {
      return Response.json(
        { ok: false, error: "বর্তমান পাসওয়ার্ড ভুল" },
        { status: 401 },
      );
    }
    const problem = passwordProblem(body?.next);
    if (problem) {
      return Response.json({ ok: false, error: problem }, { status: 400 });
    }

    await setPassword(body.next as string);
    // The old cookie was signed with the old password and is dead now, so mint
    // a fresh one — this session stays in, every other one is logged out.
    jar.set(SESSION_COOKIE, await createToken(), sessionCookieOptions);
    return Response.json({ ok: true });
  }

  // One message for both halves — it must not reveal which one was wrong.
  if (!(await checkCredentials(body?.email, body?.password))) {
    return Response.json(
      { ok: false, error: "ভুল ইমেইল বা পাসওয়ার্ড / Wrong email or password" },
      { status: 401 },
    );
  }

  jar.set(SESSION_COOKIE, await createToken(), sessionCookieOptions);
  return Response.json({ ok: true, authed: true });
}
