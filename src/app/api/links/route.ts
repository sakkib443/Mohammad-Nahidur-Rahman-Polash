import { getLinks, saveLinks } from "@/lib/store";
import { createResource, bool, isObject, str } from "@/lib/resource";
import type { LinkItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<LinkItem[]>({
  read: getLinks,
  write: saveLinks,
  validate: (input) => {
    if (!Array.isArray(input)) return null;
    return input.filter(isObject).map((l, i) => ({
      id: str(l.id) || `l${i}`,
      platform: str(l.platform, "web").toLowerCase(),
      label: str(l.label),
      url: str(l.url),
      featured: bool(l.featured),
    }));
  },
});

export { GET, PUT };
