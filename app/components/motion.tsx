"use client";

import { m, type Variants } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

/*
  Small reusable animation primitives shared across the journey.
  These use whileInView so sections only animate when they scroll into
  view, instead of every animation running in the first second of the page.
  They render `m.*` and rely on the (site) MotionProvider (LazyMotion).
*/

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
} & Omit<ComponentProps<typeof m.div>, "children">;

/** Reveals its content with a fade + rise the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0, ...rest }: RevealProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </m.div>
  );
}

/** Container that staggers the entrance of its `StaggerItem` children. */
export function StaggerGroup({
  children,
  className,
  ...rest
}: RevealProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer}
      className={className}
      {...rest}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className, ...rest }: RevealProps) {
  return (
    <m.div variants={fadeUp} className={className} {...rest}>
      {children}
    </m.div>
  );
}
