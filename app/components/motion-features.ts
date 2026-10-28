/*
  framer-motion feature bundle, loaded lazily by MotionProvider.

  domAnimation covers animate/exit, variants, whileInView and the hover/tap
  gestures used across (site). It does NOT include layout animations or drag
  (those live in domMax), so avoid `layout`/`layoutId` under MotionProvider.
*/
import { domAnimation } from "framer-motion";

export default domAnimation;
