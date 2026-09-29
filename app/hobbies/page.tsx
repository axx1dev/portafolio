"use client";

import { motion } from "framer-motion";
import { Reveal, StaggerGroup, StaggerItem } from "../components/motion";

/* Hobbies: Casa vs Calle — indoor ops (CASA) and asphalt ops (CALLE). */

const ANIME = [
  {
    tag: "> JJK",
    sub: "Cursed Energy Protocols",
    accent: "cyan" as const,
    img: "https://i0.wp.com/teamgeek.mx/wp-content/uploads/2025/09/wp8536793-jujutsu-kaisen-group-wallpapers.jpg?fit=1920%2C1080&ssl=1",
  },
  {
    tag: "> POKEMON",
    sub: "Digital Fauna Archive",
    accent: "violet" as const,
    img: "https://media.vandal.net/i/640x360/3-2019/20193116333055_1.jpg",
  },
  {
    tag: "> ONE_PIECE",
    sub: "Grand Line Mapping",
    accent: "cyan" as const,
    img: "https://fotografias-neox.atresmedia.com/clipping/cmsimages02/2022/03/09/CB79D59E-4D36-4887-A17B-14796E0788BE/one-piece_98.jpg?crop=640,360,x0,y0&width=1900&height=1069&optimize=high&format=webply",
  },
  {
    tag: "> DEMON_SLAYER",
    sub: "Breathing Techniques",
    accent: "violet" as const,
    img: "https://www.televisa.com/_next/image?url=https%3A%2F%2Fst1.uvnimg.com%2F84%2Fbb%2Ffa2a87f2412fa7ef73420ba0588f%2Fbe2e638d85b8495f8d3b2098c7430c3c&w=1280&q=75",
  },
];

const GAMES = [
  { name: "Halo", tag: "Shooter", accent: "cyan" as const },
  { name: "Street Fighter", tag: "Fights", accent: "cyan" as const },
  { name: "Mortal Kombat 1", tag: "Fights", accent: "cyan" as const },
  { name: "Crash Bandicoot", tag: "Adventures", accent: "cyan" as const },
];

const BIKES = [
  {
    name: "Kawa_ZX6",
    cc: "636CC",
    accent: "cyan" as const,
    specs: [
      ["Type", "Inline-Four"],
      ["Status", "Track-Ready"],
      ["Aesthetic", "Mid-weight Precision"],
    ],
    img: "https://www.motorcyclenews.com/wp-images/225617/2024-kawasaki-zx-6r-review-01.jpg",
  },
  {
    name: "Suzi_GSXR_750",
    cc: "750CC",
    accent: "violet" as const,
    specs: [
      ["Type", "Inline-Four"],
      ["Status", "The Perfect Balance"],
      ["Aesthetic", "Heritage Speed"],
    ],
    img: "https://soymotero.net/wp-content/uploads/2026/08/2027_Sportbike_GSX-R750_PPH_2500x1227.jpg",
  },
  {
    name: "Yama_R1/R6",
    cc: "1000/600_CC",
    accent: "cyan" as const,
    specs: [
      ["Type", "Crossplane/Inline"],
      ["Status", "High-RPM Ops"],
      ["Aesthetic", "Aerodynamic Aggression"],
    ],
    img: "https://motoriwata.com/wp-content/uploads/2022/09/2025-Yamaha-YZF1000R1COMP-EU-Tech_Black-Static-003-03.jpg",
  },
  {
    name: "Kawa_Z900",
    cc: "948CC",
    accent: "violet" as const,
    specs: [
      ["Type", "Naked Inline-Four"],
      ["Status", "Street Brawler"],
      ["Aesthetic", "Raw Torque"],
    ],
    img: "https://static.wixstatic.com/media/2b21bf_eb365d01998a488fa41c379edc8e81c7~mv2.jpg/v1/fill/w_588,h_392,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2b21bf_eb365d01998a488fa41c379edc8e81c7~mv2.jpg",
  },
];

function gameTagClass(accent: "cyan" | "violet" | "muted") {
  if (accent === "cyan")
    return "text-[10px] bg-electric-cyan/10 text-electric-cyan px-2 py-1 border border-electric-cyan/20";
  if (accent === "violet")
    return "text-[10px] bg-lavender-dust/10 text-lavender-dust px-2 py-1 border border-lavender-dust/20";
  return "text-[10px] bg-muted-violet/20 text-muted-violet px-2 py-1 border border-glass-edge";
}

export default function HobbiesPage() {
  return (
    <main className="pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* ---------------- HEADER ---------------- */}
      <header className="mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className="w-8 h-px bg-electric-cyan" />
          <span className="font-label-caps text-label-caps text-electric-cyan uppercase tracking-[0.3em]">
            System Identity
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-6"
        >
          HOBBIES<span className="text-electric-cyan">.LOG</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body-lg text-body-lg text-lavender-dust max-w-2xl border-l-2 border-muted-violet pl-4"
        >
          Categorized into routines for home and street—it’s a little bit of what I’m passionate about.   
        </motion.p>
      </header>

      {/* ---------------- SECTION: CASA ---------------- */}
      <section className="mb-section-gap">
        <Reveal className="flex items-center gap-4 mb-12 border-b border-glass-edge pb-4">
          <span className="material-symbols-outlined text-electric-cyan text-3xl">
            home
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
            &gt; HOME <span className="text-muted-violet">[INDOOR_OPS]</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Anime gallery */}
          <div className="md:col-span-8 space-y-6">
            <h3 className="font-mono-ui text-mono-ui text-lavender-dust uppercase tracking-widest border-l-2 border-electric-cyan pl-2">
              01. Visual_Intake // Anime
            </h3>
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ANIME.map((item) => (
                <StaggerItem key={item.tag}>
                  <div
                    className={`group relative aspect-video bg-surface-container border border-glass-edge overflow-hidden transition-all duration-500 clipped-corner ${
                      item.accent === "cyan"
                        ? "hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)]"
                        : "hover:border-lavender-dust/50 hover:shadow-[0_0_30px_rgba(178,152,220,0.15)]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.tag.replace("> ", "")}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-obsidian-base to-transparent">
                      <span
                        className={`font-label-caps text-label-caps block mb-1 ${
                          item.accent === "cyan"
                            ? "text-electric-cyan"
                            : "text-lavender-dust"
                        }`}
                      >
                        {item.tag}
                      </span>
                      <span className="font-mono-ui text-[12px] text-lavender-dust">
                        {item.sub}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Gaming & Gym */}
          <div className="md:col-span-4 flex flex-col gap-gutter">
            <Reveal className="h-full">
              <div className="h-full bg-surface-container border border-glass-edge p-6 clipped-corner hover:border-muted-violet transition-colors duration-500">
                <h3 className="font-mono-ui text-mono-ui text-lavender-dust uppercase tracking-widest border-l-2 border-muted-violet pl-2 mb-6">
                  02. Video_games_Deck
                </h3>
                <ul className="space-y-4 font-mono-ui text-body-md text-on-surface-variant">
                  {GAMES.map((g) => (
                    <li key={g.name} className="flex items-center gap-3">
                      <span className="text-electric-cyan">&gt;</span>
                      <span className="flex-1">{g.name}</span>
                      <span className={gameTagClass(g.accent)}>{g.tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-surface-container border border-glass-edge p-6 clipped-corner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="font-mono-ui text-mono-ui text-electric-cyan uppercase tracking-widest border-l-2 border-electric-cyan pl-2 mb-4">
                  03. Workout
                </h3>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-lavender-dust text-4xl">
                    fitness_center
                  </span>
                  <div>
                    <h4 className="font-headline-md text-[18px] text-on-surface mb-2">
                      GYM
                    </h4>
                    <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
                      The moment to dropped stress and make physical activit, the  developer job is been seated and back of the computer always, is very important to activate.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION: CALLE ---------------- */}
      <section>
        <Reveal className="flex items-center gap-4 mb-12 border-b border-glass-edge pb-4">
          <span className="material-symbols-outlined text-lavender-dust text-3xl">
            two_wheeler
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
            &gt; STREET <span className="text-muted-violet">[ASPHALT_OPS]</span>
          </h2>
        </Reveal>

        <h3 className="font-mono-ui text-mono-ui text-electric-cyan uppercase tracking-widest border-l-2 border-electric-cyan pl-2 mb-8">
          My favorite SuperSports
        </h3>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BIKES.map((bike) => {
            const isCyan = bike.accent === "cyan";
            return (
              <StaggerItem key={bike.name}>
                <div
                  className={`group bg-surface-container border border-glass-edge transition-all duration-500 clipped-corner flex flex-col md:flex-row h-auto md:h-[240px] overflow-hidden ${
                    isCyan
                      ? "hover:border-electric-cyan hover:shadow-[0_0_40px_rgba(0,243,255,0.15)]"
                      : "hover:border-lavender-dust hover:shadow-[0_0_40px_rgba(178,152,220,0.15)]"
                  }`}
                >
                  <div className="w-full md:w-1/2 h-[200px] md:h-full relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bike.img}
                      alt={bike.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent md:hidden block" />
                  </div>
                  <div className="w-full md:w-1/2 p-6 flex flex-col justify-center relative z-10">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4
                        className={`font-headline-md text-[20px] tracking-tight ${
                          isCyan ? "text-electric-cyan" : "text-lavender-dust"
                        }`}
                      >
                        {bike.name}
                      </h4>
                      <span
                        className={`font-mono-ui text-[10px] text-obsidian-base px-2 py-0.5 font-bold tracking-widest clipped-corner ${
                          isCyan ? "bg-electric-cyan" : "bg-lavender-dust"
                        }`}
                      >
                        {bike.cc}
                      </span>
                    </div>
                    <div
                      className={`h-px w-full bg-glass-edge mb-4 transition-colors ${
                        isCyan
                          ? "group-hover:bg-electric-cyan/30"
                          : "group-hover:bg-lavender-dust/30"
                      }`}
                    />
                    <ul className="font-mono-ui text-[13px] text-lavender-dust space-y-2">
                      {bike.specs.map(([k, v]) => (
                        <li key={k}>
                          <span className="text-muted-violet">{k}:</span> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>
    </main>
  );
}
