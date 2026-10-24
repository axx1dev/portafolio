/*
  Shared next/font definitions for the immersive (bare) routes
  (/invitacion and /baby-shower).

  These used to be loaded at runtime via a Google Fonts `@import url(...)`
  inside each page's `<style jsx global>` block, which made the browser fetch
  CSS + font files from Google on every visit. next/font downloads and
  self-hosts them at build time instead, so no request ever leaves our domain.

  This module is NOT "use client": the loaders are called at module
  top-level and only the resulting objects (each exposing a `.variable`
  CSS-variable class) are imported by the "use client" pages.
*/

import { Cinzel, Fredoka, Outfit } from "next/font/google";

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-cinzel",
});

// Fredoka is a variable font whose weight axis tops out at 700 in this
// next/font version (800 is not an available static weight — the original
// Google `@import` that requested 800 was likewise clamped to the font's
// max). Loading the variable axis keeps the full 300–700 range so the
// `font-weight: 800` declarations in the pages render identically (at the
// heaviest available weight) to the previous CDN-loaded behavior.
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-fredoka",
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-outfit",
});
