import { getProfile, saveProfile } from "@/lib/store";
import { createResource, bool, isObject, str, strList } from "@/lib/resource";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

const { GET, PUT } = createResource<Profile>({
  read: getProfile,
  write: saveProfile,
  validate: (input) => {
    if (!isObject(input)) return null;
    if (!str(input.name).trim()) return null;

    const rows = (v: unknown, extra = false) =>
      Array.isArray(v)
        ? v.filter(isObject).map((r, i) => ({
            id: str(r.id) || `row-${i}`,
            label: str(r.label),
            value: str(r.value),
            ...(extra ? { note: str(r.note) } : {}),
          }))
        : [];

    return {
      name: str(input.name),
      nameBn: str(input.nameBn),
      headline: str(input.headline),
      headlineBn: str(input.headlineBn),
      verified: bool(input.verified, true),
      birthDate: str(input.birthDate),
      birthPlace: str(input.birthPlace),
      avatar: str(input.avatar),
      heroImages: strList(input.heroImages),
      overview: str(input.overview),
      overviewBn: str(input.overviewBn),
      facts: rows(input.facts, true),
      about: rows(input.about),
      email: str(input.email),
      phone: str(input.phone),
      emails: strList(input.emails),
      phones: strList(input.phones),
      location: str(input.location),
      website: str(input.website),
      seoKeywords: strList(input.seoKeywords),
    } as Profile;
  },
});

export { GET, PUT };
