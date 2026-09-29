"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "../components/motion";
import { Toast, type ToastState } from "../components/toast";

/* Contact: The Final Boss — comm-link header, status card and transmit form. */

type Status = "idle" | "sending" | "sent";

const SOCIALS = [
  { label: "GITHUB", href: "https://github.com/axel1vinn" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/axel-palacios-66a8aa118/" },
];

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<ToastState>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // All three fields must be filled before a message can be sent.
  const isComplete =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.message.trim() !== "";

  function updateField(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    // Guard: never send if any field is empty.
    if (!isComplete) {
      setToast({ kind: "error", message: "Please fill in all fields." });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("sent");
      setToast({ kind: "success", message: "Message sent successfully." });
      setForm({ name: "", email: "", message: "" });
      // Return the button to its idle state after a short beat.
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("idle");
      setToast({
        kind: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <main className="pt-32 md:pt-40 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[90vh] flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        {/* Left column: header + status */}
        <Reveal className="md:col-span-5 md:col-start-2 mb-12 md:mb-0">
          <div className="font-mono-ui text-mono-ui text-electric-cyan mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-electric-cyan block" />
            COMMUNICATION PROTOCOL
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white mb-6 uppercase tracking-tight">
            CONTACT_ME
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-12 max-w-md">
            Secure channel ready for transmission. Initiate handshake below to
            transmit messages to me.
          </p>

          <div className="bg-surface-container-low border border-glass-edge p-6 card-clip relative overflow-hidden group">
            <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/5 transition-colors duration-500" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-3 h-3 rounded-full bg-terminal-green shadow-[0_0_10px_#39ff14] animate-pulse" />
              <span className="font-label-caps text-label-caps text-on-surface tracking-widest">
                SYSTEM STATUS: ONLINE
              </span>
            </div>
            <div className="flex flex-col gap-4 relative z-10">
              {SOCIALS.map((item) => (
                <a
                  target="_blank"
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 text-lavender-dust hover:text-electric-cyan transition-colors group/link"
                >
                  <span className="font-mono-ui text-mono-ui text-muted-violet group-hover/link:text-electric-cyan">
                    &gt;
                  </span>
                  <span className="font-mono-ui text-mono-ui border-b border-transparent group-hover/link:border-electric-cyan transition-all pb-0.5">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right column: form */}
        <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container border border-glass-edge p-8 md:p-10 card-clip shadow-[0_10px_40px_rgba(109,89,122,0.1)] backdrop-blur-sm relative group"
          >
            <div className="absolute inset-0 border border-electric-cyan/0 group-hover:border-electric-cyan/20 transition-colors duration-700 card-clip pointer-events-none" />
            <div className="space-y-8 relative z-10">
              <div className="group/input">
                <label
                  className="block font-label-caps text-label-caps text-muted-violet mb-2 group-focus-within/input:text-electric-cyan transition-colors"
                  htmlFor="identity"
                >
                  IDENTITY_ALIAS
                </label>
                <input
                  id="identity"
                  name="identity"
                  type="text"
                  required
                  value={form.name}
                  onChange={updateField("name")}
                  disabled={status === "sending"}
                  placeholder="Enter designated name"
                  className="w-full bg-transparent border-0 border-b border-muted-violet text-on-surface font-mono-ui text-mono-ui py-2 px-0 focus:ring-0 focus:border-electric-cyan transition-colors placeholder:text-surface-bright disabled:opacity-50"
                />
              </div>

              <div className="group/input">
                <label
                  className="block font-label-caps text-label-caps text-muted-violet mb-2 group-focus-within/input:text-electric-cyan transition-colors"
                  htmlFor="route"
                >
                  EMAIL_ADDRESS
                </label>
                <input
                  id="route"
                  name="route"
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField("email")}
                  disabled={status === "sending"}
                  placeholder="name@domain.ext"
                  className="w-full bg-transparent border-0 border-b border-muted-violet text-on-surface font-mono-ui text-mono-ui py-2 px-0 focus:ring-0 focus:border-electric-cyan transition-colors placeholder:text-surface-bright disabled:opacity-50"
                />
              </div>

              <div className="group/input">
                <label
                  className="block font-label-caps text-label-caps text-muted-violet mb-2 group-focus-within/input:text-electric-cyan transition-colors"
                  htmlFor="payload"
                >
                  TRANSMISSION_PAYLOAD
                </label>
                <textarea
                  id="payload"
                  name="payload"
                  rows={4}
                  required
                  value={form.message}
                  onChange={updateField("message")}
                  disabled={status === "sending"}
                  placeholder="Input data sequence here..."
                  className="w-full bg-transparent border-0 border-b border-muted-violet text-on-surface font-mono-ui text-mono-ui py-2 px-0 focus:ring-0 focus:border-electric-cyan transition-colors resize-none placeholder:text-surface-bright disabled:opacity-50"
                />
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={status === "sending" || !isComplete}
                  whileHover={
                    status === "idle" && isComplete ? { scale: 1.02 } : undefined
                  }
                  whileTap={
                    status === "idle" && isComplete ? { scale: 0.98 } : undefined
                  }
                  className={`w-full font-label-caps text-label-caps py-4 btn-clip transition-colors flex items-center justify-center gap-2 group/btn ${
                    status === "sent"
                      ? "bg-terminal-green text-obsidian-base"
                      : "bg-electric-cyan text-obsidian-base hover:bg-primary"
                  } ${status === "sending" ? "opacity-80 cursor-wait" : ""} ${
                    !isComplete && status !== "sent"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={status}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      {status === "idle" && (
                        <>
                          INITIALIZE_TRANSFER
                          <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </>
                      )}
                      {status === "sending" && (
                        <>
                          TRANSMITTING
                          <span className="material-symbols-outlined text-sm animate-spin">
                            progress_activity
                          </span>
                        </>
                      )}
                      {status === "sent" && (
                        <>
                          PACKET_DELIVERED
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </form>
        </Reveal>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}
