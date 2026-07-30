import { bumpViews, getStats } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getStats();
  return Response.json(
    { ok: true, data: stats },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  const stats = await bumpViews();
  return Response.json(
    { ok: true, data: stats },
    { headers: { "Cache-Control": "no-store" } },
  );
}
