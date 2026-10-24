import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Axel Palacios Fullstack Engineer",
  description: "Axel Palacios - Fullstack Developer, Lead Frontend Engineer, Backend Developer, and Technical Lead."
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} dark`}>
      <body className="bg-obsidian-base text-on-background font-body-md min-h-screen relative overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
