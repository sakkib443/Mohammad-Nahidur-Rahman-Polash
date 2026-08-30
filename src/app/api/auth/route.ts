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
import { blobClientUploads, blobEnabled } from "@/lib/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    authed: await isAuthed(),
    storedPassword: await usingStoredPassword(),
    blob: blobClientUploads(),
    storage: blobEnabled() ? "blob" : "disk",
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
        { ok: false, error: "Please log in first" },
        { status: 401 },
      );
    }
    if (!(await checkPassword(body?.current))) {
      return Response.json(
        { ok: false, error: "Current password is incorrect" },
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
      { ok: false, error: "Wrong email or password" },
      { status: 401 },
    );
  }

  jar.set(SESSION_COOKIE, await createToken(), sessionCookieOptions);
  return Response.json({ ok: true, authed: true });
}
