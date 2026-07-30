import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Single read-only endpoint the front-end (or any third party) can poll. */
export async function GET() {
  const content = await getContent();
  return Response.json(
    { ok: true, content },
    { headers: { "Cache-Control": "no-store" } },
  );
}
