"use client";

import { motion } from "framer-motion";
import { Reveal, StaggerGroup, StaggerItem } from "../components/motion";

/* Work & CV: Technical Stack — tech grid bento + execution-history timeline. */

const LANGUAGES = ["JavaScript", "TypeScript", "Golang", "PHP"];
const FRONTEND = [
  "ReactJS",
  "React Native",
  "NextJS",
  "Vue",
  "Angular",
  "Redux Toolkit",
  "Context API",
];
const BACKEND = [
  "Node.js",
  "Express",
  "Koa",
  "Sequelize",
  "Echo",
  "Revel",
  "Lumen",
  "Laravel",
  "Eloquent",
  "Puppeteer",
];
const STYLING = [
  "SCSS",
  "CSS",
  "CSS3",
  "HTML",
  "HTML5",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
];
const BUILD_TOOLS = ["Vite", "Webpack", "Babel"];
const DATA_LAYER = ["GraphQL", "Contentful", "VTEX IO", "VTEX Faststore",];
const DATABASES = [
  "MySQL",
  "PostgreSQL",
  "RDS",
  "MongoDB",
  "DynamoDB",
  "Master Data V1 & V2 (VTEX)",
];
const CLOUD_DEVOPS = [
  "AWS (Lambda, S3, EC2, CloudFormation, API Gateway)",
  "GCP (Firebase)",
  "CI/CD with GitHub Actions",
  "Docker",
  "Git & Git pre-commit hooks",
  "JWT & Auth0",
  "ESLint & SonarQube",
];
const METHODOLOGIES = [
  "Asana & Jira",
  "Figma & Design Systems",
  "SCRUM & Agile",
];

const EXPERIENCE = [
  {
    icon: "developer_mode",
    role: "Frontend Tech Lead",
    company: "Vinneren",
    location: "Álvaro Obregón, Ciudad de México",
    period: "JUN 2023 - PRESENT",
    accent: "cyan" as const,
    points: [
      "In charge of project estimation, decision making and proposing alternatives for client requirements; managing workflows, roadmaps and discovery sessions; handling resource allocation, interviews and hiring; supporting project analysis and developer growth through one-on-ones and career plans; and enhancing software development via code reviews, pair programming and the implementation of new technologies.",
      "Soft skills include adaptability, problem-solving, decision-making, proactive communication, teamwork, time management, peer support and project leadership.",
      "Responsible for development of new modules, improving user experience, and maintaining and improving the performance of the platform with multiple technologies such as ReactJS, NextJS, Jest, GraphQL, VTEX IO, Node.js, Koa.js, Express.js, Redux, Zustand and Context for state management, and K6/Grafana for stress tests.",
      "Integration of AI into the development process to improve deployment pipelines and code quality with SonarQube; researching and building new platforms in hours with Stitch/Figma Make, Nano Banana and Antigravity (GCP) / Kiro (AWS, skills, steerings, hooks).",
    ],
  },
  {
    icon: "code",
    role: "Fullstack Developer (Freelance)",
    company: "Gladdi / Smart Teaching",
    location: "Las Arboledas, Aguascalientes",
    period: "JAN 2023 - JUN 2023",
    accent: "violet" as const,
    points: [
      "Fullstack Developer responsible for developing new modules, improving user experience, proposing solutions and making technical decisions to address diverse challenges.",
      "Developed middlewares, REST services, cron jobs and third-party API integrations using Sequelize, Node.js, Express.js, JWT and AWS services (S3, Rekognition, EC2, RDS).",
      "Built applications with Angular, Angular Material, Bootstrap, RxJS, TypeScript and JavaScript.",
      "Tools and methodologies: Jira, Bitbucket, Figma, E/R diagrams and SCRUM methodology.",
    ],
  },
  {
    icon: "web",
    role: "Frontend Developer",
    company: "Homie",
    location: "Av. Paseo de la Reforma 296, CDMX",
    period: "MAY 2022 - DEC 2022",
    accent: "cyan" as const,
    points: [
      "Developed enhancements, fixed issues and integrated third-party APIs.",
      "Built new modules with React and Next.js.",
      "Implemented unit and e2e testing using Jest and Cypress.",
      "Utilized Git pre-commit hooks for automated formatting and testing.",
      "Managed tasks with Asana and collaborated on designs via Figma.",
    ],
  },
  {
    icon: "shopping_cart",
    role: "Fullstack Developer",
    company: "Corebiz",
    location: "Blvd. Miguel de Cervantes Saavedra 25, CDMX",
    period: "APR 2020 - MAY 2022",
    accent: "violet" as const,
    points: [
      "Developed custom apps with React for VTEX (Brazilian ecommerce platform).",
      "Created ecommerce sites with technologies such as React, Node.js and GraphQL.",
      "Built layouts using Store Framework (VTEX).",
      "Consumed and created REST APIs, and used GraphQL on the client side.",
    ],
  },
  {
    icon: "dns",
    role: "Fullstack Developer",
    company: "Insaite",
    location: "Av. Ejército Nacional 351, CDMX",
    period: "MAY 2019 - MAR 2020",
    accent: "cyan" as const,
    points: [
      "Analysis, processing and resolution of problems, proposing solutions with algorithms and implementation in code.",
      "Development of web applications with React, React Native and Vue.",
      "Development of RESTful APIs with Go and Node.js.",
      "Cloud architecture with Microsoft Azure, Amazon AWS and GCP.",
      "Version control with Bitbucket and task management with Jira using SCRUM methodology.",
      "Used frameworks and services such as PuppeteerJS, Echo, Gorm, AWS SAM, EC2, S3, CloudFormation, API Gateway, RDS, DynamoDB, MySQL, PostgreSQL, MongoDB and Lambda.",
    ],
  },
  {
    icon: "account_balance",
    role: "Fullstack Developer Semi Sr.",
    company: "CPA Vision",
    location: "Polanco, Hegel 141, CDMX",
    period: "FEB 2017 - MAY 2019",
    accent: "violet" as const,
    points: [
      "Development of systems for accounting and finance.",
      "Used the MVC architecture pattern with PHP and the Laravel and Lumen frameworks.",
      "Microservices architecture in Go with the Revel framework.",
      "Used MySQL databases and GCP services.",
    ],
  },
];

export default function WorkCvPage() {
  return (
    <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* ---------------- HEADER ---------------- */}
      <section className="mb-32">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-6 relative inline-block group"
        >
          RESUME
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-muted-violet">
            HARDSKILLS
          </span>
          <div className="absolute -inset-4 bg-electric-cyan/10 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-muted-violet pl-6 py-2"
        >
          <span className="text-electric-cyan mr-2">&gt;</span> SYSTEM_STATUS:
          ONLINE. INITIALIZING KNOWLEDGE BASE.
          <br />
          <span className="text-electric-cyan mr-2">&gt;</span> FullStack Engineer | Frontend Architecture & Robust Backends Built for Precision
        </motion.p>
      </section>

      {/* ---------------- TECH GRID ---------------- */}
      <section className="mb-section-gap">
        <Reveal className="flex items-center gap-4 mb-12">
          <h2 className="font-headline-md text-headline-md text-electric-cyan">
            TECH_STACK.json
          </h2>
          <div className="h-px bg-gradient-to-r from-electric-cyan to-transparent flex-1" />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-12 gap-base">
          {/* Languages */}
          <StaggerItem className="md:col-span-6">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined fill text-6xl text-electric-cyan">
                  code_blocks
                </span>
              </div>
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                LANGUAGES
              </h3>
              <div className="flex flex-wrap gap-3">
                {LANGUAGES.map((lang) => (
                  <span
                    key={lang}
                    className={
                      lang === "TypeScript"
                        ? "px-4 py-2 border border-glass-edge text-electric-cyan font-mono-ui text-mono-ui bg-electric-cyan/5 shadow-[0_0_10px_rgba(0,243,255,0.1)]"
                        : "px-4 py-2 border border-glass-edge text-on-surface font-mono-ui text-mono-ui bg-obsidian-base/50"
                    }
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Frontend */}
          <StaggerItem className="md:col-span-6">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined fill text-6xl text-electric-cyan">
                  terminal
                </span>
              </div>
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                FRONTEND_FRAMEWORKS_AND_LIBRARIES
              </h3>
              <div className="flex flex-wrap gap-3">
                {FRONTEND.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 border border-glass-edge text-on-surface font-mono-ui text-mono-ui bg-obsidian-base/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Backend */}
          <StaggerItem className="md:col-span-12">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined fill text-6xl text-lavender-dust">
                  dns
                </span>
              </div>
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                BACKEND_FRAMEWORKS_AND_LIBRARIES
              </h3>
              <div className="flex flex-wrap gap-3">
                {BACKEND.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 border border-glass-edge text-on-surface font-mono-ui text-mono-ui bg-obsidian-base/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Styling */}
          <StaggerItem className="md:col-span-6">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors">
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                STYLING_ENGINE
              </h3>
              <ul className="space-y-3">
                {STYLING.map((s) => (
                  <li
                    key={s}
                    className="font-mono-ui text-mono-ui text-on-surface flex items-center gap-2"
                  >
                    <span className="text-electric-cyan">&gt;</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          {/* Build tools */}
          <StaggerItem className="md:col-span-6">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors">
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                BUILD_TOOLS
              </h3>
              <div className="flex flex-wrap gap-3">
                {BUILD_TOOLS.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 border border-glass-edge text-on-surface font-mono-ui text-mono-ui bg-obsidian-base/50"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Data layer */}
          <StaggerItem className="md:col-span-6">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors">
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                DATA_LAYER
              </h3>
              <div className="flex flex-wrap gap-3">
                {DATA_LAYER.map((d) => (
                  <span
                    key={d}
                    className="px-4 py-2 border border-glass-edge text-lavender-dust font-mono-ui text-mono-ui bg-secondary-container/10"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Databases */}
          <StaggerItem className="md:col-span-6">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors">
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                DATABASES
              </h3>
              <div className="flex flex-wrap gap-3">
                {DATABASES.map((d) => (
                  <span
                    key={d}
                    className="px-4 py-2 border border-glass-edge text-on-surface font-mono-ui text-mono-ui bg-obsidian-base/50"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Cloud, DevOps & Security */}
          <StaggerItem className="md:col-span-12">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined fill text-6xl text-electric-cyan">
                  cloud
                </span>
              </div>
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                CLOUD_DEVOPS_SECURITY
              </h3>
              <div className="flex flex-wrap gap-3">
                {CLOUD_DEVOPS.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 border border-glass-edge text-electric-cyan font-mono-ui text-mono-ui bg-electric-cyan/5 max-w-full break-words"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Tools & Methodologies */}
          <StaggerItem className="md:col-span-12">
            <div className="h-full bg-surface-container-low border border-glass-edge p-8 hover:border-lavender-dust/50 transition-colors">
              <h3 className="font-label-caps text-label-caps text-muted-violet mb-6">
                TOOLS_METHODOLOGIES
              </h3>
              <div className="flex flex-wrap gap-3">
                {METHODOLOGIES.map((m) => (
                  <span
                    key={m}
                    className="px-4 py-2 border border-glass-edge text-lavender-dust font-mono-ui text-mono-ui bg-secondary-container/10"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* ---------------- EXPERIENCE TIMELINE ---------------- */}
      <section>
        <Reveal className="flex items-center gap-4 mb-12">
          <h2 className="font-headline-md text-headline-md text-electric-cyan">
            EXECUTION_HISTORY.log
          </h2>
          <div className="h-px bg-gradient-to-r from-electric-cyan to-transparent flex-1" />
        </Reveal>

        <div className="space-y-8 relative overflow-hidden before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-glass-edge">
          {EXPERIENCE.map((item, i) => {
            const isCyan = item.accent === "cyan";
            return (
              <Reveal
                key={`${item.company}-${item.period}`}
                delay={i * 0.1}
                className={`relative flex items-center justify-between md:justify-normal group ${
                  i % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border bg-obsidian-base shrink-0 z-10 group-hover:scale-125 transition-transform duration-300 md:order-1 ${
                    i % 2 === 0
                      ? "md:-translate-x-1/2"
                      : "md:translate-x-1/2"
                  } ${
                    isCyan
                      ? "border-electric-cyan text-electric-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                      : "border-lavender-dust text-lavender-dust shadow-[0_0_15px_rgba(178,152,220,0.2)]"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {item.icon}
                  </span>
                </div>
                <div
                  className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-surface-container border p-6 transition-all duration-300 ${
                    isCyan
                      ? "border-electric-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] hover:border-electric-cyan"
                      : "border-muted-violet/30 shadow-[0_0_20px_rgba(178,152,220,0.05)] hover:shadow-[0_0_30px_rgba(178,152,220,0.15)] hover:border-lavender-dust"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">
                        {item.role}
                      </h3>
                      <p className="font-mono-ui text-mono-ui text-muted-violet">
                        {item.company}
                      </p>
                      <p className="font-mono-ui text-mono-ui text-on-surface-variant/70 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">
                          location_on
                        </span>
                        {item.location}
                      </p>
                    </div>
                    <span className="px-2 py-1 border border-glass-edge text-lavender-dust font-label-caps text-label-caps bg-lavender-dust/5 whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="font-body-md text-body-md text-on-surface-variant flex gap-2"
                      >
                        <span
                          className={
                            isCyan
                              ? "text-electric-cyan shrink-0"
                              : "text-lavender-dust shrink-0"
                          }
                        >
                          &gt;
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}
