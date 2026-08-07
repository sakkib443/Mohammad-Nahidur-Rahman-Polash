import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  "aria-hidden": true,
  ...props,
});

/* ---------------------------------- UI ---------------------------------- */

export const VerifiedIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="m12 1.6 2.3 2.1 3.1-.4 1 3 2.9 1.2-1 3 1 3-2.9 1.2-1 3-3.1-.4L12 22.4l-2.3-2.1-3.1.4-1-3-2.9-1.2 1-3-1-3 2.9-1.2 1-3 3.1.4L12 1.6Zm-1.2 13.9 5.7-5.7-1.4-1.4-4.3 4.3-2-2-1.4 1.4 3.4 3.4Z" />
  </svg>
);

export const ShareIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="2.6" />
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="19" r="2.6" />
    <path d="m8.4 10.8 7.2-4.2M8.4 13.2l7.2 4.2" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.4" />
    <path d="m3.4 7 8.6 6 8.6-6" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.6 5.4a2 2 0 0 1 2-2h2l1.6 4-2 1.2a11 11 0 0 0 5.2 5.2l1.2-2 4 1.6v2a2 2 0 0 1-2 2A13 13 0 0 1 4.6 5.4Z" />
  </svg>
);

export const EyeIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-6.4 10-6.4S22 12 22 12s-3.6 6.4-10 6.4S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowUpIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </svg>
);

export const WhatsappIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.32 4.95L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.49 0 9.95-4.46 9.95-9.96C22 6.46 17.53 2 12.04 2Zm0 18.24h-.01c-1.55 0-3.07-.42-4.4-1.2l-.32-.19-3.27.86.87-3.19-.2-.33a8.26 8.26 0 0 1-1.27-4.4c0-4.56 3.72-8.28 8.29-8.28 2.21 0 4.29.86 5.85 2.43a8.23 8.23 0 0 1 2.43 5.86c0 4.57-3.72 8.28-8.28 8.28Zm4.54-6.2c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.66.8-.81.97-.15.16-.3.19-.54.06a6.72 6.72 0 0 1-2-1.23 7.4 7.4 0 0 1-1.37-1.71c-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.17 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.57.19 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.47-.29Z" />
  </svg>
);

export const ChevronIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const PlayIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M8 5.2v13.6L19 12 8 5.2Z" />
  </svg>
);

export const SunIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M20.7 14.6A8.8 8.8 0 0 1 9.4 3.3a8.8 8.8 0 1 0 11.3 11.3Z" />
  </svg>
);

export const BookIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4.6A1.6 1.6 0 0 1 5.6 3H18a1 1 0 0 1 1 1v13.4" />
    <path d="M4 4.6v12.9A2.5 2.5 0 0 1 6.5 15H19a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 0 4 19.5" />
    <path d="M8 7.2h7M8 10.2h5" />
  </svg>
);

export const LinkIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.4 13.6a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 1 0-5.7-5.7L11.8 6.5" />
    <path d="M13.6 10.4a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 1 0 5.7 5.7l1.4-1.4" />
  </svg>
);

/* ------------------------------- Platforms ------------------------------- */

export const FacebookIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M13.5 21.9v-8.2h2.8l.42-3.2H13.5V8.4c0-.93.26-1.56 1.6-1.56h1.7V4a23 23 0 0 0-2.5-.13c-2.47 0-4.16 1.5-4.16 4.27v2.38H7.3v3.2h2.84v8.2h3.36Z" />
  </svg>
);

export const YoutubeIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.26 5 12 5 12 5s-6.26 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.74 19 12 19 12 19s6.26 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8Z" />
    <path d="M10.1 15.1V8.9L15.5 12l-5.4 3.1Z" className="fill-white dark:fill-[#17191c]" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9}>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none" />
  </svg>
);

export const LinkedinIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8c0 .33.27.6.6.6h16.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6Z" />
    <path
      className="fill-white dark:fill-[#17191c]"
      d="M6 9.7h2.6V18H6V9.7Zm1.3-4.1a1.5 1.5 0 1 1 0 3.01 1.5 1.5 0 0 1 0-3.01ZM10.3 9.7h2.5v1.14h.04c.35-.66 1.2-1.36 2.48-1.36 2.65 0 3.14 1.74 3.14 4.01V18h-2.6v-3.98c0-.95-.02-2.17-1.32-2.17-1.33 0-1.53 1.03-1.53 2.1V18h-2.6V9.7Z"
    />
  </svg>
);

export const TiktokIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M16.3 2.5c.36 2.14 1.63 3.53 3.7 3.78v2.83c-1.35.09-2.6-.24-3.83-1v5.98c0 5.03-4.83 7.5-8.62 5.2-2.5-1.5-3.3-4.72-1.9-7.32 1.14-2.11 3.55-3.2 5.94-2.7v3.02c-.5-.13-1-.15-1.5-.03-1.28.3-2.06 1.5-1.8 2.78.26 1.29 1.55 2.1 2.85 1.8 1.1-.25 1.83-1.24 1.83-2.4V2.5h3.33Z" />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M17.53 3h3.2l-6.99 7.99L22 21h-6.4l-5.02-6.15L4.83 21H1.62l7.48-8.55L2 3h6.56l4.54 5.62L17.53 3Zm-1.12 16.1h1.77L7.68 4.8H5.78l10.63 14.3Z" />
  </svg>
);

export const TelegramIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M21.7 4.3 2.9 11.5c-1.05.4-1.04 1 .12 1.32l4.6 1.44 1.78 5.35c.22.6.4.83 1 .3l2.6-1.9 4.68 3.46c.86.48 1.42.23 1.62-.8l3-14.06c.24-1.13-.4-1.6-1.6-1.27ZM8.9 14.2l9.2-5.66c.42-.26.8-.12.5.16l-7.87 7.1-.3 3.2-1.53-4.8Z" />
  </svg>
);

export const ThreadsIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 8.6c-.7-1.9-2.4-2.9-4.6-2.9-3.6 0-5.7 2.6-5.7 6.4s2.1 6.3 5.7 6.3c2.8 0 4.4-1.4 4.4-3.1 0-1.9-1.7-2.8-3.9-2.8-1.6 0-2.8.7-2.8 1.8 0 .9.7 1.4 1.7 1.4 1.6 0 2.5-1.3 2.5-3.5" />
  </svg>
);

export const GithubIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M12 2.2A9.8 9.8 0 0 0 8.9 21.3c.5.1.68-.21.68-.47v-1.8c-2.72.6-3.3-1.16-3.3-1.16-.45-1.13-1.1-1.43-1.1-1.43-.9-.6.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.88 1.5 2.3 1.07 2.87.82.09-.64.35-1.07.63-1.32-2.17-.24-4.46-1.08-4.46-4.83 0-1.07.38-1.94 1-2.62-.1-.25-.44-1.25.1-2.6 0 0 .83-.26 2.72 1a9.4 9.4 0 0 1 4.96 0c1.89-1.26 2.72-1 2.72-1 .54 1.35.2 2.35.1 2.6.63.68 1 1.55 1 2.62 0 3.76-2.29 4.58-4.47 4.82.35.3.67.9.67 1.83v2.7c0 .27.18.58.69.48A9.8 9.8 0 0 0 12 2.2Z" />
  </svg>
);

export const RedditIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M22 11.3a2.2 2.2 0 0 0-3.73-1.57c-1.5-1-3.5-1.62-5.7-1.7l1.14-3.6 3.06.72a1.9 1.9 0 1 0 .22-1.42l-3.6-.85a.7.7 0 0 0-.83.47l-1.4 4.68c-2.24.07-4.27.7-5.79 1.7A2.2 2.2 0 1 0 3 15.06c-.02.2-.03.4-.03.6C2.97 18.9 6.98 21.5 12 21.5s9.03-2.6 9.03-5.84c0-.2-.01-.4-.04-.6A2.2 2.2 0 0 0 22 11.3ZM7.9 13.3a1.55 1.55 0 1 1 3.1 0 1.55 1.55 0 0 1-3.1 0Zm8.13 4.28c-1 1-2.6 1.48-4.03 1.48s-3.03-.48-4.03-1.48a.53.53 0 1 1 .75-.75c.72.72 2.05 1.16 3.28 1.16s2.56-.44 3.28-1.16a.53.53 0 1 1 .75.75Zm-.53-2.73a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Z" />
  </svg>
);

export const SnapchatIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M12 2.5c2.6 0 4.4 2 4.4 4.6 0 .8-.06 1.5-.1 2.1.3.16.7.2 1.1.06.5-.16 1 .1 1.14.55.14.46-.12.94-.6 1.1-.5.17-1 .3-1.4.5-.3.16-.4.35-.3.66.5 1.6 1.7 2.9 3.2 3.4.5.16.7.6.5 1-.2.45-.8.8-1.9 1-.3.05-.4.2-.5.5-.1.4-.2.7-.7.7-.5 0-1-.14-1.7-.14-1 0-1.4.2-2.1.75-.6.5-1.3.9-2.14.9-.85 0-1.5-.4-2.13-.9-.7-.55-1.1-.75-2.1-.75-.7 0-1.2.14-1.7.14-.5 0-.6-.3-.7-.7-.1-.3-.2-.45-.5-.5-1.1-.2-1.7-.55-1.9-1-.2-.4 0-.84.5-1 1.5-.5 2.7-1.8 3.2-3.4.1-.3 0-.5-.3-.66-.4-.2-.9-.33-1.4-.5-.48-.16-.74-.64-.6-1.1.14-.46.64-.71 1.14-.55.4.13.8.1 1.1-.06-.04-.6-.1-1.3-.1-2.1C7.6 4.5 9.4 2.5 12 2.5Z" />
  </svg>
);

export const VimeoIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M22 7.4c-.1 2.14-1.6 5.07-4.48 8.79C14.54 20.08 12.03 22 9.99 22c-1.27 0-2.34-1.17-3.21-3.5l-1.76-6.4c-.65-2.34-1.35-3.5-2.1-3.5-.16 0-.73.34-1.7 1.02L0 8.31c1.06-.93 2.1-1.86 3.13-2.79C4.54 4.28 5.6 3.65 6.3 3.58c1.66-.16 2.68.97 3.06 3.4.42 2.62.7 4.25.87 4.89.48 2.2 1.02 3.3 1.6 3.3.45 0 1.13-.71 2.03-2.13.9-1.42 1.39-2.5 1.46-3.24.14-1.31-.37-1.97-1.46-1.97-.52 0-1.06.12-1.6.36 1.06-3.48 3.1-5.17 6.1-5.07 2.22.07 3.27 1.5 3.14 4.28Z" />
  </svg>
);

export const TumblrIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M14.1 21.6c-3.34 0-5.83-1.72-5.83-5.83v-5.9H5.5V6.75C8.5 5.97 9.76 3.4 9.9 1.2h3.16v5.1h3.68v3.57h-3.68v5.16c0 1.56.79 2.1 2.04 2.1h1.8v4.47H14.1Z" />
  </svg>
);

export const VkIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M12.9 17.1c-5.4 0-8.9-3.8-9-10.1h2.8c.1 4.7 2.2 6.7 3.8 7.1V7h2.6v4c1.6-.2 3.3-2.1 3.9-4h2.6a7.8 7.8 0 0 1-3.5 5.1 8.1 8.1 0 0 1 4.1 5h-2.9c-.6-1.9-2.1-3.4-4.2-3.6v3.6h-.2Z" />
  </svg>
);

export const BloggerIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M14.6 21.5H9.4A6.9 6.9 0 0 1 2.5 14.6V9.4A6.9 6.9 0 0 1 9.4 2.5h5.2a6.9 6.9 0 0 1 6.9 6.9v5.2a6.9 6.9 0 0 1-6.9 6.9ZM9.6 7.3a1.75 1.75 0 0 0 0 3.5h3.1a1.75 1.75 0 0 0 0-3.5H9.6Zm0 5.9a1.75 1.75 0 0 0 0 3.5h4.8a1.75 1.75 0 0 0 0-3.5H9.6Z" />
  </svg>
);

export const PinterestIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M12 2.2a9.8 9.8 0 0 0-3.57 18.92c-.08-.8-.16-2.04.03-2.92.18-.8 1.13-4.78 1.13-4.78s-.29-.58-.29-1.43c0-1.34.78-2.34 1.74-2.34.82 0 1.22.62 1.22 1.36 0 .83-.53 2.07-.8 3.22-.23.97.48 1.76 1.44 1.76 1.72 0 3.05-1.82 3.05-4.44 0-2.32-1.67-3.94-4.05-3.94-2.76 0-4.38 2.07-4.38 4.21 0 .83.32 1.72.72 2.21.08.09.09.18.07.28l-.27 1.1c-.04.18-.14.22-.33.13-1.22-.57-1.98-2.35-1.98-3.78 0-3.08 2.24-5.9 6.45-5.9 3.39 0 6.02 2.41 6.02 5.64 0 3.37-2.12 6.08-5.07 6.08-.99 0-1.92-.51-2.24-1.12l-.61 2.32c-.22.85-.81 1.91-1.21 2.56A9.8 9.8 0 1 0 12 2.2Z" />
  </svg>
);

export const QuoraIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11.3" cy="10.8" r="7.3" />
    <path d="M10.8 14.6c.7 1.8 2.1 3 4.2 3" />
  </svg>
);

/** Phone with a download arrow — used for the APK listing. */
export const AppIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="2.6" width="12" height="18.8" rx="2.6" />
    <path d="M12 7.4v6.4m0 0-2.5-2.5M12 13.8l2.5-2.5" />
  </svg>
);

export const DeezerIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <rect x="14.5" y="5.6" width="6.5" height="2.7" rx="0.6" />
    <rect x="14.5" y="10" width="6.5" height="2.7" rx="0.6" />
    <rect x="7.2" y="10" width="6.5" height="2.7" rx="0.6" />
    <rect x="14.5" y="14.4" width="6.5" height="2.7" rx="0.6" />
    <rect x="7.2" y="14.4" width="6.5" height="2.7" rx="0.6" />
    <rect x="3" y="14.4" width="3.5" height="2.7" rx="0.6" />
  </svg>
);

export const SoundcloudIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <rect x="2.6" y="11.2" width="1.5" height="4.8" rx="0.75" />
    <rect x="5.5" y="9.6" width="1.5" height="6.4" rx="0.75" />
    <rect x="8.4" y="8.4" width="1.5" height="7.6" rx="0.75" />
    <path d="M11.9 16V8.6a4.2 4.2 0 0 1 6.2 3 3.2 3.2 0 0 1-.7 4.4h-4.6a.9.9 0 0 1-.9-.9Z" />
  </svg>
);

export const SpotifyIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M7.4 9.1c3-.8 6.2-.4 8.9 1.1" />
    <path d="M8 12.3c2.5-.6 5.1-.3 7.3.9" />
    <path d="M8.6 15.3c2-.5 4-.2 5.8.8" />
  </svg>
);

/** Open book — the encyclopedia-style wiki profiles (Wikigence, WikiLegends, …). */
export const WikiIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6.6C10.3 5.2 7.9 4.7 4.5 5v12c3.4-.3 5.8.2 7.5 1.6 1.7-1.4 4.1-1.9 7.5-1.6V5c-3.4-.3-5.8.2-7.5 1.6Z" />
    <path d="M12 6.6v12" />
  </svg>
);

/** Contact card — used for the VIPTap digital business card. */
export const CardIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.4" />
    <circle cx="8.4" cy="10.8" r="1.9" />
    <path d="M5.7 15.7c.6-1.5 4-1.5 4.6 0M13.8 9.8h4.4M13.8 13.4h4.4" />
  </svg>
);

export const MapPinIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 10.3c0 5.2-7 11.2-7 11.2s-7-6-7-11.2a7 7 0 1 1 14 0Z" />
    <circle cx="12" cy="10.1" r="2.6" />
  </svg>
);

export const WordpressIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m6.9 8.4 2.5 7.2L12 9.6l2.6 6 2.5-7.2" />
  </svg>
);

/** Single-colour "G" — the tile behind it already carries Google's blue. */
export const GoogleIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M12.24 10.4v3.35h4.77a4.1 4.1 0 0 1-1.78 2.68l2.87 2.23c1.68-1.55 2.64-3.83 2.64-6.54 0-.63-.06-1.24-.16-1.82h-8.34Z" />
    <path d="M12 21.5c2.4 0 4.42-.79 5.9-2.15l-2.88-2.23c-.8.54-1.82.85-3.02.85-2.32 0-4.29-1.56-4.99-3.67l-2.96 2.29A8.94 8.94 0 0 0 12 21.5Z" />
    <path d="M7.01 14.3a5.37 5.37 0 0 1 0-3.43L4.05 8.58a8.96 8.96 0 0 0 0 8.02l2.96-2.3Z" />
    <path d="M12 6.8c1.31 0 2.48.45 3.4 1.33l2.55-2.55C16.41 4.15 14.39 3.3 12 3.3a8.94 8.94 0 0 0-7.95 4.88l2.96 2.29C7.71 8.36 9.68 6.8 12 6.8Z" />
  </svg>
);

export const GlobeIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.85}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <path d="M3.3 9.2h17.4M3.3 14.8h17.4" strokeLinecap="round" />
  </svg>
);

/* --------------------------- Registry + colours --------------------------- */

export const platformIcons: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  x: XIcon,
  twitter: XIcon,
  telegram: TelegramIcon,
  whatsapp: WhatsappIcon,
  threads: ThreadsIcon,
  github: GithubIcon,
  reddit: RedditIcon,
  snapchat: SnapchatIcon,
  vimeo: VimeoIcon,
  tumblr: TumblrIcon,
  vk: VkIcon,
  blogger: BloggerIcon,
  pinterest: PinterestIcon,
  quora: QuoraIcon,
  likee: GlobeIcon,
  google: GoogleIcon,
  googlemaps: MapPinIcon,
  googlebooks: BookIcon,
  soundcloud: SoundcloudIcon,
  spotify: SpotifyIcon,
  wikigence: WikiIcon,
  everybodywiki: WikiIcon,
  wikilegends: WikiIcon,
  viptap: CardIcon,
  youthkiawaaz: GlobeIcon,
  deezer: DeezerIcon,
  wordpress: WordpressIcon,
  aboutme: GlobeIcon,
  androidapp: AppIcon,
  spacehey: GlobeIcon,
  band: GlobeIcon,
  gettr: GlobeIcon,
  barterhub: GlobeIcon,
  hobbyswap: GlobeIcon,
  web: GlobeIcon,
};

export const platformColors: Record<string, string> = {
  facebook: "#1877F2",
  youtube: "#FF0000",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  tiktok: "#010101",
  x: "#0F1419",
  twitter: "#0F1419",
  telegram: "#26A5E4",
  whatsapp: "#25D366",
  threads: "#000000",
  github: "#181717",
  reddit: "#FF4500",
  snapchat: "#F7B500",
  vimeo: "#1AB7EA",
  tumblr: "#36465D",
  vk: "#0077FF",
  blogger: "#FF5722",
  pinterest: "#E60023",
  quora: "#B92B27",
  likee: "#F8CB00",
  google: "#4285F4",
  googlemaps: "#34A853",
  googlebooks: "#4285F4",
  soundcloud: "#FF5500",
  spotify: "#1DB954",
  wikigence: "#1F6FEB",
  everybodywiki: "#4B5563",
  wikilegends: "#0F172A",
  viptap: "#0EA5A4",
  youthkiawaaz: "#17A2A2",
  deezer: "#A238FF",
  wordpress: "#21759B",
  aboutme: "#00A98F",
  androidapp: "#3DDC84",
  spacehey: "#4A76A8",
  band: "#00C73C",
  gettr: "#E5222C",
  barterhub: "#0F9D8C",
  hobbyswap: "#7C4DFF",
  palsome: "#FF5E3A",
  web: "#1a73e8",
};

export function PlatformIcon({
  platform,
  className,
  size = 20,
}: {
  platform: string;
  className?: string;
  size?: number;
}) {
  const Icon = platformIcons[platform] ?? GlobeIcon;
  return <Icon width={size} height={size} className={className} />;
}
