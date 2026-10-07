"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const PageTransition = dynamic(
  () => import("./page-transition").then((m) => m.PageTransition),
  { ssr: false }
);

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
