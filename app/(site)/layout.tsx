import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { PageTransitionWrapper } from "../components/page-transition-wrapper";
import { MotionProvider } from "../components/motion-provider";

/*
  (site) layout — the shared portfolio chrome: ambient glows, scanlines,
  navbar, animated page transitions and footer. Wraps the main journey
  (home, hobbies, work-cv, contact).

  MotionProvider wraps everything that animates so framer-motion loads its
  features lazily (LazyMotion + m.*) and simplifies animations on mobile.

  Immersive full-screen routes (e.g. /invitacion) live in the (bare) group
  instead, so this chrome never renders in their server HTML — no flash of
  footer/navbar on reload.
*/

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      {/* Ambient atmospheric glows shared across the journey */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-lavender-dust/5 blur-[200px] rounded-full" />
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines z-50 mix-blend-overlay opacity-40" />

      <Navbar />

      <PageTransitionWrapper>{children}</PageTransitionWrapper>

      <Footer />
    </MotionProvider>
  );
}
