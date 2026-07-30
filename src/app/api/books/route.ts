import { getBooks, saveBooks } from "@/lib/store";
import { createResource, isObject, str } from "@/lib/resource";
import type { BookItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<BookItem[]>({
  read: getBooks,
  write: saveBooks,
  validate: (input) => {
    if (!Array.isArray(input)) return null;
    return input.filter(isObject).map((b, i) => ({
      id: str(b.id) || `b${i}`,
      title: str(b.title),
      subtitle: str(b.subtitle),
      year: str(b.year),
      publisher: str(b.publisher),
      url: str(b.url),
      cover: str(b.cover),
      description: str(b.description),
    }));
  },
});

export { GET, PUT };
