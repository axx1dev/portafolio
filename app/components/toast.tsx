"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export type ToastKind = "success" | "error";

export type ToastState = {
  kind: ToastKind;
  message: string;
} | null;

/*
  Fixed, bottom-right toast that matches the neon look and feel.
  Rendered via a portal into document.body so it floats above every
  container (avoiding clip-path / stacking-context clipping on pages).
  - success -> electric-cyan
  - error   -> a muted (tenue) red
*/
export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState;
  onDismiss: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isSuccess = toast?.kind === "success";

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-end px-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            onClick={onDismiss}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-5 py-4 backdrop-blur-md cursor-pointer max-w-sm ${
              isSuccess
                ? "border-electric-cyan/40 bg-electric-cyan/10 text-electric-cyan shadow-[0_0_25px_rgba(0,243,255,0.2)]"
                : "border-error/30 bg-error/10 text-error shadow-[0_0_25px_rgba(147,0,10,0.2)]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {isSuccess ? "check_circle" : "error"}
            </span>
            <span className="font-mono-ui text-mono-ui">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
