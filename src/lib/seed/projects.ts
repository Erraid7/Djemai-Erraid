import type { Project } from "@/lib/types";

/**
 * Every stack, number, and claim below was checked against the project's own
 * repository (Sept 2026). If a repo changes, re-check before editing here —
 * the Skills page derives its evidence from these `stack` arrays.
 *
 * Array order is the order `/api/projects` returns, most recent work first.
 */
export const projects: Project[] = [
  // Internship work for a client of Alias Agency. The client and product
  // names are deliberately omitted everywhere on this site — no links, no
  // screenshots. Metrics come from the project's final evaluation report.
  {
    id: 8,
    slug: "ai-tour-assistant",
    name: "AI Tour-Recommendation Assistant",
    role: "AI/Backend Engineering Intern — Alias Agency · 2-person team",
    pinned: true,
    status: { kind: "internship", label: "Internship · client work" },
    summary:
      "A grounded, multilingual conversational assistant that turns plain-language trip requests into real, bookable tours for a client's tourism platform.",
    metrics: [
      { value: "20% → 46%", label: "precision@3 on vague requests" },
      { value: "92%", label: "intent accuracy on follow-up turns" },
      { value: "1,400+", label: "automated tests" },
    ],
    bullets: [
      "Co-built with a fellow intern: a Django app and React chat widget that understands French, English, and Arabic (including basic Darija) — and only ever answers with tours that actually exist.",
      "Hybrid retrieval — hard database filters first, then multilingual semantic re-ranking — lifted precision@3 on vague, vibe-based requests from 20% to 46%.",
      "Grounding guardrails check every recommendation against the live database before it's shown; all 3 acceptance scenarios pass, including the one where the right answer is to recommend nothing.",
      "Conversation memory across turns, streamed responses (tour cards land seconds before the text), and a 1,400+ test suite, packaged with Docker to drop into the client's codebase unchanged.",
    ],
    stack: [
      "Python",
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "React",
      "Ollama",
      "Semantic search",
      "Docker",
    ],
    media: [],
    links: {
      live: { available: false, reason: "Client work — no public demo." },
      github: { available: false, reason: "Private repository (client restriction)." },
      demoVideo: {
        available: false,
        reason: "No screenshots or recordings can be shared — client restriction.",
      },
    },
    docsMarkdown:
      "## AI Tour-Recommendation Assistant\n\nBuilt during my summer 2026 AI/Backend engineering internship at Alias Agency, in a team of two interns, for a client running a tourism booking platform. The brief: let a customer describe a trip in plain language — in French, English, or Arabic, including basic Algerian Darija — and get back real tours they can actually book. Never an invented one.\n\nThe core tension is that language models are fluent but not factual, and the product needed the opposite. So the model never decides what exists: it understands the request and writes the reply, while the recommendations themselves come from ordinary database queries. On top of those hard filters, multilingual semantic re-ranking handles vague, vibe-based requests — which took **precision@3 on those queries from 20% to 46%**.\n\nEvery tour the assistant mentions is checked against the live database before it's shown. All three of the brief's acceptance scenarios pass, including the one where the correct answer is to recommend nothing at all. Around that core: conversation memory across turns (92% intent accuracy on follow-ups), streamed responses so tour cards appear seconds before the text finishes, and a 1,400+ test suite.\n\nIt was built to drop into the client's existing codebase without modifying any of its code. Out of respect for the client, there are no links, screenshots, or names here.",
  },
  {
    id: 1,
    slug: "esi-flow",
    name: "ESI Flow",
    role: "Team Lead — 5-person team",
    pinned: true,
    status: { kind: "live", label: "Live" },
    summary:
      "A live, multi-role maintenance-request platform for ESI — staff and students report issues, technicians handle interventions, admins manage equipment and assignments.",
    bullets: [
      "Led a 5-member team through system design, database architecture, and end-to-end delivery in Agile sprints.",
      "Wrote most of the Express/PostgreSQL backend, including JWT-secured role-based access for 3 roles (Admin, Technician, Personnel) and the Sequelize data model.",
      "Automated preventive maintenance: scheduled jobs open periodic and seasonal requests on their own, with email notifications and Cloudinary-backed photo uploads.",
      "Built into a Next.js frontend with equipment-status dashboards, exportable tables, and English/French localization; deployed on Vercel and Render.",
    ],
    stack: ["Next.js", "JavaScript", "Express.js", "Sequelize", "PostgreSQL", "JWT", "Tailwind CSS", "Cloudinary"],
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
      github: { available: true, url: "https://github.com/Erraid7/esi_flow_front" },
      demoVideo: { available: true, url: "https://drive.google.com/file/u/0/d/1tgZCjCQEHpD4X_ky7EZoUFjWV6vSUqin/view" },
    },
    docsMarkdown:
      "## ESI Flow\n\nESI Flow is a multi-role maintenance-request platform for ESI: staff and students report problems, technicians take on the interventions, and admins manage equipment, users, and assignments — the kind of internal tool a school actually needs but rarely has.\n\nAs team lead on a 5-person team, I owned the system design and database architecture and coordinated delivery through Agile sprints. I also wrote most of the backend: an Express API on PostgreSQL with a Sequelize data model and JWT-secured role-based access across 3 roles (Admin, Technician, Personnel).\n\nMaintenance doesn't have to wait for someone to report a problem. Scheduled jobs open **periodic and seasonal maintenance requests** on their own, email notifications keep people in the loop, and photos of issues upload straight to Cloudinary. The Next.js frontend adds equipment-status dashboards, exportable tables, and English/French localization.\n\nIt's live today on Vercel and Render — not a class demo that only ran once.",
  },
  {
    id: 2,
    slug: "khatma",
    name: "Khatma",
    role: "Solo Full-Stack Developer",
    pinned: true,
    status: { kind: "demo", label: "Demo live · V1 soon" },
    summary:
      "A Quran memorization platform I'm building solo. A frontend demo of the full vision is live; V1, the self-managed student workflow on a real backend, launches soon.",
    metrics: [
      { value: "500+", label: "V1 backend tests" },
      { value: "22", label: "data models" },
    ],
    bullets: [
      "Designed around trust: every teacher must pass a strict ijaza-verification process, reviewed by admins, before supervising any student.",
      "Shipped a frontend-only demo of the complete platform — every role, running on an in-browser mock engine — so anyone can explore the whole product without an account.",
      "Built the V1 backend for the self-managed student workflow on Fastify, Prisma, and PostgreSQL: session-based auth with Argon2 hashing, 22 data models, and 500+ automated tests.",
      "An installable PWA whose relational core — plans, daily logs, revision cycles, progress tracking — makes it the most architecturally demanding project I've built solo.",
    ],
    stack: ["Next.js", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "TanStack Query", "Zod", "PWA", "Docker", "Vitest"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167264/Capture_d_%C3%A9cran_2026-07-27_164351_izzuyq.png", alt: "Khatma home" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167248/Capture_d_%C3%A9cran_2026-07-27_164431_d0ymgv.png", alt: "Khatma student dashboard" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785167228/Capture_d_%C3%A9cran_2026-07-27_164447_gnfif0.png", alt: "Khatma hifz map" },
    ],
    links: {
      live: {
        available: true,
        label: "Live demo",
        url: "https://khatma-frontend-git-demo-v0-erraid7s-projects.vercel.app/",
      },
      github: {
        available: false,
        reason: "Private repository — the live demo shows the product.",
      },
      demoVideo: { available: false, reason: "No demo recording yet — check back soon." },
      // Flip to `available: true` and add the `url` once V1 is hosted.
      extra: [
        {
          label: "V1 · self-managed students",
          available: false,
          reason: "launching soon",
        },
      ],
    },
    docsMarkdown:
      "## Khatma\n\nKhatma is a Quran memorization platform I'm designing and building alone — architecture, schema, backend, and frontend.\n\nIt's built around everyone involved in memorization: the hafiz (student) following a proven memorization plan, the teacher reviewing and guiding that progress, the parent keeping track, and the admin overseeing the structure. Its core differentiator is trust: every teacher must pass a strict **ijaza-verification** process, reviewed by admins, before they're allowed to supervise a student.\n\nThere are two ways to see it. The **live demo** is a frontend-only build of the complete vision — every role, running on an in-browser mock engine — so anyone can walk through the product without an account. **V1**, launching soon, is the first release on the real backend and covers the self-managed student workflow: plans, daily logs, revision cycles, and progress tracking. Teachers, parents, and a native app are planned for V2.\n\nThe V1 backend runs on Fastify, Prisma, and PostgreSQL, with session-based authentication, Argon2 password hashing, and 500+ automated tests. The hardest part wasn't any single feature — it was keeping 22 interdependent data models and all the role-specific logic coherent as the platform grew.",
  },
  {
    id: 3,
    slug: "pharmaflow",
    name: "PharmaFlow",
    role: "Sole Developer — freelance",
    pinned: true,
    status: { kind: "live", label: "Live in production" },
    summary:
      "A live, mobile-first coordination platform: pharmacy staff flag missing products from their phones, and the manager orders from one centralized list.",
    bullets: [
      "Closed a stock-visibility gap left by desktop-only software nobody kept updated: workers flag needed products from their phones, the manager marks each one ordered once purchased.",
      "Built a fully separated architecture — a Next.js 16 frontend and an Express 5 / MongoDB API — deployable and scalable independently.",
      "Implemented JWT authentication over HttpOnly cookies with Admin/Worker roles, so only admins can mark products as ordered or manage users.",
      "Fixed a data-integrity bug in user removal with proper cascade deletion, and added admin-only bulk tooling.",
      "Hardened the API with Zod validation, rate limiting, Helmet, and CORS, behind a mobile-first UI covering the full 320px–1440px range.",
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
      github: { available: true, url: "https://github.com/Erraid7/pharmacy-product-platform" },
      demoVideo: { available: false, reason: "No walkthrough video — the live site above covers this." },
    },
    docsMarkdown:
      "## PharmaFlow\n\nPharmaFlow started from a real gap. The pharmacy's desktop software was never kept up to date, so missing products went unnoticed until a customer asked for them. Now staff flag a missing product from their phone the moment they notice it, and the manager works from one centralized list — marking each item ordered once it's purchased.\n\nThe architecture is a fully separated frontend and backend: a Next.js 16 app (shadcn/ui, Tailwind CSS v4, TanStack Query, React Hook Form + Zod) talking to an Express 5 API (MongoDB/Mongoose, JWT auth over HttpOnly cookies, Zod validation, Helmet, CORS, and rate limiting) — deployable and scaled independently of each other.\n\nAuthentication distinguishes Admin and Worker roles: both can view and manage products, but only admins can mark a product as ordered or manage user accounts. Along the way I fixed a data-integrity bug in user removal with **proper cascade deletion**, and added admin-only bulk tooling. The UI adapts fully across 320px–1440px, switching between bottom navigation on mobile and a sidebar on desktop, with loading skeletons and toast feedback on every action so nothing feels like it silently failed.\n\nBuilt as a freelance project, it's live in production today.",
  },
  {
    id: 4,
    slug: "refactoring-swarm",
    name: "Refactoring Swarm",
    role: "Designer & Builder",
    pinned: true,
    status: { kind: "completed", label: "Completed · open source" },
    summary: "An autonomous 4-agent pipeline — Auditor, Fixer, Tester, Documenter — that reviews, refactors, tests, and documents Python code.",
    bullets: [
      "Chained agents that analyze code quality, propose refactors, generate tests, and update documentation — without a human in the loop.",
      "Applied swarm intelligence principles to coordinate LLM-powered agents with clearly separated responsibilities.",
      "Structured inter-agent communication so each agent's output becomes verified input for the next.",
    ],
    stack: ["Python", "LLM APIs", "Multi-agent systems"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785268059/ChatGPT_Image_Jul_28_2026_08_37_35_PM_dlhrls.png", alt: "Refactoring Swarm pipeline" },
    ],
    links: {
      live: { available: false, reason: "This is a CLI/pipeline tool, not a hosted app — no live URL applies." },
      github: { available: true, url: "https://github.com/Erraid7/Refactoring-Swarm-Equipe-24" },
      demoVideo: { available: false, reason: "Recording planned — check back soon." },
    },
    docsMarkdown:
      "## Refactoring Swarm\n\nRefactoring Swarm is an autonomous pipeline of 4 LLM-powered agents — Auditor, Fixer, Tester, Documenter — that walks through a Python codebase the way a careful senior engineer would, without a human in the loop.\n\nThe Auditor analyzes code quality and flags issues; the Fixer proposes and applies refactors; the Tester generates tests against the refactored code; the Documenter updates documentation to match. Each agent has a narrow, clearly separated responsibility, and each one's output becomes verified input for the next — so mistakes don't silently compound down the chain.\n\nThis was my first real exploration of applying swarm-intelligence principles (coordination through role separation, not a single do-everything prompt) to a genuine engineering workflow, rather than a toy demo.",
  },
  {
    id: 5,
    slug: "cse-website",
    name: "CSE Club Website",
    role: "Contributor",
    pinned: true,
    status: { kind: "live", label: "Live" },
    summary: "The public site for Club Scientifique de l'ESI — responsive components and an infinite-scroll, direction-reactive sponsor slider.",
    bullets: [
      "Built responsive frontend components used across the club's public site.",
      "Implemented an infinite-scroll sponsor slider with direction-reactive animation.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785193429/Capture_d_%C3%A9cran_2026-07-27_235001_avdi6y.png", alt: "CSE Club Website" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785193459/Capture_d_%C3%A9cran_2026-07-27_235217_pweay1.png", alt: "CSE Club About" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785193436/Capture_d_%C3%A9cran_2026-07-27_235050_jkazwo.png", alt: "CSE Club TrustedBy" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785193452/Capture_d_%C3%A9cran_2026-07-27_235134_keuusl.png", alt: "CSE Club Events" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785193469/Capture_d_%C3%A9cran_2026-07-27_235418_wcdvbp.png", alt: "CSE Club Community" },
    ],
    links: {
      live: { available: true, url: "https://cse.club/" },
      github: { available: false, reason: "Confidential club project." },
      demoVideo: { available: false, reason: "No walkthrough video recorded yet." },
    },
    docsMarkdown:
      "## CSE Club Website\n\nThe public-facing website for Club Scientifique de l'ESI (CSE), the 1,000+ member student tech club I led as president in 2025–2026.\n\nI contributed responsive frontend components used across the site, and built the sponsor section's infinite-scroll slider — direction-reactive, so it responds naturally to how a visitor scrolls rather than looping on a fixed timer. Small in scope compared to the other projects here, but it's real, shipped, and still live for the club today.",
  },
  {
    id: 6,
    slug: "esi-run",
    name: "ESI Run",
    role: "Developer",
    pinned: true,
    status: { kind: "completed", label: "Completed · desktop app" },
    summary: "A desktop public-transportation management system: accounts, pass management, complaint handling, and validation workflows.",
    bullets: [
      "Implemented the full business logic in Java/JavaFX — accounts, pass issuance and validation, complaints — with CSV-based persistence.",
      "Wrote test harnesses covering the user, pass, complaint, and persistence flows, including save-and-reload round trips of every record type.",
    ],
    stack: ["Java", "JavaFX", "Maven"],
    media: [
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191802/Capture_d_%C3%A9cran_2026-07-27_233315_xhy89x.png", alt: "ESI Run dashboard" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191799/Capture_d_%C3%A9cran_2026-07-27_233326_i37xb8.png", alt: "ESI Run user management" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191799/Capture_d_%C3%A9cran_2026-07-27_233406_bq9fmm.png", alt: "ESI Run new user" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191796/Capture_d_%C3%A9cran_2026-07-27_233419_qc4mj9.png", alt: "ESI Run transport passes" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191799/Capture_d_%C3%A9cran_2026-07-27_233429_b7ijxx.png", alt: "ESI Run pass details" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191795/Capture_d_%C3%A9cran_2026-07-27_233507_mqzkwo.png", alt: "ESI Run new pass" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191796/Capture_d_%C3%A9cran_2026-07-27_233540_jrnxqa.png", alt: "ESI Run complaints" },
      { type: "image", src: "https://res.cloudinary.com/umxjpowx/image/upload/v1785191796/Capture_d_%C3%A9cran_2026-07-27_233559_yktook.png", alt: "ESI Run new complaint" },
    ],
    links: {
      live: { available: false, reason: "Desktop application, there's no hosted version." },
      github: { available: true, url: "https://github.com/Erraid7/javaFX_project" },
      demoVideo: { available: false, reason: "Recording planned — check back soon." },
    },
    docsMarkdown:
      "## ESI Run\n\nESI Run is a desktop management system for a public-transportation network: user accounts, transit pass issuance and renewal, complaint handling, and pass validation, all in one Java/JavaFX application.\n\nI implemented the full business logic across these subsystems with CSV-based persistence, then wrote test harnesses exercising the user, pass, and complaint flows and verifying that every record survives a save-and-reload round trip — the part that mattered most, since a transit system with silent persistence bugs is worse than no system at all.\n\nIt's a good example of the same care about correctness applied outside the web stack I use most.",
  },

  // Hidden — confidential client project, intentionally not pinned in the
  // sidebar. Reachable only by editing the URL bar to /api/projects/7.
  {
    id: 7,
    slug: "hamsynet",
    name: "HamsyNet",
    role: "Sole Full-Stack Developer — confidential client",
    pinned: false,
    status: { kind: "hosted-private", label: "Hosted · confidential" },
    summary:
      "A confidential, fully Arabic (RTL) mini-ERP for a private organisation — members, a multi-level executive hierarchy, territory-scoped roles, and files — rebuilt from scratch on a production-grade backend.",
    metrics: [
      { value: "240+", label: "tests against real services" },
      { value: "26", label: "data models" },
      { value: "7", label: "background job queues" },
    ],
    bullets: [
      "Modeled the organisation's real multi-level bureau hierarchy so authorization follows how authority actually flows — dynamic, territory-scoped grants instead of a flat admin/user split.",
      "Built the backend on Fastify, Prisma, and PostgreSQL behind a connection pooler, with JWT access/refresh tokens in httpOnly cookies and Argon2 password hashing.",
      "Moved slow work off the request path: Redis-backed BullMQ workers handle notification fan-out, virus scanning, email, exports, and materialized-view refreshes.",
      "Built in observability from day one (Prometheus metrics, OpenTelemetry and Sentry hooks), with 240+ tests running against real Postgres, Redis, and object storage — no mocks.",
      "Designed a fully right-to-left Arabic interface for a non-technical member base, on a typed API layer that switched from a mock backend to the real one through a single environment variable.",
    ],
    stack: ["Next.js", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "Redis", "BullMQ", "JWT", "Zod", "Cloudflare R2", "Docker", "Vitest"],
    media: [],
    links: {
      live: { available: false, reason: "Confidential — the client hasn't authorized a public link." },
      github: { available: false, reason: "Private repository under client confidentiality." },
      demoVideo: { available: false, reason: "Not permitted to share due to client confidentiality." },
    },
    docsMarkdown:
      "## HamsyNet\n\nHamsyNet is a confidential platform I built for a private organisation that had outgrown its old system. It's effectively a mini ERP: members, a multi-level executive hierarchy, role assignment, and internal files, in one fully Arabic, right-to-left interface built for a non-technical member base.\n\nThe interesting problem wasn't CRUD. It was modeling a real bureau hierarchy faithfully enough that authorization follows how authority actually flows through the organisation — **dynamic, territory-scoped grants** instead of a generic admin/user split.\n\nThe backend runs on Fastify, Prisma, and PostgreSQL behind a connection pooler, with JWT access and refresh tokens in httpOnly cookies. Redis backs caching, idempotency, and BullMQ workers that take slow work off the request path: notification fan-out, virus scanning, email, exports, and materialized-view refreshes. Observability was there from the start — Prometheus metrics plus OpenTelemetry and Sentry hooks — and 240+ tests run against real Postgres, Redis, and object storage, not mocks. The frontend talks to everything through a strict typed API layer that ran on a full mock backend during development and switched to the real API with a single environment variable.\n\nIt's complete and hosted, but out of respect for the client's confidentiality, that's as specific as this one gets — no public link, repo, or screenshots. If you want more detail, ask me directly.",
  },
];
