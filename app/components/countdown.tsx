"use client";

import { useEffect, useState } from "react";

/*
  Countdown — regresive timer (days / hours / minutes / seconds) that
  counts down to a target date. Used by the Pokémon Baby Shower
  invitation ("¿CUÁNTO FALTA PARA CONOCERLO?" section).

  The default target is Saturday, November 14 2026 at 2:00 PM.
  Styling matches the Stitch invitation card exactly.
*/

type TimeLeft = {
  days: string;
  hours: string;
  mins: string;
  secs: string;
};

const ZERO: TimeLeft = { days: "0", hours: "00", mins: "00", secs: "00" };

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function computeTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return ZERO;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days),
    hours: pad(hours),
    mins: pad(mins),
    secs: pad(secs),
  };
}

type CountdownProps = {
  /** Target date/time to count down to. Defaults to Nov 14 2026, 2:00 PM. */
  targetDate?: Date;
};

export function Countdown({ targetDate }: CountdownProps) {
  const target = (targetDate ?? new Date("November 14, 2026 14:00:00")).getTime();

  // Start empty on the server to avoid a hydration mismatch (the server and
  // client clocks differ). Once mounted, a 1s interval drives the ticks and
  // also produces the very first client-side value.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(computeTimeLeft(target)), 1000);
    // Paint the first value on the next frame so we don't setState
    // synchronously inside the effect body.
    const raf = requestAnimationFrame(() => setTimeLeft(computeTimeLeft(target)));
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [target]);

  const t = timeLeft ?? ZERO;

  const cells: { value: string; label: string; accent?: boolean }[] = [
    { value: t.days, label: "DÍAS" },
    { value: t.hours, label: "HORAS" },
    { value: t.mins, label: "MINUTOS" },
    { value: t.secs, label: "SEGUNDOS", accent: true },
  ];

  return (
    <div className="my-5 bg-gradient-to-r from-sky-100/60 via-amber-50/70 to-sky-100/60 rounded-2xl p-3 sm:p-4 border border-sky-200 max-w-lg mx-auto">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-amber-500 text-xs">⚡</span>
        <span className="text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-sky-900 font-fredoka">
          ¿CUÁNTO FALTA?
        </span>
        <span className="text-amber-500 text-xs">⚡</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="bg-white/95 p-2 rounded-xl shadow-sm border border-sky-100"
          >
            <span
              className={`block text-xl sm:text-2xl font-black font-fredoka tabular-nums ${
                cell.accent ? "text-amber-500" : "text-pokeDarkBlue"
              }`}
            >
              {cell.value}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
