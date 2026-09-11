import { NextResponse } from "next/server";
import { skillCategories, matchesTech } from "@/lib/seed/skills";
import { projects } from "@/lib/seed/projects";

export async function GET() {
  // MOCK: derived in-process from the seed modules. A real backend would do
  // this as a join between a skills table and a project_stack table; the
  // response shape below is what the frontend consumes either way.
  const data = skillCategories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    blurb: cat.blurb,
    items: cat.items.map((skill) => {
      const evidence = projects.filter((p) =>
        p.stack.some((tech) => matchesTech(skill, tech)),
      );
      return {
        name: skill.name,
        level: skill.level,
        // Objective backing for the level claim: the actual projects on this
        // site that shipped with this technology.
        projects: evidence.map((p) => ({ id: p.id, name: p.name })),
      };
    }),
  }));

  const all = data.flatMap((c) => c.items);
  const backed = all.filter((s) => s.projects.length > 0);
  const core = all.filter((s) => s.level === "core");

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data,
    tests: [
      {
        label: `${all.length} skills across ${data.length} categories`,
        pass: true,
      },
      {
        label: `${backed.length} backed by shipped projects`,
        pass: backed.length > 0,
      },
      {
        label: `${core.length} rated core`,
        pass: core.length > 0,
      },
    ],
  });
}
