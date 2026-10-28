"use client";

import { useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/*
  Full-screen loading screen for the home page's first load.

  Inspired by Motion's "Base UI: Progress" example (label + value + track +
  indicator) and its spring-driven loading bar: the bar follows a useSpring
  motion value, so progress jumps feel smooth.

  When it shows: only when the browser loads the document directly on "/"
  (first visit or a hard reload). Client-side navigation back to home, or
  landing on another route first, never shows it.
  How: the loader is part of the server HTML for "/" only. On hydration its
  element is already in the DOM, so we keep it; on client navigation it
  isn't, so we start as "done".

  Progress is tied to real loading milestones, with a slow trickle between:
    hydrated → 35%, web fonts ready → 65%, window "load" (all scripts,
    styles, images) → 100%. Then it fades out and unmounts.

  The bar and % are written straight to the DOM from the spring's change
  event, so it doesn't depend on the lazily loaded animation features.
  Safety nets: a 10s JS timeout, and a CSS failsafe in globals.css that hides
  the loader after 12s even if JavaScript never runs.
*/

const LOADER_ID = "home-loader";
const MAX_WAIT = 10_000;
const TRICKLE_CAP = 90;

type Phase = "loading" | "leaving" | "done";

export function HomeLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof document === "undefined") return "loading";
    return document.getElementById(LOADER_ID) ? "loading" : "done";
  });

  const target = useMotionValue(0);
  const progress = useSpring(target, { stiffness: 90, damping: 20, restDelta: 0.1 });

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(progress, "change", (v) => {
    const pct = Math.min(100, Math.max(0, v));
    const rounded = Math.round(pct);
    if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
    if (valueRef.current) valueRef.current.textContent = `${rounded}%`;
    rootRef.current?.setAttribute("aria-valuenow", String(rounded));
    // The bar has visually reached the end of a finished load: fade out.
    if (target.get() === 100 && pct >= 99.5) {
      setPhase((p) => (p === "loading" ? "leaving" : p));
    }
  });

  // Drive progress from real loading milestones.
  useEffect(() => {
    if (phase !== "loading" || pathname !== "/") return;

    let finished = false;
    const bump = (v: number) => {
      if (!finished && v > target.get()) target.set(v);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      target.set(100);
    };

    // Hand-off from the pre-hydration CSS creep (`.home-loader-boot`): read
    // where the bar visually is, stop the CSS animation and continue from
    // there with the spring, so there's no jump back to 0.
    const bar = barRef.current;
    if (bar) {
      const t = getComputedStyle(bar).transform;
      const booted = t && t !== "none" ? new DOMMatrixReadOnly(t).a * 100 : 0;
      bar.style.animation = "none";
      target.jump(booted);
      progress.jump(booted);
    }

    bump(35); // hydrated
    document.fonts?.ready.then(() => bump(65));

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    // Keep creeping forward between milestones so it never looks frozen.
    const trickle = window.setInterval(() => {
      const v = target.get();
      if (v < TRICKLE_CAP) bump(v + (TRICKLE_CAP - v) * 0.08);
    }, 300);
    const failsafe = window.setTimeout(finish, MAX_WAIT);

    return () => {
      window.clearInterval(trickle);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", finish);
    };
  }, [phase, pathname, target, progress]);

  // Unmount after the fade-out transition.
  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => setPhase("done"), 500);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === "done" || pathname !== "/") return null;

  return (
    <div
      id={LOADER_ID}
      className={`home-loader-failsafe fixed inset-0 z-[200] flex items-center justify-center bg-obsidian-base transition-opacity duration-500 ${
        phase === "leaving" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <noscript>
        <style>{`#${LOADER_ID}{display:none}`}</style>
      </noscript>

      <div
        ref={rootRef}
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="w-64 md:w-80"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-label-caps text-label-caps text-electric-cyan uppercase tracking-[0.3em]">
            Loading
          </span>
          {/* Empty until JS drives it, so no frozen "0%" while the CSS creep runs. */}
          <span
            ref={valueRef}
            className="font-mono-ui text-mono-ui text-lavender-dust tabular-nums"
          />
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
          <div
            ref={barRef}
            className="home-loader-boot h-full w-full origin-left rounded-full bg-electric-cyan shadow-[0_0_12px_#00f3ff]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
