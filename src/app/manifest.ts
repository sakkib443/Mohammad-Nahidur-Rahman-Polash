import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const p = await getProfile();

  return {
    name: `${p.name} — ${p.headline}`,
    short_name: p.name.split(" ").slice(-1)[0] || "Profile",
    description: p.overview.slice(0, 160),
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#1a73e8",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
