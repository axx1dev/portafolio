import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { FontLoader } from "./components/font-loader";
import { PageTransitionWrapper } from "./components/page-transition-wrapper";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SYSTEM_INITIALIZED :: Axel Palacios Fullstack Engineer",
  description:
    "Fullstack Developer & Performance Enthusiast. Architecting scalable digital environments while balancing the high-velocity chaos of the physical world with disciplined precision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} dark`}>
      <body className="bg-obsidian-base text-on-background font-body-md min-h-screen relative overflow-x-hidden antialiased">
        <FontLoader />
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
      </body>
    </html>
  );
}
