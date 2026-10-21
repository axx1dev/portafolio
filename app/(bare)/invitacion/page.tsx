"use client";

import { useCallback, useRef } from "react";
import { Countdown } from "../../components/countdown";

/*
  /invitacion — Pokémon Baby Shower invitation.

  Faithful React port of the Google Stitch design
  "Baby Shower Bastian Leonardo - Tarjeta Pokémon con Pokébola Animada"
  (project 4771103928798959489, screen 37b7c9e96d294b8d9ea1eb7b470a5d72).

  Everything is preserved 1:1 from the original: colors, fonts, the 3D
  pokéball, the cinematic throw/open sequence, sparkles, the live
  countdown, and the Web Audio API sounds that play when the pokéball
  opens (throw swish + mechanical click + triumphant chime), plus the
  festive fanfare bell.

  Rendered as a full-screen overlay (z-[60]) so it sits above the
  portfolio navbar/footer (z-50) and owns the whole viewport.
*/

/* ------------------------------------------------------------------ *
 * Web Audio — the pokéball opening sound
 * ------------------------------------------------------------------ */

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  return new AudioCtx();
}

// "Swish" — energetic trainer throw
function playThrowSound(ctx: AudioContext | null) {
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.35);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
}

// Mechanical opening click
function playPokeClick(ctx: AudioContext | null) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// Bright flash + triumphant Pokémon chime
function playChimeFlash(ctx: AudioContext | null) {
  if (!ctx) return;
  const notes = [659.25, 880, 1046.5, 1318.51, 1567.98]; // E5, A5, C6, E6, G6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

    gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + idx * 0.07 + 0.55
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + idx * 0.07);
    osc.stop(ctx.currentTime + idx * 0.07 + 0.6);
  });
}

// Festive bell fanfare
function playFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + idx * 0.12 + 0.35
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch {
    /* no-op */
  }
}

/* ------------------------------------------------------------------ *
 * Sparkle particles
 * ------------------------------------------------------------------ */

function createParticle(x: number, y: number) {
  const p = document.createElement("div");
  p.className = "poke-sparkle";
  const size = Math.random() * 16 + 8;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${x}px`;
  p.style.top = `${y}px`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1200);
}

function createSparkleStar() {
  const p = document.createElement("div");
  p.className = "poke-sparkle";
  const size = Math.random() * 26 + 12;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${
    window.innerWidth / 2 + (Math.random() - 0.5) * (window.innerWidth * 0.7)
  }px`;
  p.style.top = `${
    window.innerHeight / 2 + (Math.random() - 0.5) * (window.innerHeight * 0.6)
  }px`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1300);
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function InvitacionPage() {
  const isOpeningRef = useRef(false);

  const introOverlayRef = useRef<HTMLDivElement>(null);
  const pokeballRef = useRef<HTMLDivElement>(null);
  const floatContainerRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const centerBtnRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const promptBadgeRef = useRef<HTMLDivElement>(null);
  const releaseBeamRef = useRef<HTMLDivElement>(null);
  const invitationCardRef = useRef<HTMLDivElement>(null);

  const triggerCinematicOpen = useCallback(() => {
    if (isOpeningRef.current) return;
    isOpeningRef.current = true;

    const pokeball = pokeballRef.current;
    const floatContainer = floatContainerRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    const centerBtn = centerBtnRef.current;
    const pulseRing = pulseRingRef.current;
    const promptBadge = promptBadgeRef.current;
    const releaseBeam = releaseBeamRef.current;
    const introOverlay = introOverlayRef.current;
    const invitationCard = invitationCardRef.current;
    if (
      !pokeball ||
      !topHalf ||
      !bottomHalf ||
      !centerBtn ||
      !pulseRing ||
      !promptBadge ||
      !releaseBeam ||
      !introOverlay ||
      !invitationCard
    )
      return;

    const audioCtx = getAudioContext();

    // Disable prompt + continuous float during the throw
    pulseRing.style.display = "none";
    if (floatContainer) floatContainer.classList.remove("animate-float-poke");
    promptBadge.style.opacity = "0";
    promptBadge.style.transform = "translateY(15px)";

    // STEP 1: trainer throw + audio
    try {
      playThrowSound(audioCtx);
    } catch {
      /* no-op */
    }
    pokeball.classList.add("pokeball-throw-anim");

    const pokeRect = pokeball.getBoundingClientRect();
    const originX = pokeRect.left + pokeRect.width / 2;
    const originY = pokeRect.top + pokeRect.height / 2;
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createParticle(
          originX + (Math.random() - 0.5) * 60,
          originY + (Math.random() - 0.5) * 60
        );
      }, i * 30);
    }

    // STEP 2: at the apex (720ms) -> click + shells open
    setTimeout(() => {
      try {
        playPokeClick(audioCtx);
      } catch {
        /* no-op */
      }
      topHalf.classList.add("open-top-half");
      bottomHalf.classList.add("open-bottom-half");
      centerBtn.classList.add("hide-button");
    }, 720);

    // STEP 3: expanding light burst + release (850ms)
    setTimeout(() => {
      try {
        playChimeFlash(audioCtx);
      } catch {
        /* no-op */
      }
      releaseBeam.classList.add("beam-expand");
      for (let i = 0; i < 35; i++) createSparkleStar();
    }, 850);

    // STEP 4: smooth transition into the invitation (1250ms)
    setTimeout(() => {
      introOverlay.style.opacity = "0";
      introOverlay.style.pointerEvents = "none";
      invitationCard.classList.add("letter-slide-down");
    }, 1250);

    // Finally hide the overlay
    setTimeout(() => {
      introOverlay.classList.add("hidden");
    }, 1950);
  }, []);

  const resetAndShowIntro = useCallback(() => {
    isOpeningRef.current = false;
    const introOverlay = introOverlayRef.current;
    const pokeball = pokeballRef.current;
    const floatContainer = floatContainerRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    const centerBtn = centerBtnRef.current;
    const pulseRing = pulseRingRef.current;
    const promptBadge = promptBadgeRef.current;
    const releaseBeam = releaseBeamRef.current;
    const invitationCard = invitationCardRef.current;
    if (
      !introOverlay ||
      !pokeball ||
      !topHalf ||
      !bottomHalf ||
      !centerBtn ||
      !pulseRing ||
      !promptBadge ||
      !releaseBeam ||
      !invitationCard
    )
      return;

    pokeball.classList.remove("pokeball-throw-anim");
    topHalf.classList.remove("open-top-half");
    bottomHalf.classList.remove("open-bottom-half");
    centerBtn.classList.remove("hide-button");
    releaseBeam.classList.remove("beam-expand");
    invitationCard.classList.remove("letter-slide-down");
    if (floatContainer) floatContainer.classList.add("animate-float-poke");

    pulseRing.style.display = "block";
    promptBadge.style.opacity = "1";
    promptBadge.style.transform = "translateY(0)";

    introOverlay.classList.remove("hidden");
    introOverlay.style.pointerEvents = "auto";
    // Force reflow then fade in
    void introOverlay.offsetWidth;
    introOverlay.style.opacity = "1";
  }, []);

  return (
    <div className="invitacion-root bg-pokemon-sunburst fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden text-slate-800 antialiased selection:bg-amber-200">
      {/* Scoped styles — fonts + all original Stitch CSS */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Fredoka:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap");

        .invitacion-root {
          font-family: "Outfit", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka", sans-serif;
        }
        .font-cinzel {
          font-family: "Cinzel", serif;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.15;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
        }
        @keyframes ledPulse {
          0%,
          100% {
            box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8,
              inset 0 0 6px #ffffff;
            background-color: #e0f2fe;
          }
          50% {
            box-shadow: 0 0 20px #f59e0b, 0 0 35px #fde047,
              inset 0 0 8px #ffffff;
            background-color: #fef08a;
          }
        }
        @keyframes floatPokeball {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }
        .animate-float-poke {
          animation: floatPokeball 3.5s ease-in-out infinite;
        }
        @keyframes floatGentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        .animate-float {
          animation: floatGentle 5s ease-in-out infinite;
        }

        /* 3D pokéball */
        .pokeball-sphere {
          width: 145px;
          height: 145px;
          min-width: 145px;
          min-height: 145px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.75),
            0 0 55px rgba(245, 158, 11, 0.4),
            inset -8px -8px 24px rgba(0, 0, 0, 0.5),
            inset 8px 8px 20px rgba(255, 255, 255, 0.45);
          background-color: #1e293b;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease;
          transform-style: preserve-3d;
        }
        .pokeball-sphere:hover {
          transform: scale(1.08) rotate(4deg);
          box-shadow: 0 25px 55px -8px rgba(239, 68, 68, 0.65),
            0 0 65px rgba(245, 158, 11, 0.6),
            inset -8px -8px 24px rgba(0, 0, 0, 0.4),
            inset 8px 8px 20px rgba(255, 255, 255, 0.55);
        }
        .pokeball-top-half {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: radial-gradient(
            circle at 45% 28%,
            #ff6b6b 0%,
            #dc2626 55%,
            #991b1b 100%
          );
          border-top-left-radius: 145px;
          border-top-right-radius: 145px;
          border-bottom: 5px solid #111827;
          transform-origin: center top;
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 5;
        }
        .pokeball-top-half::after {
          content: "";
          position: absolute;
          top: 14px;
          left: 20px;
          width: 48px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(-25deg);
          pointer-events: none;
        }
        .pokeball-bottom-half {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: radial-gradient(
            circle at 50% 80%,
            #cbd5e1 0%,
            #f8fafc 50%,
            #ffffff 100%
          );
          border-bottom-left-radius: 145px;
          border-bottom-right-radius: 145px;
          border-top: 5px solid #111827;
          transform-origin: center bottom;
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 5;
        }
        .pokeball-bottom-half::after {
          content: "";
          position: absolute;
          bottom: 10px;
          right: 22px;
          width: 50px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.18) 0%,
            transparent 80%
          );
          pointer-events: none;
        }
        .pokeball-center-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          transition: transform 0.4s ease, opacity 0.3s ease;
        }
        .pokeball-inner-ring {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f8fafc;
          border: 3px solid #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25);
        }
        .pokeball-led {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          animation: ledPulse 1.8s infinite ease-in-out;
        }

        /* Cinematic throw + open */
        .pokeball-throw-anim {
          animation: animeThrow 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }
        @keyframes animeThrow {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          35% {
            transform: translateY(35px) scale(0.92) rotate(-8deg);
          }
          70% {
            transform: translateY(-160px) scale(1.25) rotate(380deg);
            box-shadow: 0 40px 70px rgba(245, 158, 11, 0.85),
              0 0 90px rgba(239, 68, 68, 0.9);
          }
          100% {
            transform: translateY(-130px) scale(1.18) rotate(720deg);
            box-shadow: 0 0 100px #fff, 0 0 80px #f59e0b;
          }
        }
        .open-top-half {
          transform: translateY(-68px) rotateX(45deg) !important;
        }
        .open-bottom-half {
          transform: translateY(68px) rotateX(-45deg) !important;
        }
        .hide-button {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.2) !important;
        }
        .release-beam {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #ffffff 15%,
            #fef08a 45%,
            #60a5fa 70%,
            transparent 90%
          );
          pointer-events: none;
          z-index: 40;
          opacity: 0;
        }
        .beam-expand {
          animation: expandBeam 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes expandBeam {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
          30% {
            opacity: 1;
            box-shadow: 0 0 120px 80px #fff, 0 0 220px 140px #fde047;
          }
          65% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(90);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(150);
          }
        }
        .letter-slide-down {
          animation: slideLetterDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideLetterDown {
          0% {
            opacity: 0;
            transform: translateY(-70px) scale(0.96);
          }
          70% {
            transform: translateY(8px) scale(1.008);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .poke-sparkle {
          position: absolute;
          background: radial-gradient(
            circle,
            #fff 15%,
            #fbbf24 65%,
            transparent 80%
          );
          border-radius: 50%;
          pointer-events: none;
          animation: sparkleFade 1.3s ease-out forwards;
          z-index: 70;
        }
        @keyframes sparkleFade {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1.8) rotate(180deg);
            opacity: 0;
          }
        }

        /* Festive background + cloud card */
        .bg-pokemon-sunburst {
          background-color: #29b6f6;
          background-image: radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(56, 189, 248, 0.1) 60%
            ),
            repeating-conic-gradient(
              from 0deg,
              #38bdf8 0deg 15deg,
              #0284c7 15deg 30deg
            );
          position: relative;
        }
        .poke-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 35%,
            rgba(255, 255, 255, 0.75) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.05) 85%
          );
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.4),
            inset -2px -2px 6px rgba(0, 0, 0, 0.08);
          pointer-events: none;
        }
        .pokemon-logo-text {
          font-family: "Fredoka", cursive, sans-serif;
          font-weight: 800;
          color: #ffcb05;
          text-transform: capitalize;
          letter-spacing: 1px;
          text-shadow: -3px -3px 0 #2a75bb, 3px -3px 0 #2a75bb,
            -3px 3px 0 #2a75bb, 3px 3px 0 #2a75bb, -5px -5px 0 #1b53ba,
            5px -5px 0 #1b53ba, -5px 5px 0 #1b53ba, 5px 5px 0 #1b53ba,
            0 8px 12px rgba(0, 0, 0, 0.35);
          display: inline-block;
          transform: perspective(300px) rotateX(8deg) scaleY(1.05);
        }
        .its-a-boy-title {
          font-family: "Fredoka", sans-serif;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 4px;
          text-shadow: -2px -2px 0 #0284c7, 2px -2px 0 #0284c7,
            -2px 2px 0 #0284c7, 2px 2px 0 #0284c7, 0 4px 0 #0369a1,
            0 6px 10px rgba(2, 132, 199, 0.3);
        }
        .scalloped-card {
          background: #ffffff;
          border-radius: 46px;
          box-shadow: 0 25px 60px -15px rgba(2, 132, 199, 0.35),
            0 0 0 10px #e0f2fe, 0 0 0 18px #7dd3fc,
            0 0 35px rgba(2, 132, 199, 0.25);
          position: relative;
        }
        .stitched-inner-border {
          border: 3px dashed #7dd3fc;
          border-radius: 36px;
        }
        .btn-poke-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.5),
            inset 0 2px 2px rgba(255, 255, 255, 0.3);
        }
        .btn-poke-gradient:hover {
          background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
          box-shadow: 0 12px 25px -4px rgba(2, 132, 199, 0.65);
        }
        .text-pokeBlue {
          color: #2a75bb;
        }
        .text-pokeDarkBlue {
          color: #1b53ba;
        }
      `}</style>

      {/* Ambient decorative bubbles */}
      <div className="poke-bubble w-28 h-28 top-8 left-8 opacity-75" />
      <div className="poke-bubble w-16 h-16 top-32 left-1/4 opacity-60" />
      <div className="poke-bubble w-36 h-36 top-16 right-12 opacity-70" />
      <div className="poke-bubble w-20 h-20 bottom-24 right-1/4 opacity-65" />
      <div className="poke-bubble w-24 h-24 bottom-12 left-12 opacity-80" />
      <div className="poke-bubble w-12 h-12 top-1/2 left-6 opacity-50" />
      <div className="poke-bubble w-14 h-14 bottom-1/3 right-8 opacity-60" />

      {/* Discrete floating replay button */}
      <button
        aria-label="Replay Pokébola"
        className="fixed top-4 right-4 z-40 bg-slate-900/80 hover:bg-slate-900 text-amber-300 hover:text-white px-3.5 py-2 rounded-full backdrop-blur-md border border-amber-300/40 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
        onClick={resetAndShowIntro}
      >
        <span className="text-sm">🔄</span>
        <span className="hidden sm:inline">Replay Pokébola</span>
      </button>

      {/* Welcome overlay (3D pokéball) */}
      <div
        ref={introOverlayRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-950/95 via-sky-950/90 to-slate-950/95 backdrop-blur-md transition-opacity duration-700"
      >
        <div className="absolute w-[480px] h-[480px] rounded-full bg-amber-400/20 blur-3xl -z-10 animate-pulse" />
        <div className="absolute w-[340px] h-[340px] rounded-full bg-red-500/25 blur-3xl -z-10" />
        <div className="absolute w-[280px] h-[280px] rounded-full bg-sky-400/20 blur-3xl -z-10" />

        <div ref={releaseBeamRef} className="release-beam" />

        <div className="text-center max-w-md mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg">
            <span className="text-amber-400">⚡</span>
            <span>¡TIENES UNA INVITACIÓN ESPECIAL!</span>
            <span className="text-amber-400">⚡</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-fredoka text-4xl md:text-5xl text-amber-300 drop-shadow-md">
              Baby Shower
            </h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide font-cinzel">
              Bastian Leonardo
            </h1>
            <p className="text-sky-200 text-sm font-medium">
              Un nuevo Maestro Pokémon está por llegar a nuestras vidas ✨
            </p>
          </div>

          <div
            aria-label="Abrir invitación de Baby Shower"
            role="button"
            tabIndex={0}
            className="relative py-4 flex flex-col items-center justify-center cursor-pointer group"
            onClick={triggerCinematicOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerCinematicOpen();
              }
            }}
          >
            <div
              ref={pulseRingRef}
              className="absolute w-48 h-48 rounded-full border-2 border-amber-300/50 pointer-events-none"
              style={{ animation: "pulseRing 2.2s infinite ease-out" }}
            />
            <div
              ref={floatContainerRef}
              className="p-1 flex items-center justify-center animate-float-poke"
            >
              <div ref={pokeballRef} className="pokeball-sphere">
                <div ref={topHalfRef} className="pokeball-top-half" />
                <div ref={bottomHalfRef} className="pokeball-bottom-half" />
                <div ref={centerBtnRef} className="pokeball-center-button">
                  <div className="pokeball-inner-ring">
                    <div className="pokeball-led" />
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={promptBadgeRef}
              className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.6)] border-2 border-white/80 transform group-hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="text-amber-700 text-sm">⚡</span>
              <span>PRESIONA LA POKÉBOLA PARA ABRIR</span>
              <span className="text-amber-700 text-sm">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main invitation canvas */}
      <main className="min-h-screen py-6 sm:py-12 px-3 sm:px-6 flex items-center justify-center relative z-10">
        <div
          ref={invitationCardRef}
          className="w-full max-w-4xl mx-auto relative transition-all duration-700"
        >
          <div className="scalloped-card relative z-10 p-4 sm:p-7 md:p-9 pt-8 overflow-hidden text-center">
            <div className="stitched-inner-border p-4 sm:p-7 md:p-8 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-sky-100 rounded-full blur-sm -z-10" />
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-sky-100 rounded-full blur-sm -z-10" />

              {/* 1. Header */}
              <div className="pt-2 pb-1">
                <div className="inline-block transform hover:scale-105 transition-transform duration-300">
                  <span className="pokemon-logo-text text-5xl sm:text-7xl md:text-8xl select-none">
                    Pokémon
                  </span>
                </div>
                <div className="mt-2 sm:mt-3">
                  <h2 className="its-a-boy-title text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider font-extrabold">
                    ¡ES UN NIÑO!
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="h-0.5 w-8 bg-sky-300 rounded-full" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-sky-600">
                      BABY SHOWER ESPECIAL
                    </span>
                    <span className="h-0.5 w-8 bg-sky-300 rounded-full" />
                  </div>
                </div>
              </div>

              {/* 2. Formal text + baby name */}
              <div className="my-4 sm:my-5 space-y-1">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-500 font-fredoka">
                  Acompáñanos a celebrar el Baby Shower en honor de
                </p>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-pokeBlue font-fredoka tracking-wide drop-shadow-sm py-1">
                  Bastian Leonardo
                </h1>
                <p className="text-xs sm:text-sm text-sky-800 italic font-medium">
                  &quot;Un nuevo Maestro Pokémon llega para alegrar nuestras
                  vidas&quot;
                </p>
              </div>

              {/* 3. Date + time */}
              <div className="my-5 max-w-md mx-auto py-3 px-4 bg-sky-50/90 rounded-2xl border-2 border-sky-200/80 shadow-sm">
                <div className="flex items-center justify-around divide-x-2 divide-sky-300">
                  <div className="flex-1 text-center px-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-600 block">
                      MES
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-pokeDarkBlue font-fredoka uppercase">
                      NOVIEMBRE
                    </span>
                  </div>
                  <div className="flex-1 text-center px-4">
                    <span className="inline-block px-3 py-0.5 bg-pokeBlue text-sky-600 text-[10px] font-bold rounded-full uppercase tracking-wider mb-0.5">
                      SÁBADO
                    </span>
                    <span className="text-4xl sm:text-5xl font-black text-pokeDarkBlue font-fredoka leading-none block">
                      14
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 block mt-0.5">
                      2026
                    </span>
                  </div>
                  <div className="flex-1 text-center px-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-600 block">
                      HORA
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-pokeDarkBlue font-fredoka">
                      2:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Countdown */}
              <Countdown targetDate={new Date("November 14, 2026 14:00:00")} />

              {/* 5. Location */}
              <div className="my-5 max-w-md mx-auto space-y-2">
                <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-white/90 p-3 rounded-2xl border border-sky-200 shadow-sm">
                  <p className="font-bold text-sky-950 text-sm">
                    📍 Salón de Eventos / Lugar de Reunión
                  </p>
                  <p>Caranday 2, Sector Creta, Casa #137</p>
                  <p>
                    Rancho Santa Monica, CP 20286,
                    <strong className="text-sky-900">Aguascalientes</strong>
                  </p>
                </div>
                <a
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all hover:scale-105"
                  href="https://www.google.com/maps/place/Caranday+II+sector+Creta/@21.8226788,-102.3267322,17.28z/data=!4m10!1m2!2m1!1sResidencial+Caranday+II,+sector+creta!3m6!1s0x8429ed00261e8aeb:0xfe2309647956eb4e!8m2!3d21.822088!4d-102.3246754!15sCiVSZXNpZGVuY2lhbCBDYXJhbmRheSBJSSwgc2VjdG9yIGNyZXRhkgETY29uZG9taW5pdW1fY29tcGxleOABAA!16s%2Fg%2F11z8jl56_w?entry=ttu&g_ep=EgoyMDI2MTAxOC4wIKXMDSoASAFQAw%3D%3D"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    className="w-4 h-4 text-amber-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span>VER UBICACIÓN EN GOOGLE MAPS</span>
                </a>
              </div>

              {/* 6. Gift registry */}
              <div className="my-5 max-w-md mx-auto flex items-center justify-center gap-3 p-3 bg-amber-50/90 rounded-2xl border border-amber-200 text-left shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 shadow">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.5 13.5c-.2-.2-.5-.2-.7 0-1 1-2.4 1.6-3.8 1.6-2.5 0-4.5-1.7-4.9-4h10.4c.3 0 .5-.2.5-.5 0-3.9-3.1-7.1-7-7.1-3.9 0-7 3.2-7 7.1 0 3.7 2.9 6.7 6.6 7 2.1.2 4.1-.4 5.7-1.7.3-.2.3-.5.1-.7l-.9-.7zm-8.4-5c.4-1.9 2-3.3 3.9-3.3 1.9 0 3.5 1.4 3.9 3.3H7.1z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  <strong className="text-slate-900">
                    Mesa de regalos en Amazon opcional.
                  </strong>
                  <br />
                  Cualquier detalle o pañales que elijas con cariño para Bastian
                  será bienvenido.
                </p>
              </div>

              {/* 7. RSVP button */}
              <div className="my-5 max-w-md mx-auto space-y-2">
                <a
                  className="btn-poke-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-black text-sm tracking-widest uppercase transition-all transform hover:-translate-y-0.5 border-2 border-white/80"
                  href="https://api.whatsapp.com/send?phone=5214492918138&text=Hola%20Naty%2C%20cuenta%20con%20mi%20presencia%20ese%20d%C3%ADa!%F0%9F%8C%9F"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    className="w-5 h-5 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <span>¡CONFIRMAR ASISTENCIA (ASISTIRÉ)!</span>
                </a>
                <p className="text-[11px] text-slate-500 italic max-w-xs mx-auto">
                  Por favor confirma tu asistencia para consentir a mamá y
                  preparar la mejor aventura.
                </p>
              </div>

              {/* Mini footer */}
              <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-sky-700">
                <span>✨ Baby Shower Bastian Leonardo 2026</span>
                <button
                  className="text-sky-800 font-bold hover:underline flex items-center gap-1"
                  onClick={playFanfare}
                >
                  <span>🔔 Tocar campana festiva</span>
                </button>
              </div>
            </div>

            {/* Squirtle — bottom-left */}
            <div className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-4 w-28 sm:w-36 md:w-44 z-20 pointer-events-none drop-shadow-xl animate-float">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="65" cy="140" fill="#c2410c" rx="30" ry="40" stroke="#1e293b" strokeWidth="4" />
                <ellipse cx="65" cy="140" fill="#fb923c" rx="26" ry="36" />
                <path d="M 45 140 Q 65 125 85 140" fill="none" stroke="#fff" strokeWidth="4" />
                <path d="M 50 140 L 40 160" stroke="#fff" strokeWidth="4" />
                <path d="M 35 155 Q 15 140 25 120 Q 35 105 50 120" fill="#7dd3fc" stroke="#1e293b" strokeWidth="4" />
                <ellipse cx="110" cy="135" fill="#7dd3fc" rx="42" ry="45" stroke="#1e293b" strokeWidth="5" />
                <path d="M 85 110 Q 120 105 135 130 Q 125 170 85 165 Z" fill="#fef08a" stroke="#1e293b" strokeWidth="4" />
                <line stroke="#ca8a04" strokeWidth="3" x1="88" x2="130" y1="135" y2="135" />
                <line stroke="#ca8a04" strokeWidth="3" x1="108" x2="108" y1="110" y2="165" />
                <ellipse cx="80" cy="175" fill="#7dd3fc" rx="16" ry="12" stroke="#1e293b" strokeWidth="4" />
                <ellipse cx="130" cy="175" fill="#7dd3fc" rx="16" ry="12" stroke="#1e293b" strokeWidth="4" />
                <circle cx="118" cy="75" fill="#7dd3fc" r="42" stroke="#1e293b" strokeWidth="5" />
                <ellipse cx="102" cy="70" fill="#991b1b" rx="9" ry="14" stroke="#1e293b" strokeWidth="3" />
                <circle cx="100" cy="65" fill="#ffffff" r="4" />
                <ellipse cx="135" cy="70" fill="#991b1b" rx="9" ry="14" stroke="#1e293b" strokeWidth="3" />
                <circle cx="133" cy="65" fill="#ffffff" r="4" />
                <path d="M 98 88 Q 118 110 140 88 Z" fill="#dc2626" stroke="#1e293b" strokeWidth="4" />
                <path d="M 104 94 Q 118 106 132 94" fill="#fda4af" />
                <path d="M 76 95 Q 52 75 58 58 Q 70 58 84 80 Z" fill="#7dd3fc" stroke="#1e293b" strokeWidth="4" />
                <circle cx="58" cy="58" fill="#7dd3fc" r="5" />
                <ellipse cx="152" cy="120" fill="#7dd3fc" rx="10" ry="16" stroke="#1e293b" strokeWidth="4" transform="rotate(25 152 120)" />
              </svg>
            </div>

            {/* Pikachu — bottom-right */}
            <div
              className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 w-28 sm:w-36 md:w-44 z-20 pointer-events-none drop-shadow-xl animate-float"
              style={{ animationDelay: "-2s" }}
            >
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 65 55 Q 35 25 30 5 Q 48 10 75 42 Z" fill="#facc15" stroke="#1e293b" strokeWidth="4" />
                <path d="M 30 5 Q 38 7 42 18 L 32 12 Z" fill="#1e293b" />
                <path d="M 125 50 Q 155 20 170 5 Q 158 20 138 45 Z" fill="#facc15" stroke="#1e293b" strokeWidth="4" />
                <path d="M 170 5 Q 160 16 150 20 L 165 10 Z" fill="#1e293b" />
                <path d="M 150 140 L 175 125 L 165 110 L 185 95" stroke="#ca8a04" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" />
                <path d="M 150 140 L 175 125 L 165 110 L 185 95" stroke="#facc15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
                <ellipse cx="98" cy="140" fill="#facc15" rx="42" ry="40" stroke="#1e293b" strokeWidth="5" />
                <ellipse cx="98" cy="85" fill="#facc15" rx="38" ry="34" stroke="#1e293b" strokeWidth="5" />
                <circle cx="70" cy="95" fill="#ef4444" r="9" />
                <circle cx="126" cy="95" fill="#ef4444" r="9" />
                <circle cx="82" cy="78" fill="#1e293b" r="6" />
                <circle cx="80" cy="76" fill="#ffffff" r="2" />
                <circle cx="114" cy="78" fill="#1e293b" r="6" />
                <circle cx="112" cy="76" fill="#ffffff" r="2" />
                <circle cx="98" cy="84" fill="#1e293b" r="1.5" />
                <path d="M 90 90 Q 98 96 106 90" fill="none" stroke="#1e293b" strokeWidth="3" />
                <path d="M 94 92 Q 98 102 102 92 Z" fill="#dc2626" />
                <path d="M 125 115 Q 148 100 145 90 Q 135 90 125 105 Z" fill="#facc15" stroke="#1e293b" strokeWidth="4" />
                <path d="M 72 120 Q 62 130 75 135 Z" fill="#facc15" stroke="#1e293b" strokeWidth="4" />
                <ellipse cx="80" cy="175" fill="#facc15" rx="14" ry="8" stroke="#1e293b" strokeWidth="4" />
                <ellipse cx="118" cy="175" fill="#facc15" rx="14" ry="8" stroke="#1e293b" strokeWidth="4" />
              </svg>
            </div>

            {/* Bulbasaur — top-right peek */}
            <div className="hidden sm:block absolute -top-3 -right-2 w-20 md:w-24 z-20 pointer-events-none drop-shadow-md">
              <svg className="w-full h-full" fill="none" viewBox="0 0 120 120">
                <path d="M 60 25 Q 40 45 48 70 Q 72 70 80 45 Z" fill="#15803d" stroke="#1e293b" strokeWidth="3" />
                <circle cx="60" cy="75" fill="#5eead4" r="30" stroke="#1e293b" strokeWidth="3" />
                <polygon fill="#5eead4" points="40,55 35,40 50,50" stroke="#1e293b" strokeWidth="2" />
                <polygon fill="#5eead4" points="80,55 85,40 70,50" stroke="#1e293b" strokeWidth="2" />
                <ellipse cx="50" cy="72" fill="#dc2626" rx="5" ry="7" stroke="#1e293b" strokeWidth="1.5" />
                <circle cx="48" cy="70" fill="#fff" r="1.5" />
                <ellipse cx="70" cy="72" fill="#dc2626" rx="5" ry="7" stroke="#1e293b" strokeWidth="1.5" />
                <circle cx="68" cy="70" fill="#fff" r="1.5" />
                <path d="M 52 82 Q 60 88 68 82" fill="none" stroke="#1e293b" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
