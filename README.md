# Mohammad Nahidur Rahman Polash — Profile Site

Google Knowledge-Panel স্টাইলের **মোবাইল-ফার্স্ট** পার্সোনাল প্রোফাইল সাইট।
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4। ফ্রন্টএন্ড ও ব্যাকএন্ড একই
প্রজেক্টে — কনটেন্ট JSON ফাইলে থাকে, `/admin` প্যানেল থেকে এডিট করা যায়।

---

## ১. দ্রুত শুরু (Quick start)

```bash
npm install
npm run dev
```

- সাইট: http://localhost:3000
- অ্যাডমিন প্যানেল: http://localhost:3000/admin
- ডিফল্ট পাসওয়ার্ড: `polash2026` (`.env.local` এ বদলান)

প্রোডাকশন:

```bash
npm run build
npm start
```

---

## ২. মোবাইল-অনলি লেআউট

পুরো সাইট একটাই কলাম — `max-width: 440px`, স্ক্রিনের মাঝে বসানো
(`.kp-shell` ইন `src/app/globals.css`)। ফলে ফোনে আর পিসিতে হুবহু একই দেখায়;
পিসিতে দুই পাশে হালকা ব্যাকড্রপ আর একটা সফট শ্যাডো পড়ে, ভিতরের UI বদলায় না।
ছবির লাইটবক্সও এই ৪৪০px প্রস্থেই সীমিত।

---

## ৩. পেজ স্ট্রাকচার

| ট্যাব | কী থাকে |
| --- | --- |
| **Overview** | হিরো ফটো ক্যারোসেল → ফ্যাক্ট কার্ড → Overview (ইংরেজি + বাংলা) → About টেবিল → Published works → Profile Links → Gallery → Contact ফর্ম |
| **Video** | YouTube (click-to-load) ও নিজের আপলোড করা mp4 |
| **Reels** | TikTok / Likee / Instagram / লোকাল ভার্টিক্যাল ক্লিপ |
| **News** | পত্রিকার ফিচার কার্ড (The Bengalee) |

আরও: ডার্ক মোড টগল, শেয়ার বাটন (Web Share API, না থাকলে ক্লিপবোর্ড),
ভিউ কাউন্টার, PWA manifest, `Person` JSON-LD স্কিমা, sitemap ও robots।

---

## ৪. ব্যাকএন্ড (API)

সব রুট `src/app/api/…/route.ts`। GET পাবলিক, PUT/DELETE শুধু অ্যাডমিন
(HMAC-সাইনড কুকি সেশন)।

| রুট | মেথড | কাজ |
| --- | --- | --- |
| `/api/content` | GET | একবারে সব কনটেন্ট |
| `/api/profile` | GET, PUT | নাম, হেডলাইন, overview, facts, about |
| `/api/links` | GET, PUT | সোশ্যাল লিংক |
| `/api/videos` | GET, PUT | ভিডিও লিস্ট |
| `/api/reels` | GET, PUT | রিলস লিস্ট |
| `/api/news` | GET, PUT | নিউজ আইটেম |
| `/api/books` | GET, PUT | প্রকাশিত বই / গাইড |
| `/api/gallery` | GET, PUT | ক্যাপশন, অর্ডার, hide |
| `/api/upload` | POST, DELETE | ছবি আপলোড / ডিলিট (max 8MB, jpg·png·webp·avif) |
| `/api/contact` | POST, GET, DELETE | বার্তা পাঠানো / ইনবক্স |
| `/api/stats` | GET, POST | ভিউ কাউন্টার |
| `/api/auth` | GET, POST | লগইন / লগআউট |

সুরক্ষা: হানিপট ফিল্ড + প্রতি IP ৩০ সেকেন্ড থ্রটল কনট্যাক্ট ফর্মে,
আপলোডে টাইপ/সাইজ চেক ও সার্ভার-জেনারেটেড ফাইলনেম (path traversal বন্ধ),
সব PUT পেলোড সার্ভারে ভ্যালিডেট হয়।

---

## ৫. কনটেন্ট কোথায় থাকে

```
data/                 ← প্রথমবার সার্ভার চালালেই তৈরি হয়
├── profile.json
├── links.json
├── videos.json
├── reels.json
├── news.json
├── books.json
├── gallery.json      ← শুধু ক্যাপশন/অর্ডার/hidden
├── messages.json     ← কনট্যাক্ট ফর্মের বার্তা
└── stats.json        ← ভিউ কাউন্ট
```

প্রথম রানের ডিফল্ট কনটেন্ট `src/lib/seed.ts` এ। `data/` ফাইল থাকলে সেটাই
আসল সোর্স — seed আর ব্যবহার হয় না।

**গ্যালারি ফাইলসিস্টেম-চালিত:** `public/gallery/` এ ছবি রাখলেই সাইটে দেখা যায়,
কোনো কোড বা JSON এডিট করতে হয় না (`src/lib/store.ts` → `getGallery`)।
বর্তমানে ৪৭টি ছবি (`photo-01.jpg` … `photo-47.jpg`) আছে।

---

## ৬. অ্যাডমিন প্যানেল (`/admin`)

৮টি সেকশন: **Profile · Links · Videos · Reels · News · Books · Gallery · Inbox**

- Profile — নাম/হেডলাইন (ইংরেজি ও বাংলা), জন্ম তারিখ ও স্থান, overview,
  হিরো ছবির লিস্ট, SEO কীওয়ার্ড, ফ্যাক্ট কার্ড ও About row যোগ/সরানো/উপর-নিচ
- Links — প্ল্যাটফর্ম সিলেক্ট, URL, "উপরের আইকন সারিতে দেখাবে" চেকবক্স
- Videos — YouTube আইডি অথবা লোকাল ফাইল পাথ
- Books — প্রকাশিত বই/গাইড: নাম, ধরন, সাল, প্রকাশক, লিংক, কভার
- Gallery — ছবি আপলোড, ক্যাপশন, লুকানো, রিঅর্ডার, স্থায়ী ডিলিট
- Inbox — কনট্যাক্ট ফর্মে আসা বার্তা, একটি বা সব ডিলিট

প্রতিটি সেকশনে নিচে স্টিকি **Save** বাটন। সেভের পর সাইট রিফ্রেশ করলেই
নতুন কনটেন্ট দেখা যাবে (পেজ `force-dynamic`)।

---

## ৭. Environment variables

`.env.example` কপি করে `.env.local` বানান:

```env
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=নিজের-শক্ত-পাসওয়ার্ড
ADMIN_SECRET=লম্বা-র‍্যান্ডম-স্ট্রিং
NEXT_PUBLIC_SITE_URL=https://www.mohammadnahidurrahmanpolash.xyz
```

`ADMIN_PASSWORD` এ `#` ব্যবহার করবেন না — `.env` পার্সার ওটার পরের অংশ কমেন্ট ধরে
বাদ দিয়ে দেয়। অ্যাডমিন প্যানেল থেকে পাসওয়ার্ড বদলালে সেটা হ্যাশ হয়ে
`data/admin.json` এ (বা Vercel-এ Blob-এ) জমা হয় এবং env ভেরিয়েবলকে ছাপিয়ে যায়।

`BLOB_READ_WRITE_TOKEN` শুধু Vercel-এ লাগে — নিচের ৮ নম্বর সেকশন দেখুন।

`NEXT_PUBLIC_SITE_URL` canonical URL, sitemap, Open Graph ও JSON-LD এ ব্যবহার হয় —
লাইভ করার আগে অবশ্যই আসল ডোমেইন দিন।

---

## ৮. ডিপ্লয়

কনটেন্ট ও আপলোড ডিস্কে লেখা হয়, তাই **persistent filesystem** দরকার:
VPS (PM2/systemd), Docker, Coolify, Railway, Render — এসবে সরাসরি চলবে।

**সহজ পথ (VPS + PM2):**

```bash
npm ci
npm run build
npm start                      # অথবা: pm2 start npm --name polash -- start
```

**Docker / Coolify:** `next.config.ts` এ `output: "standalone"` আছে, তাই
`.next/standalone` এ ছোট সার্ভার বান্ডল তৈরি হয়। স্ট্যাটিক ফাইল আলাদা করে
কপি করতে হয়:

```bash
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
node .next/standalone/server.js
```

`data/` ফোল্ডার সার্ভারের working directory থেকে পড়া হয় — standalone চালালে
সেটিও `.next/standalone/` এর ভিতরে থাকতে হবে (বা volume মাউন্ট করতে হবে)।

Docker/Coolify এ `data/` আর `public/gallery/` — এই দুটো ভলিউম হিসেবে মাউন্ট করুন,
নইলে রিডিপ্লয়ে এডিট করা কনটেন্ট ও আপলোড করা ছবি মুছে যাবে।

### Vercel-এ ডিপ্লয় (Blob storage)

Vercel-এর ফাইলসিস্টেম read-only, তাই সেখানে ডিস্কে কিছু লেখা যায় না। এর সমাধান
হিসেবে **Vercel Blob** ব্যবহার হয় — `BLOB_READ_WRITE_TOKEN` থাকলে অ্যাপ নিজে থেকেই
`data/*.json` আর আপলোড করা ছবি/ভিডিও Blob-এ রাখে। টোকেন না থাকলে (লোকালি) আগের
মতোই `data/` আর `public/` ফোল্ডার ব্যবহার করে — কোড একই, দুই জায়গাতেই চলে।

**ধাপ:**

1. Vercel ড্যাশবোর্ড → প্রজেক্ট → **Storage** → **Create Database** → **Blob** →
   প্রজেক্টের সাথে Connect করুন। `BLOB_READ_WRITE_TOKEN` নিজে থেকেই যোগ হবে।
2. **Settings → Environment Variables** এ বাকিগুলো দিন:

   ```env
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=শক্ত-পাসওয়ার্ড
   ADMIN_SECRET=লম্বা-র‍্যান্ডম-স্ট্রিং
   NEXT_PUBLIC_SITE_URL=https://আসল-ডোমেইন
   ```

   এগুলো না দিলে কোডের ডিফল্ট মান ব্যবহার হয়, আর সেই ডিফল্ট পাবলিক রিপোতে
   দেখা যায় — তখন যে কেউ অ্যাডমিনে ঢুকতে পারবে।
3. **Redeploy** দিন।

প্রথম রিডে Blob খালি থাকে, তাই রিপোতে থাকা `data/*.json` দিয়েই সাইট চালু হয়।
অ্যাডমিন থেকে প্রথমবার সেভ করলেই সেটা Blob-এ চলে যায় এবং তারপর থেকে Blob-ই
আসল উৎস। মানে **রিডিপ্লয় করলেও এডিট করা কনটেন্ট মুছবে না।**

দুটো সীমাবদ্ধতা মনে রাখুন:

- রিপোর `data/*.json` আর লাইভ কনটেন্ট প্রথম সেভের পর আলাদা হয়ে যায়। রিপোর ফাইল
  এডিট করে ডিপ্লয় করলে সেটা আর সাইটে দেখাবে না — অ্যাডমিন প্যানেলই একমাত্র পথ।
- `public/gallery/` এর পুরোনো ছবিগুলো রিপো থেকেই সার্ভ হয়; নতুন আপলোডগুলো Blob
  URL পায়। দুই ধরনের ছবি পাশাপাশি কাজ করে।

---

## ৯. বয়স নিজে থেকেই হিসাব হয়

`profile.birthDate` (`1993-07-14`) থেকে **Age** কার্ড ও **Born** সারি সার্ভারে
হিসাব হয় (`src/lib/derive.ts`) — প্রতি বছর হাতে বদলাতে হবে না। অ্যাডমিনে
নিজে থেকে `Age` বা `Born` লেবেলের সারি বানালে সেটাই প্রাধান্য পাবে।
`nameBn` ও `headlineBn` স্বয়ংক্রিয়ভাবে About টেবিলে "বাংলা নাম" ও "পেশা" সারি হিসেবে যায়।

## ১০. যা ক্লায়েন্টের কাছ থেকে লাগবে

**আগে কনফার্ম করা দরকার** — Google-এর AI সামারি থেকে নেওয়া, নিজেই দ্বিধাগ্রস্ত
ভাষায় লেখা ছিল (*"Studied **or attended programs linked to** Qatar University"*):

- **Education → Qatar University** — ডিগ্রি না শুধু কোর্স/প্রোগ্রাম? ভুল হলে
  `/admin → Profile → About rows` থেকে সরিয়ে দিন

নিচের তথ্য এখনো জানা নেই, তাই কল্পনা করে বসানো হয়নি:

- বর্তমান প্রতিষ্ঠানের নাম ও পদবি
- যোগাযোগের ইমেইল / ফোন (Profile সেকশন)
- YouTube ভিডিও আইডি (এখন শুধু চ্যানেল লিংক ও একটা লোকাল ক্লিপ আছে)
- **The Bengalee আর্টিকেলের সরাসরি লিংক** — নিউজ কার্ডটি এখন ক্লায়েন্টের
  নির্দেশে Google Books পেজে যায়, পত্রিকার আর্টিকেলে নয়। আসল আর্টিকেল লিংক
  পেলে `/admin → News → URL` এ বসিয়ে দিন
- বইয়ের কভার ছবি — Google Books থেকে নামিয়ে `public/` এ রেখে
  `/admin → Books → Cover image` এ পাথ দিলে প্লেসহোল্ডার আইকনের বদলে
  আসল কভার দেখাবে; বই একাধিক হলে বাকিগুলোর তথ্য

---

## ১১. ফাইল ম্যাপ

```
src/
├── app/
│   ├── page.tsx              প্রোফাইল পেজ (server) + JSON-LD
│   ├── layout.tsx            মেটাডাটা, থিম স্ক্রিপ্ট, .kp-shell
│   ├── globals.css           ডিজাইন টোকেন ও মোবাইল শেল
│   ├── admin/page.tsx        অ্যাডমিন এন্ট্রি
│   ├── api/…                 সব API রুট
│   ├── manifest.ts robots.ts sitemap.ts
│   └── icon.png apple-icon.png
├── components/
│   ├── ProfileApp.tsx        ট্যাব, হেডার, শেয়ার, ভিউ কাউন্ট
│   ├── HeroCarousel.tsx Gallery.tsx Lightbox.tsx
│   ├── Cards.tsx             FactGrid · Overview · About · EmptyState
│   ├── LinksSection.tsx VideoTab.tsx ReelsTab.tsx NewsTab.tsx BooksSection.tsx
│   ├── ContactCard.tsx ThemeToggle.tsx icons.tsx
│   └── admin/AdminApp.tsx admin/ui.tsx
└── lib/
    ├── store.ts              JSON রিড/রাইট, গ্যালারি স্ক্যান
    ├── seed.ts               প্রথম রানের কনটেন্ট
    ├── derive.ts             birthDate → বয়স ও Born লেবেল
    ├── auth.ts               HMAC কুকি সেশন
    ├── resource.ts           GET/PUT হ্যান্ডলার ফ্যাক্টরি
    └── types.ts
```
