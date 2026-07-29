export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  exampleProjectId?: number;
  exampleLabel?: string;
};

export const services: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Web Applications",
    tagline: "A complete product, built and shipped -- not just a frontend.",
    description:
      "End-to-end ownership of a web application: system design, database schema, backend API, and the frontend that sits on top of it, deployed and actually working -- the same way ESI Flow, Khatma, and PharmaFlow were built.",
    deliverables: [
      "System design and database schema from scratch",
      "A working REST API with authentication and role-based access",
      "A responsive frontend, built and connected to that API",
      "Deployment to production, not just a local demo",
    ],
    exampleProjectId: 1,
    exampleLabel: "See it in ESI Flow",
  },
  {
    id: "backend-api",
    title: "Backend & API Systems",
    tagline: "The part that has to be right, even when no one sees it.",
    description:
      "For teams that already have a frontend (or a designer) but need a real backend behind it: schema design, authentication, role-based permissions, and an API built to hold up under real use -- not just pass a demo.",
    deliverables: [
      "Database schema design (PostgreSQL / Prisma)",
      "JWT authentication with role-based access control",
      "A documented REST API, tested before it ships",
      "Guidance on hosting and deployment",
    ],
    exampleProjectId: 3,
    exampleLabel: "See it in PharmaFlow",
  },
  {
    id: "mobile-first",
    title: "Mobile-First & Cross-Platform Apps",
    tagline: "Built for the screen people actually use.",
    description:
      "Responsive, mobile-first web apps or true cross-platform builds with Flutter, for products where most real usage happens on a phone, not a desktop demo.",
    deliverables: [
      "Mobile-first responsive design, not a desktop layout squeezed down",
      "Cross-platform delivery with Flutter when a native-feeling app matters",
      "Real device testing across the 320px--1440px range",
      "The same backend/API work from the other two services, if needed",
    ],
    exampleProjectId: 2,
    exampleLabel: "See it in Khatma",
  },
];
