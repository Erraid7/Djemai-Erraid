type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Freelance Full-Stack Developer",
    org: "Independent",
    period: "2025 -- Present",
    bullets: [
      "Building production systems directly for clients end-to-end -- requirements, architecture, and deployment -- including PharmaFlow (a live, mobile-first pharmacy management platform) and HamsyNet (a confidential full-stack platform for a private organisation).",
      "Working solo across the full stack: schema design, API design and auth, and the frontend clients that sit on top of them.",
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
