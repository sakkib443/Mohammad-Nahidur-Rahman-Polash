"use client";

import { MoonIcon, SunIcon } from "./icons";

export const THEME_KEY = "polash-theme";

/**
 * The current theme lives on `<html class="dark">` (set before first paint by
 * the inline script in the layout). Both icons are rendered and CSS picks one,
 * so this component needs no state and can't flash the wrong icon.
 */
export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* private mode — theme just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 active:scale-95"
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </button>
  );
}
