import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "polash_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

/**
 * Once the password is changed from the admin panel it lives here, hashed, and
 * takes over from ADMIN_PASSWORD. Until then the env var is the only source, so
 * a fresh deploy works with nothing but environment variables.
 */
const ADMIN_FILE = path.join(process.cwd(), "data", "admin.json");

type AdminRecord = { salt: string; hash: string; updatedAt: string };

export const MIN_PASSWORD_LENGTH = 8;

let cached: AdminRecord | null | undefined;

async function readRecord(): Promise<AdminRecord | null> {
  if (cached !== undefined) return cached;
  try {
    const raw = await fs.readFile(ADMIN_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminRecord>;
    cached =
      typeof parsed.salt === "string" && typeof parsed.hash === "string"
        ? { salt: parsed.salt, hash: parsed.hash, updatedAt: parsed.updatedAt ?? "" }
        : null;
  } catch {
    cached = null;
  }
  return cached;
}

function scrypt(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex"));
    });
  });
}

function adminEmail(): string {
  return process.env.ADMIN_EMAIL || "admin@gmail.com";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "polash2026";
}

/** Constant-time compare that tolerates different lengths. */
function matches(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Folded into the signing key, so changing the password invalidates every
 * cookie signed under the old one — including any session someone else holds.
 */
async function credentialFingerprint(): Promise<string> {
  const record = await readRecord();
  return record ? record.hash : adminPassword();
}

async function signingKey(): Promise<string> {
  const base =
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "polash-dev-secret-change-me";
  return `${base}:${await credentialFingerprint()}`;
}

async function sign(payload: string): Promise<string> {
  return crypto
    .createHmac("sha256", await signingKey())
    .update(payload)
    .digest("hex");
}

/** `<expiry>.<hmac>` — no session storage needed, and tampering invalidates it. */
export async function createToken(): Promise<string> {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${await sign(exp)}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac) return false;
  if (Number(exp) < Date.now()) return false;
  return matches(mac, await sign(exp));
}

/** True once the password has been changed from the panel. */
export async function usingStoredPassword(): Promise<boolean> {
  return (await readRecord()) !== null;
}

export async function checkPassword(password: unknown): Promise<boolean> {
  if (typeof password !== "string") return false;
  const record = await readRecord();
  if (!record) return matches(password, adminPassword());
  return matches(await scrypt(password, record.salt), record.hash);
}

/**
 * Both halves are always checked, so a wrong email costs the same time as a
 * wrong password and neither can be probed separately. Email is case- and
 * whitespace-insensitive; the password is not.
 */
export async function checkCredentials(
  email: unknown,
  password: unknown,
): Promise<boolean> {
  const emailOk =
    typeof email === "string" &&
    matches(email.trim().toLowerCase(), adminEmail().trim().toLowerCase());
  const passwordOk = await checkPassword(password);
  return emailOk && passwordOk;
}

/** Rejects the obviously-weak choices; anything else is the owner's call. */
export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string" || password.trim().length === 0) {
    return "নতুন পাসওয়ার্ড দিন";
  }
  if (password !== password.trim()) {
    return "পাসওয়ার্ডের শুরুতে বা শেষে ফাঁকা জায়গা রাখা যাবে না";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  }
  return null;
}

export async function setPassword(password: string): Promise<void> {
  const salt = crypto.randomBytes(16).toString("hex");
  const record: AdminRecord = {
    salt,
    hash: await scrypt(password, salt),
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(ADMIN_FILE), { recursive: true });
  const tmp = `${ADMIN_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8");
  await fs.rename(tmp, ADMIN_FILE);
  cached = record;
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
