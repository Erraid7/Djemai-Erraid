import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: 1,
    slug: "esi-flow",
    name: "ESI Flow",
    role: "Team Lead — 5-person team",
    pinned: true,
    summary: "A production, multi-role SaaS platform serving students, technicians, and admins at ESI.",
    bullets: [
      "Led a 5-member team through system design, database architecture, and end-to-end implementation using Agile sprints.",
      "Contributed roughly 80% of the Express/TypeScript/PostgreSQL codebase, including JWT-secured role-based access control across 3 user types and the full Prisma schema.",
      "Validated cross-layer reliability across 15+ frontend pages and the REST API with function and integration tests, then deployed to Vercel and Render.",
    ],
    stack: ["Next.js", "TypeScript", "Express.js", "Prisma", "PostgreSQL", "JWT"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167285/Capture_d_%C3%A9cran_2026-07-27_163903_hyeabf.png", alt: "ESI Flow Responsive WebApp" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167265/Capture_d_%C3%A9cran_2026-07-27_164013_wubf58.png", alt: "ESI Flow login" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167254/Capture_d_%C3%A9cran_2026-07-27_163945_i18lxg.png", alt: "ESI Flow home" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167243/Capture_d_%C3%A9cran_2026-07-27_164124_wd7ki9.png", alt: "ESI Flow admin panel" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167240/Capture_d_%C3%A9cran_2026-07-27_164215_gevbgq.png", alt: "ESI Flow tasks management" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167241/Capture_d_%C3%A9cran_2026-07-27_164140_yprwu1.png", alt: "ESI Flow requests management" },
    ],
    links: {
      live: { available: true, url: "https://esi-flow.vercel.app" },
      github: { available: true, url: "https://github.com/Erraid7" },
      demoVideo: { available: true, url:"https://drive.google.com/file/u/0/d/1tgZCjCQEHpD4X_ky7EZoUFjWV6vSUqin/view" },
    },
    docsMarkdown:
      "## ESI Flow\n\nESI Flow is a multi-role SaaS platform built to give ESI's students, technicians, and admins a single system for filing, tracking, and resolving requests — the kind of internal tool a school actually needs but rarely has.\n\nAs team lead on a 5-person team, I owned the system design and database architecture from the start: a Prisma/PostgreSQL schema supporting 3 distinct user roles, each with different permissions enforced through JWT-secured role-based access control. I wrote roughly 80% of the Express/TypeScript backend myself, while coordinating the rest of the team through Agile sprints — planning, reviewing, and keeping the whole thing shippable rather than just architecturally correct.\n\nThe frontend spans 15+ pages across the three roles, backed by a REST API validated with function and integration tests before deployment. It's live today on Vercel (frontend) and Render (backend), not a class demo that only ran once.",
  },
  {
    id: 2,
    slug: "khatma",
    name: "Khatma",
    role: "Solo Full-Stack Developer",
    pinned: true,
    summary: "A full-stack Quran memorization platform, sole-authored across web and mobile.",
    bullets: [
      "Covered 3 user roles (Hafiz, Teacher, Admin) across a Next.js web app and a cross-platform Flutter app.",
      "Designed the full Prisma/PostgreSQL schema and built a secure REST API with JWT authentication, independently.",
      "Implemented all backend logic in TypeScript/Express, from data model to deployed service.",
    ],
    stack: ["Next.js", "TypeScript", "Flutter", "Node.js", "Express", "Prisma", "PostgreSQL", "JWT"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167264/Capture_d_%C3%A9cran_2026-07-27_164351_izzuyq.png", alt: "Khatma home" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167248/Capture_d_%C3%A9cran_2026-07-27_164431_d0ymgv.png", alt: "Khatma student dashboard" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167228/Capture_d_%C3%A9cran_2026-07-27_164447_gnfif0.png", alt: "Khatma hifz map" },
    ],
    links: {
      live: { available: false, reason: "Not deployed publicly yet — currently used within a closed pilot group." },
      github: { available: true, url: "https://github.com/Erraid7" },
      demoVideo: { available: false, reason: "No demo recording yet — check back soon." },
    },
    docsMarkdown:
      "## Khatma\n\nKhatma is a Quran memorization platform built end-to-end, alone — architecture, schema, backend, and both front-facing clients.\n\nIt supports 3 distinct roles: the Hafiz (student) tracking their own memorization progress, the Teacher reviewing and guiding that progress, and an Admin overseeing the whole structure. Rather than build one interface and call it done, I shipped two: a Next.js web app and a cross-platform Flutter app, both talking to the same backend.\n\nThe backend is a TypeScript/Express API secured with JWT authentication, sitting on a Prisma/PostgreSQL schema I designed to model the relationships between students, teachers, and memorization progress cleanly. Every layer — data model, API, both clients — was my own work, which made this the project where I learned the most about keeping a solo build coherent across platforms instead of just fast.",
  },
  {
    id: 3,
    slug: "pharmaflow",
    name: "PharmaFlow",
    role: "Full-Stack Developer",
    pinned: true,
    summary: "A live, mobile-first pharmacy management platform for tracking and ordering pharmacy products, with role-based access for admins and workers.",
    bullets: [
      "Built a fully separated frontend/backend architecture — Next.js 16 frontend, Express 5 API — deployable and scalable independently.",
      "Implemented JWT authentication over HttpOnly cookies with Admin/Worker roles, so only admins can mark products as ordered or manage users.",
      "Designed a mobile-first responsive UI (bottom navigation on mobile, sidebar on desktop) covering the full 320px–1440px range, with real-time product status updates, search/filter, and toast feedback on every action.",
      "Hardened the API with Zod validation, rate limiting, Helmet, and CORS, and shipped a seed script for demo admin/worker accounts.",
    ],
    stack: ["Next.js", "TypeScript", "Express.js", "MongoDB", "Mongoose", "JWT", "TanStack Query", "Zod", "Tailwind CSS"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785189087/capture_d_%C3%A9cran_2026-07-27_164448_yqkzog.png", alt: "PharmaFlow login" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785189073/Capture_d_%C3%A9cran_2026-07-27_224722_esbkua.png", alt: "PharmaFlow needed products" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785189072/Capture_d_%C3%A9cran_2026-07-27_224750_wotcs3.png", alt: "PharmaFlow ordered products" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785190940/Copy_of_ESI_FLOW_PROJECT_vffkty.png", alt: "PharmaFlow mobile view" },
    ],
    links: {
      live: { available: true, url: "https://pharmacy-product-platform.vercel.app" },
      github: { available: true, url: "https://github.com/Erraid7" },
      demoVideo: { available: false, reason: "No walkthrough video — the live site above covers this." },
    },
    docsMarkdown:
      "## PharmaFlow\n\nPharmaFlow is a pharmacy product management platform built for real day-to-day use, not a class exercise — pharmacy staff track which products are needed and mark them as ordered once resolved, with the whole flow built mobile-first since that's how the people actually using it work.\n\nThe architecture is a fully separated frontend and backend: a Next.js 16 app (shadcn/ui, Tailwind CSS v4, TanStack Query, React Hook Form + Zod) talking to an Express 5 API (MongoDB/Mongoose, JWT auth over HttpOnly cookies, Zod validation, Helmet, CORS, and rate limiting) — deployable and scaled independently of each other.\n\nAuthentication distinguishes Admin and Worker roles: both can view and manage products, but only admins can mark a product as ordered or manage user accounts. The UI adapts fully across 320px–1440px, switching between bottom navigation on mobile and a sidebar on desktop, with empty states, loading skeletons, and toast notifications on every action so nothing feels like it silently failed.\n\nIt's live in production today, seeded with demo admin and worker accounts for anyone who wants to try it out.",
  },
  {
    id: 4,
    slug: "esi-run",
    name: "ESI Run",
    role: "Developer",
    pinned: true,
    summary: "A desktop public-transportation management system: accounts, pass management, complaint handling, and validation workflows.",
    bullets: [
      "Implemented full business logic in Java/JavaFX with CSV-based persistence.",
      "Wrote unit and integration tests across the user, pass, and validation subsystems.",
    ],
    stack: ["Java", "JavaFX"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191802/Capture_d_%C3%A9cran_2026-07-27_233315_xhy89x.png", alt: "ESI Run dashboard" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191799/Capture_d_%C3%A9cran_2026-07-27_233326_i37xb8.png", alt: "ESI Run user management" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191799/Capture_d_%C3%A9cran_2026-07-27_233406_bq9fmm.png", alt: "ESI Run new user" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191796/Capture_d_%C3%A9cran_2026-07-27_233419_qc4mj9.png", alt: "ESI Run transport passes" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191799/Capture_d_%C3%A9cran_2026-07-27_233429_b7ijxx.png", alt: "ESI Run pass details" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191795/Capture_d_%C3%A9cran_2026-07-27_233507_mqzkwo.png", alt: "ESI Run new pass" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191796/Capture_d_%C3%A9cran_2026-07-27_233540_jrnxqa.png", alt: "ESI Run complaints" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191796/Capture_d_%C3%A9cran_2026-07-27_233559_yktook.png", alt: "ESI Run new complaint" }
    ],
    links: {
      live: { available: false, reason: "Desktop application, there's no hosted version." },
      github: { available: true, url: "https://github.com/Erraid7" },
      demoVideo: { available: false, reason: "Recording planned — check back soon." },
    },
    docsMarkdown:
      "## ESI Run\n\nESI Run is a desktop management system for a public-transportation network: user accounts, transit pass issuance and renewal, complaint handling, and pass validation, all in one Java/JavaFX application.\n\nI implemented the full business logic across these subsystems with CSV-based persistence, then backed it with unit and integration tests across the user, pass, and validation flows — the part of the project that mattered most, since a transit system with silent validation bugs is worse than no system at all.\n\nIt's a good example of solid engineering discipline outside the web stack I use most: same care about correctness and testing, applied to a desktop Java codebase instead of a REST API.",
  },
  {
    id: 5,
    slug: "cse-website",
    name: "CSE Club Website",
    role: "Contributor",
    pinned: true,
    summary: "The public site for Club Scientifique de l'ESI — responsive components and an infinite-scroll, direction-reactive sponsor slider.",
    bullets: [
      "Built responsive frontend components used across the club's public site.",
      "Implemented an infinite-scroll sponsor slider with direction-reactive animation.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    media: [],
    links: {
      live: { available: false, reason: "Public URL not yet finalized — replace with the real link when live." },
      github: { available: true, url: "https://github.com/Erraid7" },
      demoVideo: { available: false, reason: "No walkthrough video recorded yet." },
    },
    docsMarkdown:
      "## CSE Club Website\n\nThe public-facing website for Club Scientifique de l'ESI (CSE), the 1,000+ member student tech club I now lead as president.\n\nI contributed responsive frontend components used across the site, and built the sponsor section's infinite-scroll slider — direction-reactive, so it responds naturally to how a visitor scrolls rather than looping on a fixed timer. Small in scope compared to the other projects here, but it's real, shipped, and still live for the club today.",
  },
  {
    id: 6,
    slug: "refactoring-swarm",
    name: "Refactoring Swarm",
    role: "Designer & Builder",
    pinned: true,
    summary: "An autonomous 4-agent pipeline — Auditor, Fixer, Tester, Documenter — that reviews, refactors, tests, and documents Python code.",
    bullets: [
      "Eliminated manual code-review overhead by chaining agents that analyze code quality, propose refactors, generate tests, and update documentation.",
      "Applied swarm intelligence principles to coordinate LLM-powered agents with clearly separated responsibilities.",
      "Structured inter-agent communication so each agent's output becomes verified input for the next.",
    ],
    stack: ["Python", "LLM APIs", "Multi-agent systems"],
    media: [],
    links: {
      live: { available: false, reason: "This is a CLI/pipeline tool, not a hosted app — no live URL applies." },
      github: { available: true, url: "https://github.com/Erraid7" },
      demoVideo: { available: false, reason: "Recording planned — check back soon." },
    },
    docsMarkdown:
      "## Refactoring Swarm\n\nRefactoring Swarm is an autonomous pipeline of 4 LLM-powered agents — Auditor, Fixer, Tester, Documenter — that walks through a Python codebase the way a careful senior engineer would, without a human in the loop.\n\nThe Auditor analyzes code quality and flags issues; the Fixer proposes and applies refactors; the Tester generates tests against the refactored code; the Documenter updates documentation to match. Each agent has a narrow, clearly separated responsibility, and each one's output becomes verified input for the next — so mistakes don't silently compound down the chain.\n\nThis was my first real exploration of applying swarm-intelligence principles (coordination through role separation, not a single do-everything prompt) to a genuine engineering workflow, rather than a toy demo. It's the project I'd point to if asked how far multi-agent systems can actually go in day-to-day software work.",
  },

  // Hidden -- confidential client project, intentionally not pinned in the
  // sidebar. Reachable only by editing the URL bar to /api/projects/7.
  {
    id: 7,
    slug: "hamsynet",
    name: "HamsyNet",
    role: "Full-Stack Developer (confidential client project)",
    pinned: false,
    summary: "A confidential, full Arabic (RTL) platform — a kind of mini ERP — for managing an organisation's members, executive structure, roles, and files.",
    bullets: [
      "Built a role-based authentication and authorization system reflecting the organisation's real executive hierarchy, not just a flat admin/user split.",
      "Modeled the organisation's structure of executive members (\"responsables\") with scoped roles and permissions tied to that structure.",
      "Designed a fully right-to-left (RTL) Arabic interface for a non-technical member base — a different UX/i18n problem than the LTR work elsewhere on this site.",
      "Implemented file management integrated directly into the member and role workflows.",
    ],
    stack: ["Next.js", "TypeScript", "Express.js", "PostgreSQL", "Prisma", "JWT"],
    media: [],
    links: {
      live: { available: false, reason: "Confidential — the client hasn't authorized a public link." },
      github: { available: false, reason: "Private repository under client confidentiality." },
      demoVideo: { available: false, reason: "Not permitted to share due to client confidentiality." },
    },
    docsMarkdown:
      "## HamsyNet\n\nHamsyNet is a confidential full-stack platform built for a private organisation — internally, it's basically a mini ERP: it manages the organisation's members, its executive hierarchy (\"responsables\"), role assignment, and internal files, all in one place.\n\nThe interesting engineering problem here wasn't CRUD, it was modeling a real executive tree faithfully enough that role-based authorization actually reflects how authority flows through the organisation, rather than a generic admin/user split. The entire interface is Arabic and right-to-left, built for a non-technical member base — a genuinely different UX and internationalization problem than anything else in this portfolio.\n\nOut of respect for the client's confidentiality, that's as specific as this one gets — no public link, repo, or screenshots. If you want more detail, ask me directly.",
  },
];
