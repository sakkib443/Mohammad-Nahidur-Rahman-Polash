import { getGallery, saveGallery } from "@/lib/store";
import { createResource, bool, isObject, str } from "@/lib/resource";
import type { GalleryPhoto } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<GalleryPhoto[]>({
  read: getGallery,
  write: saveGallery,
  validate: (input) => {
    if (!Array.isArray(input)) return null;
    return input.filter(isObject).map((g, i) => ({
      id: str(g.id) || `photo-${i}`,
      src: str(g.src),
      caption: str(g.caption),
      hidden: bool(g.hidden),
    }));
  },
});

export { GET, PUT };
