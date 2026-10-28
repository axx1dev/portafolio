"use client";

import { useEffect, useState } from "react";

/*
  Reports whether a CSS media query matches.

  The initial value is read synchronously on the client's first render (not
  after an effect) so consumers that only feed animation config — like
  MotionConfig's reducedMotion — get the right answer before framer-motion
  creates its visual elements. On the server it returns `false`.

  Only use it for values that do NOT change the rendered markup; otherwise
  the server/client difference would cause a hydration mismatch.
*/
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
