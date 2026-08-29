import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "polash_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "polash-dev-secret-change-me"
  );
}

function adminEmail(): string {
  return process.env.ADMIN_EMAIL || "admin@gmail.com";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "polash2026";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

/** `<expiry>.<hmac>` — no storage needed, and tampering invalidates it. */
export function createToken(): string {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac) return false;
  if (Number(exp) < Date.now()) return false;

  const expected = sign(exp);
  const a = Buffer.from(mac, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Constant-time compare that tolerates different lengths. */
function matches(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Both halves are always compared, so a wrong email costs the same time as a
 * wrong password and neither can be probed separately. Email is case- and
 * whitespace-insensitive; the password is not.
 */
export function checkCredentials(email: unknown, password: unknown): boolean {
  const emailOk =
    typeof email === "string" &&
    matches(email.trim().toLowerCase(), adminEmail().trim().toLowerCase());
  const passwordOk =
    typeof password === "string" && matches(password, adminPassword());
  return emailOk && passwordOk;
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

/** Standard 401 body for the admin-only handlers. */
export function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
