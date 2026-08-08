import type {
  BookItem,
  LinkItem,
  NewsItem,
  Profile,
  ReelItem,
  VideoItem,
} from "./types";

/**
 * First-run content. Copied into `data/*.json` the first time the server boots,
 * after which the admin panel (or the JSON files themselves) is the source of truth.
 */

/** Google Books listing — the destination for both the news card and the book entry. */
const BOOK_URL =
  "https://books.google.com.bd/books/about/When_the_Fireflies_Remembered_Our_Names.html?id=tOf0EQAAQBAJ&redir_esc=y";

export const seedProfile: Profile = {
  name: "Mohammad Nahidur Rahman Polash",
  nameBn: "মোহাম্মদ নাহিদুর রহমান পলাশ",
  headline: "Safety Officer & Author",
  headlineBn: "সেফটি অফিসার ও লেখক",
  verified: true,
  birthDate: "1993-07-14",
  birthPlace: "Bangladesh",
  // Square headshot crop — used for Open Graph / Twitter share previews.
  avatar: "/avatar.jpg",
  // Client-selected opening slides, in the order they sent them.
  heroImages: [
    "/gallery/photo-05.jpg",
    "/gallery/photo-04.jpg",
    "/gallery/photo-02.jpg",
    "/gallery/photo-03.jpg",
    "/gallery/photo-07.jpg",
  ],
  overview:
    "Mohammad Nahidur Rahman Polash (born 14 July 1993) is a Bangladeshi safety officer and author known for his work in workplace health, hazard identification, risk assessment and occupational safety standards. Based in Chattogram, he has published informational material and guides on safety practices and preventive workplace measures, and runs a YouTube channel sharing practical occupational health and safety guidance for workers.",
  overviewBn:
    "মোহাম্মদ নাহিদুর রহমান পলাশ (জন্ম ১৪ জুলাই ১৯৯৩) একজন বাংলাদেশি সেফটি অফিসার ও লেখক। কর্মক্ষেত্রের স্বাস্থ্য, ঝুঁকি চিহ্নিতকরণ ও নিরূপণ এবং পেশাগত নিরাপত্তা মানদণ্ড নিয়ে কাজের জন্য তিনি পরিচিত। চট্টগ্রামে অবস্থানরত এই পেশাজীবী নিরাপত্তা অনুশীলন ও দুর্ঘটনা প্রতিরোধ বিষয়ে তথ্যভিত্তিক লেখা ও গাইড প্রকাশ করেছেন, পাশাপাশি নিজের ইউটিউব চ্যানেলে শ্রমিকদের জন্য বাস্তবভিত্তিক পেশাগত স্বাস্থ্য ও নিরাপত্তা বিষয়ক পরামর্শ দিয়ে থাকেন।",
  facts: [
    { id: "f1", label: "Profession", value: "Safety Officer", note: "Occupational Health & Safety" },
    { id: "f2", label: "Based in", value: "Chattogram", note: "Bangladesh" },
    { id: "f3", label: "Focus", value: "Workplace Safety", note: "Hazard identification & risk assessment" },
    { id: "f4", label: "Also", value: "Author", note: "Safety guides & fiction" },
    { id: "f5", label: "Featured in", value: "The Bengalee", note: "April 30, 2026" },
  ],
  about: [
    { id: "a1", label: "Full name", value: "Sheikh Mohammad Nahidur Rahman Polash" },
    { id: "a2", label: "Also known as", value: "Polash" },
    { id: "a3", label: "Profession", value: "Safety Officer, Author" },
    { id: "a4", label: "Location", value: "Chattogram, Bangladesh" },
    { id: "a5", label: "Education", value: "Qatar University" },
    { id: "a6", label: "Languages", value: "Bengali, English" },
    { id: "a7", label: "Website", value: "mohammadnahidurrahmanpolash.xyz" },
  ],
  email: "mohammadnahidurrahmanpolash20@gmail.com",
  phone: "+8801622542238",
  emails: [
    "mohammadnahidurrahmanpolash20@gmail.com",
    "mohammadraman@icloud.com",
    "mohammadrahman409@yahoo.com",
    "muhammadnahidurrahmanpolash36@aol.com",
    "muhammadnahidurrahmanpolash@petalmail.com",
    "mohammadnahidurrahmanpolash1993@outlook.com",
  ],
  phones: ["+8801622542238", "+966502925991", "+966501672741"],
  location: "Chattogram, Bangladesh",
  website: "https://www.mohammadnahidurrahmanpolash.xyz/",
  seoKeywords: [
    "Mohammad Nahidur Rahman Polash",
    "মোহাম্মদ নাহিদুর রহমান পলাশ",
    "Safety Officer Bangladesh",
    "Nahidur Rahman Polash",
    "Chattogram Safety Officer",
    "workplace safety Bangladesh",
    "Bangladeshi safety officer and author",
    "occupational safety standards",
    "hazard identification risk assessment",
  ],
};

export const seedBooks: BookItem[] = [
  {
    id: "b1",
    title: "When the Fireflies Remembered Our Names",
    subtitle: "Novel · 128 pages",
    year: "2026",
    publisher: "Skillworldhub",
    url: BOOK_URL,
    cover: "",
    description:
      "A heartfelt novel about the unbreakable bond between a father and his daughter — a journey through love, loss, hope and the quiet moments that define a lifetime.",
  },
];

export const seedLinks: LinkItem[] = [
  { id: "l1", platform: "facebook", label: "Facebook", url: "https://www.facebook.com/share/1E9MXL4vZF/", featured: true },
  { id: "l2", platform: "youtube", label: "YouTube", url: "https://www.youtube.com/@mohammadnahidurrahman2269", featured: true },
  { id: "l3", platform: "instagram", label: "Instagram", url: "https://www.instagram.com/moha.mmadnahidurrahmanpolash", featured: true },
  { id: "l4", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/mohammad-nahidur-rahman-polash-9790393b7", featured: true },
  { id: "l5", platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@mohammadnahidurra03", featured: true },
  { id: "l6", platform: "x", label: "X (Twitter)", url: "https://x.com/polash92149", featured: true },
  { id: "l7", platform: "telegram", label: "Telegram", url: "https://t.me/MohammadNahidurRhamanPolash", featured: true },
  { id: "l8", platform: "threads", label: "Threads", url: "https://www.threads.com/@moham_madnahidurrahmanpolash", featured: false },
  { id: "l9", platform: "github", label: "GitHub", url: "https://github.com/MohammadNahidurRhamanPolash", featured: false },
  { id: "l10", platform: "reddit", label: "Reddit", url: "https://www.reddit.com/u/mohammadpolash1024", featured: false },
  { id: "l11", platform: "tumblr", label: "Tumblr", url: "https://www.tumblr.com/mohammadp", featured: false },
  { id: "l12", platform: "vimeo", label: "Vimeo", url: "https://vimeo.com/user255933032", featured: false },
  { id: "l13", platform: "snapchat", label: "Snapchat", url: "https://www.snapchat.com/add/mohammadnahidur", featured: false },
  { id: "l14", platform: "vk", label: "VK", url: "https://vk.ru/id1112130435", featured: false },
  { id: "l15", platform: "likee", label: "Likee", url: "https://l.likee.video/p/iWmSJD", featured: false },
  { id: "l16", platform: "blogger", label: "Blogspot", url: "https://mohammadnahidurrahmanpolash87.blogspot.com/2026/03/sheikh-mohammad-nahidur-rahman-polash.html", featured: false },
  { id: "l17", platform: "web", label: "Personal site", url: "https://www.mohammadnahidurrahmanpolash.xyz/", featured: true },
  { id: "l18", platform: "web", label: "Linkeei", url: "https://linkeei.com/MohammadNahidurRahmanPolash", featured: false },
  // Google share links: l19 resolves to his knowledge panel (kgmid /g/11zbbk_ry_),
  // l20 to his Google Business listing in Chattogram.
  { id: "l19", platform: "google", label: "Google Profile", url: "https://share.google/pcB7OEcIOa8XSGnw6", featured: true },
  { id: "l20", platform: "google", label: "Google Business", url: "https://share.google/sBEoMXQT52wUc2cQv", featured: true },
  { id: "l21", platform: "aboutme", label: "about.me", url: "https://about.me/mohammadnahidurrhaman", featured: false },
  { id: "l22", platform: "deezer", label: "Deezer", url: "https://www.deezer.com/artist/159796762", featured: false },
  { id: "l23", platform: "wordpress", label: "WordPress", url: "https://nahidurrahmanpolasgmail.wordpress.com/2018/06/22/mohamed-nahidur-rahman-polash/", featured: false },
  { id: "l24", platform: "spacehey", label: "SpaceHey", url: "https://spacehey.com/mohammadnahidurrahmanpolash", featured: false },
  { id: "l25", platform: "band", label: "BAND", url: "https://www.band.us/band/101355061", featured: false },
  { id: "l26", platform: "gettr", label: "GETTR", url: "https://gettr.com/user/206954213329752064", featured: false },
  { id: "l27", platform: "androidapp", label: "Android App", url: "https://appsgeyser.io/18969428/mohammadnahidurrahmanpolash", featured: false },
  // A second, separate Blogspot site — not the same blog as l16.
  { id: "l28", platform: "blogger", label: "Blogger", url: "https://mohammadnahidurrahmanp38.blogspot.com/", featured: false },
  { id: "l29", platform: "barterhub", label: "BarterHub", url: "https://barterhub.in/profile/mohammad-nahidur-rahman-polash", featured: false },
  { id: "l30", platform: "hobbyswap", label: "HobbySwap", url: "https://web.hobbyswap.net/learning/bible/69831312ed7dc55295fbfc39/get-to-know-mohammad-nahidur-rahman-polash", featured: false },
  { id: "l31", platform: "pinterest", label: "Pinterest", url: "https://www.pinterest.com/mohammadnahidurrahman9300/", featured: false },
  { id: "l32", platform: "palsome", label: "Palsome", url: "https://palsome.com/en/news_feed/post/eyJpdiI6Ikh4Y0dOVGQ3MEluMlMvOHg1UkVRREE9PSIsInZhbHVlIjoic0dNMFR2dzFZeDN4QkNXekxzelNUZz09IiwibWFjIjoiNjFjZThkM2UzODRiNmJiNjFiMmMyNTA5ZDk0NzVlY2ZhODVkZjQ1ZGQ0YmJiMmFiYzM4N2U3ODhiM2QzZGQyNiIsInRhZyI6IiJ9", featured: false },
  { id: "l33", platform: "instagram", label: "Instagram (2)", url: "https://www.instagram.com/moham_madnahidurrahmanpolash", featured: false },
  { id: "l34", platform: "web", label: "Business Site", url: "https://sheikhmohammadnahidurrahmanpolas.com.free/", featured: false },
  { id: "l35", platform: "web", label: "Online+", url: "https://app.online.io/43NL/x2rfb7cr", featured: false },
  { id: "l36", platform: "quora", label: "Quora", url: "https://www.quora.com/profile/Mohammad-Nahidur-Rahman-Polash-1", featured: false },
  { id: "l37", platform: "pinterest", label: "Pinterest (2)", url: "https://www.pinterest.com/mohammadnahidurrahmanpolash20/", featured: false },
  { id: "l38", platform: "googlemaps", label: "Google Maps", url: "https://maps.app.goo.gl/XDxzdwujXJrhdoG19", featured: false },
  { id: "l39", platform: "wikigence", label: "Wikigence", url: "https://wikigence.org/wiki/Mohammad_Nahidur_Rahman_Polash", featured: false },
  // A third Blogspot site (…polashs), separate from l16 (…polash87) and l28 (…p38).
  { id: "l40", platform: "blogger", label: "Blogspot (2)", url: "https://mohammadnahidurrahmanpolashs.blogspot.com/2026/03/sheikh-mohammad-nahidur-rahman-polash.html", featured: false },
  { id: "l41", platform: "viptap", label: "VIPTap Card", url: "https://viptap.club/mdnahidur", featured: false },
  { id: "l42", platform: "youthkiawaaz", label: "Youth Ki Awaaz", url: "https://www.youthkiawaaz.com/author/mohammadnahidurrahmanpolash41gmail-com/", featured: false },
  { id: "l43", platform: "soundcloud", label: "SoundCloud", url: "https://soundcloud.com/mohammad-rahman-polash-497989260", featured: false },
  { id: "l44", platform: "everybodywiki", label: "EverybodyWiki", url: "https://en.everybodywiki.com/Mohammad_Nahidur_Rahman_Polash", featured: false },
  { id: "l45", platform: "wikilegends", label: "WikiLegends", url: "https://wikilegends.org/wiki/mohammad-nahidur-rahman-polash", featured: false },
  // A second YouTube channel (…polas-p2x) — not the same as l2 (…rahman2269).
  { id: "l46", platform: "youtube", label: "YouTube (2)", url: "https://www.youtube.com/@mohammadnahidurrahmanpolas-p2x", featured: false },
  { id: "l47", platform: "facebook", label: "Facebook Post", url: "https://www.facebook.com/61552268352601/posts/122110417454075611/", featured: false },
  { id: "l48", platform: "google", label: "Google Search", url: "https://www.google.com/search?q=mohammadnahidurrahmanpolash", featured: false },
  { id: "l49", platform: "googlebooks", label: "Google Books", url: "https://books.google.com/books/about/Mohammad_Nahidur_Rahman_Polash.html?id=Qv3TEQAAQBAJ", featured: false },
  // Two separate Spotify accounts.
  { id: "l50", platform: "spotify", label: "Spotify", url: "https://open.spotify.com/user/31ejzgrkqywycfvjw6456obdn4um", featured: false },
  { id: "l51", platform: "spotify", label: "Spotify (2)", url: "https://open.spotify.com/user/31rzvhxb5l5atbuxarpvgyubwwzm", featured: false },
  // Both share.google shortlinks below currently resolve to Google's error page;
  // kept verbatim at the client's request. Replace with permalinks when they send them.
  // l52 is his novel on Google Books (l49 is a different title, about him).
  { id: "l52", platform: "googlebooks", label: "Google Books (2)", url: "https://share.google/Keeq6eqzdEdUqFHAQ", featured: false },
  { id: "l53", platform: "google", label: "Google Profile (2)", url: "https://share.google/qn91mEsAt0t9FZCyh", featured: false },
  { id: "l54", platform: "blogger", label: "Blogger (2)", url: "https://nahidurrahmahpolash1993.blogspot.com/2026/03/mohammad-nahidur-rahman-polash.html", featured: false },
];

export const seedVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Mohammad Nahidur Rahman Polash — Intro",
    youtubeId: "",
    file: "/media/intro.mp4",
    poster: "/gallery/photo-19.jpg",
    date: "2026-07-30",
  },
];

export const seedReels: ReelItem[] = [
  {
    id: "r1",
    title: "TikTok — @mohammadnahidurra03",
    platform: "tiktok",
    url: "https://www.tiktok.com/@mohammadnahidurra03",
    thumb: "/gallery/photo-05.jpg",
    file: "",
  },
  {
    id: "r2",
    title: "TikTok — short clips",
    platform: "tiktok",
    url: "https://vm.tiktok.com/ZS9N44cRDJ8ew-PjGdT/",
    thumb: "/gallery/photo-03.jpg",
    file: "",
  },
  {
    id: "r3",
    title: "Likee video",
    platform: "likee",
    url: "https://l.likee.video/p/iWmSJD",
    thumb: "/gallery/photo-07.jpg",
    file: "",
  },
  {
    id: "r4",
    title: "Instagram profile",
    platform: "instagram",
    url: "https://www.instagram.com/moha.mmadnahidurrahmanpolash",
    thumb: "/gallery/photo-02.jpg",
    file: "",
  },
];

export const seedNews: NewsItem[] = [
  {
    id: "n1",
    title:
      "Bangladeshi Safety Officer Mohammad Nahidur Rahman Polash Promotes Workplace Safety Through YouTube",
    source: "The Bengalee",
    date: "2026-04-30",
    url: BOOK_URL,
    image: "/gallery/photo-47.jpg",
    excerpt:
      "The Bengalee features Chattogram-based Safety Officer Mohammad Nahidur Rahman Polash and the workplace-safety awareness content he publishes on YouTube.",
  },
];
