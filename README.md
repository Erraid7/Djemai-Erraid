# DJEMAI Mohamed Erraid — Portfolio

A full-stack developer portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**.

## Design concept — "Blueprint"

The visual identity is a technical drafting / architectural-blueprint theme:
deep navy background, cyan hairline grid, amber "highlighter" accent, corner
registration marks on cards, and title-block style section headers
(`SHEET 01/05`). It's a direct nod to the systems-design and schema-design
work described throughout the CV, and the hero's animated node diagram
doubles as a literal map of the skills below it — echoing the
Auditor/Fixer/Tester/Documenter orchestration in Refactoring Swarm.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Editing content

Everything text-based lives in one place: **`src/data/portfolio.ts`**.
Update projects, skills, experience, and profile info there — no need to
touch component code for content changes.

## Adding your resume

Drop your PDF at `public/resume.pdf` (the Nav and Hero both link to
`/resume.pdf`).

## Wiring up the contact form

`src/app/api/contact/route.ts` currently logs submissions server-side.
To actually receive messages, either:

- Add [Resend](https://resend.com) (`npm install resend`) and send an email, or
- Add Prisma + PostgreSQL to store submissions in a database — consistent
  with the stack already used in ESI Flow and Khatma.

## Deploying

This is a standard Next.js app — deploys to Vercel with zero config:

```bash
npx vercel
```

## Structure

```
src/
  app/
    api/contact/route.ts   # contact form endpoint
    layout.tsx             # fonts + metadata
    page.tsx               # assembles all sections
    globals.css            # design tokens (the whole palette lives here)
  components/
    Nav.tsx
    Hero.tsx                # signature animated schematic diagram
    About.tsx
    Projects.tsx
    Skills.tsx
    Leadership.tsx           # impact stats + experience timeline
    Contact.tsx
    Footer.tsx
    ui.tsx                   # shared primitives (SheetHeader, Tag, CornerFrame)
  data/
    portfolio.ts             # ALL content -- edit this file first
```
