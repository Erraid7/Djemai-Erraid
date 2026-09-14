/**
 * Skills, with an explicit proficiency level per item.
 *
 * A flat list of technology names can't answer the question a visitor
 * actually has -- "which of these does he *master*?" -- so every skill
 * carries a `level`, and `/api/skills` cross-references each one against
 * `projects[].stack` to attach the real projects it shipped in. The project
 * evidence is objective and derived from data already in this repo; the level
 * is the one editorial judgement here.
 *
 * Level definitions (keep these honest -- they're shown to visitors verbatim):
 *   core    -- daily driver. Shipped repeatedly, would take ownership of it.
 *   strong  -- comfortable and shipped, but less mileage than the core stack.
 *   working -- used it, still building depth. Not a claim of mastery.
 *
 * `aliases` exist because project stacks spell some of these differently
 * ("JWT" vs "JWT Authentication", "Express" vs "Express.js"). Matching is
 * case-insensitive and checks aliases, so the evidence lookup doesn't silently
 * miss a project.
 */

export type SkillLevel = "core" | "strong" | "working";

export type Skill = {
  name: string;
  level: SkillLevel;
  /** Alternate spellings used in `projects[].stack`. */
  aliases?: string[];
};

export type SkillCategory = {
  id: string;
  label: string;
  /** One line on what this category actually means in practice. */
  blurb: string;
  items: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Where most of my shipped work lives.",
    items: [
      { name: "Next.js", level: "core" },
      { name: "React", level: "core", aliases: ["Next.js"] },
      { name: "TypeScript", level: "core" },
      { name: "Tailwind CSS", level: "core", aliases: ["Tailwind"] },
      { name: "JavaScript (ES6+)", level: "core", aliases: ["JavaScript"] },
      { name: "HTML5", level: "strong", aliases: ["HTML"] },
      { name: "CSS3", level: "strong", aliases: ["CSS"] },
      { name: "TanStack Query", level: "working" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "APIs I designed, secured, and deployed myself.",
    items: [
      // Express and Fastify both run on Node, so their projects count here too.
      { name: "Node.js", level: "core", aliases: ["Node", "Express", "Express.js", "Fastify"] },
      { name: "Express.js", level: "core", aliases: ["Express"] },
      { name: "REST API design", level: "core" },
      { name: "JWT Authentication", level: "core", aliases: ["JWT", "JWT auth"] },
      { name: "Fastify", level: "strong" },
      { name: "Django", level: "strong" },
      { name: "Django REST Framework", level: "strong", aliases: ["DRF"] },
      { name: "BullMQ", level: "working" },
      { name: "Zod", level: "working" },
      { name: "OAuth", level: "working" },
    ],
  },
  {
    id: "database",
    label: "Database",
    blurb: "Schemas designed from scratch, not scaffolded.",
    items: [
      { name: "PostgreSQL", level: "core", aliases: ["Postgres"] },
      { name: "Prisma ORM", level: "core", aliases: ["Prisma"] },
      { name: "SQL schema design", level: "core" },
      { name: "Sequelize", level: "strong" },
      { name: "Redis", level: "strong" },
      { name: "MongoDB", level: "strong", aliases: ["Mongo"] },
      { name: "Mongoose", level: "strong" },
      { name: "pgvector", level: "working" },
      { name: "Firebase", level: "working" },
    ],
  },
  {
    id: "ai",
    label: "AI & Agents",
    blurb: "Grounded assistants and agent pipelines — and still learning.",
    items: [
      { name: "Python", level: "strong" },
      { name: "LLM APIs", level: "strong" },
      { name: "Multi-agent systems", level: "strong" },
      { name: "Semantic search & RAG", level: "working", aliases: ["Semantic search", "RAG"] },
      { name: "Ollama", level: "working" },
      { name: "Swarm intelligence", level: "working" },
    ],
  },
  {
    id: "languages",
    label: "Languages & Fundamentals",
    blurb: "The CS grounding underneath the frameworks.",
    items: [
      { name: "Java", level: "strong" },
      { name: "JavaFX", level: "working" },
    ],
  },
  {
    id: "devops",
    label: "Testing & DevOps",
    blurb: "Getting it verified, then getting it live.",
    items: [
      { name: "Git", level: "core" },
      { name: "GitHub", level: "core" },
      { name: "Vercel", level: "core" },
      { name: "Vitest", level: "strong" },
      { name: "Integration testing", level: "strong" },
      { name: "Docker", level: "strong" },
      { name: "Render", level: "strong" },
      { name: "Cloudflare R2", level: "working", aliases: ["R2"] },
    ],
  },
  {
    id: "design",
    label: "Design & UI",
    blurb: "Enough design sense to build the thing, not just wire it.",
    items: [
      { name: "Figma", level: "strong" },
      { name: "Design systems", level: "strong" },
      { name: "Component libraries", level: "strong" },
    ],
  },
];

/**
 * True when one entry in a project's `stack` refers to this skill.
 * Case-insensitive, alias-aware. Shared by `/api/skills` and the command
 * palette so both agree on what counts as evidence.
 */
export function matchesTech(skill: Skill, tech: string): boolean {
  const t = tech.trim().toLowerCase();
  if (skill.name.toLowerCase() === t) return true;
  return (skill.aliases ?? []).some((a) => a.toLowerCase() === t);
}
