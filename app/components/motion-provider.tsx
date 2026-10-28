"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useMediaQuery } from "./use-media-query";

/*
  Shared animation setup for the (site) route group.

  - LazyMotion: components use the lightweight `m.*` instead of `motion.*`,
    and the animation features are code-split and fetched after the page
    renders, so they don't weigh on the initial bundle. `strict` throws if a
    full `motion.*` component sneaks back in under this provider.
  - MotionConfig: on mobile (<768px) reducedMotion="always" skips transform
    animations (springs, x/y slides, scale) and keeps only opacity fades, so
    a phone CPU does far less work. Desktop keeps the full animations, and
    the OS "reduce motion" preference is respected everywhere.
*/

const loadFeatures = () =>
  import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
