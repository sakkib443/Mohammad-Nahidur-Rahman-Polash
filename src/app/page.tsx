import ProfileApp from "@/components/ProfileApp";
import { birthYear, calcAge, formatBirthDate } from "@/lib/derive";
import { getContent } from "@/lib/store";

// Content lives in editable JSON, so every request reads the latest version.
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function Home() {
  const content = await getContent();
  const { profile, links, books } = content;

  // Derived once on the server so the client renders the same age it hydrates with.
  const age = calcAge(profile.birthDate);
  const bornLabel = formatBirthDate(profile.birthDate);

  // Person schema — this is what search engines read to build a knowledge panel.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.nameBn || undefined,
    jobTitle: profile.headline,
    description: profile.overview,
    image: profile.avatar ? `${siteUrl}${profile.avatar}` : undefined,
    url: profile.website || siteUrl,
    birthDate: profile.birthDate || undefined,
    birthPlace: profile.birthPlace
      ? { "@type": "Place", name: profile.birthPlace }
      : undefined,
    address: profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location }
      : undefined,
    knowsAbout: profile.seoKeywords.length ? profile.seoKeywords : undefined,
    sameAs: links.filter((l) => l.url.trim()).map((l) => l.url),
    ...(books.length
      ? {
          author: books.map((b) => ({
            "@type": "Book",
            name: b.title,
            url: b.url || undefined,
            datePublished: b.year || undefined,
          })),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileApp
        content={content}
        age={age}
        bornLabel={bornLabel}
        bornYear={birthYear(profile.birthDate)}
      />
    </>
  );
}
