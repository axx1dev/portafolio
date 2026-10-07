"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// ssr: true so the page content is in the initial HTML — avoids the
// layout shift caused by content appearing after hydration
const PageTransition = dynamic(
  () => import("./page-transition").then((m) => m.PageTransition),
  { ssr: true }
);

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
