import { getNews, saveNews } from "@/lib/store";
import { createResource, isObject, str } from "@/lib/resource";
import type { NewsItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<NewsItem[]>({
  read: getNews,
  write: saveNews,
  validate: (input) => {
    if (!Array.isArray(input)) return null;
    return input.filter(isObject).map((n, i) => ({
      id: str(n.id) || `n${i}`,
      title: str(n.title),
      source: str(n.source),
      date: str(n.date),
      url: str(n.url),
      image: str(n.image),
      excerpt: str(n.excerpt),
    }));
  },
});

export { GET, PUT };
