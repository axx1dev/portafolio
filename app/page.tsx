"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* Home: The CV Summary — hero. */

export default function HomePage() {
  return (
    <main className="pt-[100px] md:pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap">
      {/* ---------------- HERO ---------------- */}
      <section className="relative grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[70vh]">
        {/* Faded portrait backdrop — right anchored, dissolving to the left */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[-20px] md:right-[-40px] w-full md:w-3/5 -z-0 overflow-hidden select-none"
        >
          <Image
            src="/axel_gym.jpeg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-center opacity-40 md:opacity-60 grayscale-[35%] contrast-110"
          />
          {/* Left-to-right dissolve into the base background */}
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-base via-obsidian-base/80 to-transparent" />
          {/* Soft vertical feather so it blends top & bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-base/60 via-transparent to-obsidian-base/60" />
          {/* Faint cyan tint to match the neon look and feel */}
          <div className="absolute inset-0 bg-electric-cyan/5 mix-blend-screen" />
        </motion.div>

        <div className="md:col-span-12 space-y-8 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-glass-edge bg-surface-container/50 px-4 py-2 clipped-corner-bl backdrop-blur-sm"
          >
            <span className="material-symbols-outlined fill text-electric-cyan text-[16px]">
              terminal
            </span>
            <span className="font-label-caps text-label-caps text-lavender-dust">
              STATUS: ONLINE
            </span>
          </motion.div>

          <h1 className="w-full font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.2 }}
              className="inline-block"
            >
              AXEL LÓPEZ PALACIOS:
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.45 }}
              className="inline-block text-electric-cyan"
            >
              FULLSTACK ENGINEER
            </motion.span>
            <span className="terminal-cursor" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-muted-violet pl-6"
          >
            Fullstack developer with more than 10 years of experience in the design, development and implementation of software solutions. Specialized in backend and frontend architectures, as well as efficient deployments. Uses design patterns to optimize code and solve technical challenges. Strong knowledge in agile methodologies, especially Scrum, to ensure best practices, effective collaboration and high quality project delivery.
            <span className="terminal-cursor" />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link
              href="/work-cv"
              className="bg-electric-cyan text-obsidian-base font-label-caps text-label-caps px-8 py-4 clipped-corner glow-cyan-hover transition-all flex items-center gap-2 hover:scale-105 duration-300"
            >
              <span className="material-symbols-outlined text-[18px]">
                data_object
              </span>
              TECH_STACK.json
            </Link>
            <Link
              href="/hobbies"
              className="border border-lavender-dust text-lavender-dust font-label-caps text-label-caps px-8 py-4 clipped-corner hover:border-electric-cyan hover:text-electric-cyan transition-all flex items-center gap-2 hover:bg-electric-cyan/5"
            >
              <span className="material-symbols-outlined text-[18px]">
                deployed_code
              </span>
              HOBBIES.LOG
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
