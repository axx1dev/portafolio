"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { MdTerminal, MdDataObject, MdViewInAr } from "react-icons/md";

/* Home: The CV Summary — hero. */

// Entrance animations run when each element enters the viewport (once),
// instead of all being computed at load time.
const inView = { once: true } as const;

export default function HomePage() {
  return (
    <main className="pt-[40px] pb-[40px] md:pt-[120px] md:pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap">
      {/* ---------------- HERO ---------------- */}
      <section className="relative grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[70vh]">
        <div className="md:col-span-12 space-y-8 z-10 relative">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-glass-edge bg-surface-container/50 px-4 py-2 clipped-corner-bl backdrop-blur-sm"
          >
            <MdTerminal className="text-electric-cyan" size={16} />
            <span className="font-label-caps text-label-caps text-lavender-dust">
              STATUS: ONLINE
            </span>
          </m.div>

          <h1 className="w-full font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-white">
            <m.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={inView}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.2 }}
              className="inline-block"
            >
              AXEL LÓPEZ PALACIOS:
            </m.span>
            <br />
            <m.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={inView}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.45 }}
              className="inline-block text-electric-cyan"
            >
              FULLSTACK ENGINEER
            </m.span>
            <span className="terminal-cursor" />
          </h1>

          <m.p
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={inView}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-muted-violet pl-6"
          >
            Fullstack developer with more than 10 years of experience in the design, development and implementation of software solutions. Specialized in backend and frontend architectures, as well as efficient deployments. Uses design patterns to optimize code and solve technical challenges. Strong knowledge in agile methodologies, especially Scrum, to ensure best practices, effective collaboration and high quality project delivery.
            <span className="terminal-cursor" />
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link
              href="/work-cv"
              className="bg-electric-cyan text-obsidian-base font-label-caps text-label-caps px-8 py-4 clipped-corner glow-cyan-hover transition-all flex items-center gap-2 hover:scale-105 duration-300"
            >
              <MdDataObject size={18} />
              TECH_STACK.json
            </Link>
            <Link
              href="/hobbies"
              className="border border-lavender-dust text-lavender-dust font-label-caps text-label-caps px-8 py-4 clipped-corner hover:border-electric-cyan hover:text-electric-cyan transition-all flex items-center gap-2 hover:bg-electric-cyan/5"
            >
              {/* deployed_code has no exact react-icons/md match; MdViewInAr (3D box) is the closest */}
              <MdViewInAr size={18} />
              HOBBIES.LOG
            </Link>
          </m.div>
        </div>
      </section>
    </main>
  );
}
