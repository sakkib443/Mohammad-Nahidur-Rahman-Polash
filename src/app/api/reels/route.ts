import { getReels, saveReels } from "@/lib/store";
import { createResource, isObject, str } from "@/lib/resource";
import type { ReelItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<ReelItem[]>({
  read: getReels,
  write: saveReels,
  validate: (input) => {
    if (!Array.isArray(input)) return null;
    return input.filter(isObject).map((r, i) => ({
      id: str(r.id) || `r${i}`,
      title: str(r.title),
      platform: str(r.platform, "web").toLowerCase(),
      url: str(r.url),
      thumb: str(r.thumb),
      file: str(r.file),
    }));
  },
});

export { GET, PUT };
