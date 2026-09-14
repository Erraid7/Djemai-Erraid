type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Freelance Full-Stack Web Developer",
    org: "Independent",
    period: "2025 -- Present",
    bullets: [
      "Building production systems directly for clients end-to-end -- requirements, architecture, and deployment -- including PharmaFlow (a live, mobile-first pharmacy coordination platform) and HamsyNet (a confidential Arabic mini-ERP for a private organisation).",
      "Working solo across the full stack: schema design, APIs and auth, background jobs, and the frontends that sit on top of them.",
    ],
  },
  {
    role: "AI/Backend Engineering Intern",
    org: "Alias Agency",
    period: "07/2026 -- 09/2026",
    bullets: [
      "Co-built, in a two-intern team, a grounded multilingual (French/English/Arabic, including basic Darija) conversational assistant that turns plain-language trip requests into real, bookable tours for a client's tourism platform.",
      "Designed hybrid retrieval -- database filters plus multilingual semantic re-ranking -- lifting precision@3 on vague requests from 20% to 46%, with guardrails that validate every recommendation against the live database.",
    ],
  },
  {
    role: "President",
    org: "Club Scientifique de l'ESI (CSE)",
    period: "08/2025 -- 08/2026",
    bullets: [
      "Led a 1,000+ member organisation across 10 departments -- strategy, budget, Agile team coordination.",
      "Delivered DATAHACK 3 (2025/2026) as the year's flagship event.",
      "Drove new project launches, inter-club partnerships, and a structured workshop programme.",
    ],
  },
  {
    role: "Mentor",
    org: "HACKIN 7.0 Hackathon & DevSprint",
    period: "2024 -- 2025",
    bullets: ["Coached student teams on full-stack architecture, REST API design, and sprint-based delivery."],
  },
  {
    role: "Logistics Manager -- RELEV Dept.",
    org: "Club Scientifique de l'ESI (CSE)",
    period: "08/2024 -- 07/2025",
    bullets: ["Delivered DATAHACK 2 -- 120 participants, largest edition at the time -- coordinating a 50-person committee."],
  },
  {
    role: "Workshop Instructor & Multimedia Member",
    org: "Club Scientifique de l'ESI (CSE)",
    period: "11/2023 -- 07/2024",
    bullets: [
      "Designed and delivered 5 technical workshops (C, Pascal, HTML/CSS/JS, Back-End, GitHub) to ~20 students per session.",
      "Supported club media and helped organise DATAHACK 1.",
    ],
  },
];
