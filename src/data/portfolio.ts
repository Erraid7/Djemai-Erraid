export const profile = {
  name: "DJEMAI Mohamed Erraid",
  role: "Full-Stack Developer",
  tagline:
    "Third-year CS student shipping production systems — a live SaaS, a solo cross-platform app, and an autonomous AI agent pipeline — while leading a 1,000-member tech club.",
  location: "Algiers, Algeria",
  school: "ESI — École Nationale Supérieure d'Informatique",
  schoolYears: "2023 – 2028",
  email: "nm_djemai@esi.dz",
  phone: "+213 776 262 511",
  github: "https://github.com/Erraid7",
  linkedin: "https://www.linkedin.com/in/djemai-mohamed-erraid",
  resumeUrl: "/resume.pdf",
  seeking: "Seeking a Summer 2026 internship",
};

export type SkillCategory = {
  id: string;
  label: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript (ES6+)"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Express.js", "REST API design", "JWT Authentication", "OAuth"],
  },
  {
    id: "database",
    label: "Database",
    items: ["PostgreSQL", "Prisma ORM", "Firebase", "SQL schema design"],
  },
  {
    id: "mobile",
    label: "Mobile",
    items: ["Flutter", "Dart"],
  },
  {
    id: "ai",
    label: "AI & Agents",
    items: ["Python", "LLM APIs", "Multi-agent systems", "Swarm intelligence"],
  },
  {
    id: "design",
    label: "Design & UI",
    items: ["Figma", "Design systems", "Component libraries", "Dark mode"],
  },
  {
    id: "devops",
    label: "Testing & DevOps",
    items: ["Jest", "Integration testing", "Git", "GitHub", "Vercel", "Render", "Docker (learning)", "CI/CD (learning)"],
  },
];

export type Project = {
  id: string;
  name: string;
  role: string;
  featured: boolean;
  stack: string[];
  summary: string;
  bullets: string[];
  liveUrl?: string;
  githubUrl?: string;
  sheetNumber: string;
};

export const projects: Project[] = [
  {
    id: "esi-flow",
    name: "ESI Flow",
    role: "Team Lead — 5-person team",
    featured: true,
    stack: ["Next.js", "TypeScript", "Express.js", "Prisma", "PostgreSQL", "JWT"],
    summary:
      "A production, multi-role SaaS platform serving students, technicians, and admins at ESI — live in production, not a class project.",
    bullets: [
      "Led a 5-member team through full system design, database architecture, and end-to-end implementation using Agile sprints.",
      "Contributed roughly 80% of the Express/TypeScript/PostgreSQL codebase, including JWT-secured role-based access control across 3 user types and the full Prisma schema design.",
      "Validated cross-layer reliability across 15+ frontend pages and the REST API with core function and integration tests, then deployed to Vercel and Render.",
    ],
    liveUrl: "https://esi-flow.vercel.app",
    githubUrl: "https://github.com/Erraid7",
    sheetNumber: "01",
  },
  {
    id: "khatma",
    name: "Khatma",
    role: "Solo Full-Stack Developer",
    featured: true,
    stack: ["Next.js", "TypeScript", "Flutter", "Node.js", "Express", "Prisma", "PostgreSQL", "JWT"],
    summary:
      "A full-stack Quran memorization platform, sole-authored end to end — system architecture through production code — across web and mobile.",
    bullets: [
      "Covered 3 distinct user roles (Hafiz, Teacher, Admin) across both a Next.js web app and a cross-platform Flutter app.",
      "Designed the full Prisma/PostgreSQL schema and built a secure REST API with JWT authentication, independently.",
      "Implemented all backend logic in TypeScript/Express, from data model to deployed service.",
    ],
    githubUrl: "https://github.com/Erraid7",
    sheetNumber: "02",
  },
  {
    id: "refactoring-swarm",
    name: "Refactoring Swarm",
    role: "Designer & Builder",
    featured: true,
    stack: ["Python", "LLM APIs", "Multi-agent systems", "Swarm intelligence"],
    summary:
      "An autonomous 4-agent pipeline — Auditor, Fixer, Tester, Documenter — that reviews, refactors, tests, and documents Python code without human intervention.",
    bullets: [
      "Eliminated manual code-review overhead by chaining agents that analyze code quality, propose refactors, generate tests, and update documentation.",
      "Applied swarm intelligence principles to coordinate LLM-powered agents with clearly separated responsibilities.",
      "Structured inter-agent communication so each agent's output becomes verified input for the next.",
    ],
    githubUrl: "https://github.com/Erraid7",
    sheetNumber: "03",
  },
  {
    id: "esi-run",
    name: "ESI Run",
    role: "Developer",
    featured: false,
    stack: ["Java", "JavaFX", "Unit testing", "Integration testing"],
    summary:
      "A desktop public-transportation management system: accounts, pass management, complaint handling, and validation workflows.",
    bullets: [
      "Implemented full business logic in Java/JavaFX with CSV-based persistence.",
      "Wrote unit and integration tests across the user, pass, and validation subsystems.",
    ],
    sheetNumber: "04",
  },
  {
    id: "cse-website",
    name: "CSE Club Website",
    role: "Contributor",
    featured: false,
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    summary:
      "The public site for Club Scientifique de l'ESI — responsive components and an infinite-scroll, direction-reactive sponsor slider.",
    bullets: [
      "Built responsive frontend components used across the club's public-facing site.",
      "Implemented an infinite-scroll sponsor slider with direction-reactive animation.",
    ],
    sheetNumber: "05",
  },
];

export type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "President",
    org: "Club Scientifique de l'ESI (CSE)",
    period: "08/2025 – Present",
    bullets: [
      "Leading a 1,000+ member organisation across 10 departments — strategic planning, budget, and Agile team coordination.",
      "Delivered DATAHACK 3 (2025/2026) as the year's flagship event, overseeing organisation end to end.",
      "Driving new project launches, inter-club partnerships, and a structured workshop programme for ESI students.",
    ],
  },
  {
    role: "Mentor",
    org: "HACKIN 7.0 Hackathon & DevSprint",
    period: "2024 – 2025",
    bullets: [
      "Coached multiple student teams on full-stack architecture decisions, REST API design, and sprint-based project management under competition conditions.",
    ],
  },
  {
    role: "Logistics Manager — RELEV Dept.",
    org: "Club Scientifique de l'ESI (CSE)",
    period: "08/2024 – 07/2025",
    bullets: [
      "Delivered DATAHACK 2 — 120 participants, the largest edition at the time — coordinating a 50-person organising committee.",
    ],
  },
  {
    role: "Workshop Instructor & Multimedia Member",
    org: "Club Scientifique de l'ESI (CSE)",
    period: "11/2023 – 07/2024",
    bullets: [
      "Designed and delivered 5 technical workshops (C, Pascal, HTML/CSS/JS, Back-End, GitHub) to ~20 students per session, building all curriculum from scratch.",
      "Supported club communications and media, and helped organise DATAHACK 1 (2023/2024).",
    ],
  },
];

export const impactStats = [
  { value: "1,000+", label: "CSE members led" },
  { value: "10", label: "departments coordinated" },
  { value: "120", label: "DATAHACK 2 participants" },
  { value: "5", label: "workshops authored" },
];

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "French", level: "Professional" },
  { name: "English", level: "Professional — primary working language" },
];
