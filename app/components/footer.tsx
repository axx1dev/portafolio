const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBgm6wlQGhUzj1SNcVFxrtCwNeikwXhnfvX3WT6eDICCvxWddszlwLPZdnfJimiY3acTq8AMEhF3BL8puTrRw5POhCsvfnR5ie6tp_Hm-Jm6z6yVKu0cABkfGvZPxM2KWfeUkIn-dbdQf_yc7XvFX_n0fiHGko-WrAV-T-or6HoH9Rl6HzFVwV4iYOL2stTDKJc6TPkwaweakh_JhcnT6OZPAjLdZ_0E4yIpgO6UO0foaKRZKkEnf3V";

const SOCIALS = [
  { label: "GITHUB", href: "https://github.com/axel1vinn" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/axel-palacios-66a8aa118/" },
];

export function Footer() {
  return (
    <footer className="relative z-10 w-full py-20 px-margin-mobile md:px-margin-desktop border-t border-glass-edge bg-obsidian-base mb-24 md:mb-0">
      <div className="grid grid-cols-12 gap-base max-w-container-max mx-auto">
        <div className="col-span-12 md:col-span-6 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_URL}
                alt="SYSTEM_ARCHITECT logo"
                className="h-full w-full object-contain opacity-80"
              />
            </div>
            <span className="font-label-caps text-label-caps text-muted-violet">
              AXEL_PALACIOS
            </span>
          </div>
          <p className="font-mono-ui text-mono-ui text-lavender-dust">
            ©2026 FULLSTACK_ENGINEER.ALL_RIGHTS_RESERVED.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-wrap gap-8 justify-start md:justify-end items-end mt-8 md:mt-0">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-ui text-mono-ui text-muted-violet hover:text-electric-cyan transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
