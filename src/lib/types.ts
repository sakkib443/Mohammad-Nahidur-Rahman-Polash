export type Fact = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

export type AboutRow = {
  id: string;
  label: string;
  value: string;
};

export type Profile = {
  name: string;
  nameBn: string;
  headline: string;
  headlineBn: string;
  verified: boolean;
  /** ISO date (YYYY-MM-DD). Age and the "Born" row are derived from this. */
  birthDate: string;
  birthPlace: string;
  avatar: string;
  heroImages: string[];
  overview: string;
  overviewBn: string;
  facts: Fact[];
  about: AboutRow[];
  email: string;
  phone: string;
  emails: string[];
  phones: string[];
  location: string;
  website: string;
  seoKeywords: string[];
};

export type LinkItem = {
  id: string;
  platform: string;
  label: string;
  url: string;
  featured: boolean;
};

export type VideoItem = {
  id: string;
  title: string;
  /** YouTube video id, or empty when `file` is used */
  youtubeId: string;
  /** Path under /public for a self-hosted clip */
  file: string;
  poster: string;
  date: string;
};

export type ReelItem = {
  id: string;
  title: string;
  platform: string;
  url: string;
  thumb: string;
  file: string;
};

export type BookItem = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  publisher: string;
  url: string;
  cover: string;
  description: string;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  image: string;
  excerpt: string;
};

export type GalleryPhoto = {
  id: string;
  src: string;
  caption: string;
  hidden: boolean;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type Stats = {
  views: number;
  updatedAt: string;
};

export type Content = {
  profile: Profile;
  links: LinkItem[];
  videos: VideoItem[];
  reels: ReelItem[];
  news: NewsItem[];
  books: BookItem[];
  gallery: GalleryPhoto[];
};
