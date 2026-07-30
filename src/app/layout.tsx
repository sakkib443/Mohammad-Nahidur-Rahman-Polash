import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/store";

// Poppins isn't a variable font, so the weights the UI actually uses are listed
// explicitly. Bengali glyphs aren't in Poppins — those fall through to the
// Bengali stack in globals.css.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#17191c" },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  const title = `${p.name} — ${p.headline}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${p.name}` },
    description: p.overview.slice(0, 200),
    keywords: p.seoKeywords,
    authors: [{ name: p.name }],
    creator: p.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      title,
      description: p.overview.slice(0, 200),
      url: "/",
      siteName: p.name,
      locale: "bn_BD",
      images: p.avatar ? [{ url: p.avatar, width: 1080, height: 1080 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.overview.slice(0, 200),
      images: p.avatar ? [p.avatar] : [],
    },
    robots: { index: true, follow: true },
  };
}

/** Applies the saved theme before first paint so there's no white flash. */
const themeScript = `
try {
  var t = localStorage.getItem('polash-theme');
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <div className="kp-shell">{children}</div>
      </body>
    </html>
  );
}
