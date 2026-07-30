import { getVideos, saveVideos } from "@/lib/store";
import { createResource, isObject, str } from "@/lib/resource";
import type { VideoItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<VideoItem[]>({
  read: getVideos,
  write: saveVideos,
  validate: (input) => {
    if (!Array.isArray(input)) return null;
    return input.filter(isObject).map((v, i) => ({
      id: str(v.id) || `v${i}`,
      title: str(v.title),
      youtubeId: str(v.youtubeId).trim(),
      file: str(v.file),
      poster: str(v.poster),
      date: str(v.date),
    }));
  },
});

export { GET, PUT };
