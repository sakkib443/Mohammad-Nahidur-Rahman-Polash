import "server-only";
import { isAuthed, unauthorized } from "./auth";

/**
 * Every content endpoint is the same shape: public GET, admin-only PUT that
 * replaces the whole document. This builds both from a reader/writer pair.
 */
export function createResource<T>(opts: {
  read: () => Promise<T>;
  write: (value: T) => Promise<void>;
  validate: (input: unknown) => T | null;
}) {
  async function GET() {
    const data = await opts.read();
    return Response.json(
      { ok: true, data },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  async function PUT(request: Request) {
    if (!(await isAuthed())) return unauthorized();

    const body = await request.json().catch(() => null);
    const value = opts.validate(body);
    if (!value) {
      return Response.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 },
      );
    }

    await opts.write(value);
    return Response.json({ ok: true, data: value });
  }

  return { GET, PUT };
}

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

export const bool = (v: unknown, fallback = false): boolean =>
  typeof v === "boolean" ? v : fallback;

export const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
