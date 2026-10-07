import Image from "next/image";

const LOGO_URL = "/logo.png";

const SOCIALS = [
  { label: "GITHUB", href: "https://github.com/axx1dev" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/axel-palacios-66a8aa118/" },
];

export function Footer() {
  return (
    <footer className="relative z-10 w-full py-20 px-margin-mobile md:px-margin-desktop border-t border-glass-edge bg-obsidian-base mb-24 md:mb-0">
      <div className="grid grid-cols-12 gap-base max-w-container-max mx-auto">
        <div className="col-span-12 md:col-span-6 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8">
              <Image
                src={LOGO_URL}
                alt="SYSTEM_ARCHITECT logo"
                width={32}
                height={32}
                className="object-contain opacity-80"
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
