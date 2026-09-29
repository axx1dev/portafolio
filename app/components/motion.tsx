"use client";

import { motion, type Variants } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

/*
  Small reusable animation primitives shared across the journey.
  These use whileInView so sections animate as they scroll into view.
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
} & Omit<ComponentProps<typeof motion.div>, "children">;

/** Reveals its content with a fade + rise the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0, ...rest }: RevealProps) {
  return (
    <motion.div
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
    </motion.div>
  );
}

/** Container that staggers the entrance of its `StaggerItem` children. */
export function StaggerGroup({
  children,
  className,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...rest }: RevealProps) {
  return (
    <motion.div variants={fadeUp} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
