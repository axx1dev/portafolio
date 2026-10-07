"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/*
  Unified navigation for the whole journey.

  Design-bug fixes applied here vs the original Stitch screens:
  - The desktop active link used `opacity-80 scale-95` (and on Contact,
    `pointer-events-none`) which made the *current* item look dimmed and
    disabled. Active state now renders bright cyan with an underline.
  - The four screens each shipped a different mobile bottom-nav (labels
    Home/Labs/Stats/Signal with mismatched active icons). It is unified to
    Home/Hobbies/Work/Contact with the active item derived from the route.
  - The Home screen listed the menu order as Home / Hobbies / Work/CV /
    Contact — kept consistent everywhere.
*/

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "terminal" },
  { label: "Hobbies", href: "/hobbies", icon: "biotech" },
  { label: "Work/CV", href: "/work-cv", icon: "fitness_center" },
  { label: "Contact", href: "/contact", icon: "message" },
];

const LOGO_URL = "/logo.png";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname() ?? "/";

  return (
    <>
      {/* TopAppBar — Desktop */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex bg-obsidian-base/80 backdrop-blur-md fixed top-0 inset-x-0 border-b border-glass-edge shadow-[0_0_20px_rgba(0,243,255,0.1)] justify-between items-center px-margin-desktop py-4 z-50"
      >
        <Link href="/" className="flex items-center h-10 w-10 shrink-0">
          <Image
            src={LOGO_URL}
            alt="SYSTEM_ARCHITECT operator logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "relative text-electric-cyan font-mono-ui text-mono-ui pb-1"
                    : "relative text-lavender-dust hover:text-electric-cyan transition-colors font-mono-ui text-mono-ui hover:bg-electric-cyan/5 px-2 py-1 rounded"
                }
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-electric-cyan shadow-[0_0_8px_#00f3ff]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <Link
          href="/contact"
          className="font-mono-ui text-mono-ui text-obsidian-base bg-electric-cyan px-6 py-2 clipped-corner glow-cyan-hover transition-all font-bold hover:scale-105 duration-300"
        >
          Connect
        </Link>
      </motion.nav>

      {/* BottomNavBar — Mobile */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden bg-surface-container/90 backdrop-blur-xl fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full px-6 py-3 w-max border border-glass-edge shadow-[0_0_40px_rgba(178,152,220,0.15)] z-50 flex items-center gap-3"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={
                active
                  ? "flex flex-col items-center justify-center bg-electric-cyan text-obsidian-base rounded-full p-3 shadow-[0_0_15px_#00f3ff] transition-all"
                  : "flex flex-col items-center justify-center text-lavender-dust p-3 hover:text-electric-cyan transition-all hover:scale-110 duration-300"
              }
            >
              <span
                className={`material-symbols-outlined text-[20px] ${active ? "fill" : ""}`}
              >
                {item.icon}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}
