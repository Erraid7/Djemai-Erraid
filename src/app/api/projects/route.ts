import { NextResponse } from "next/server";
import { projects } from "@/lib/seed/projects";

/**
 * GET /api/projects
 * GET /api/projects?stack=Prisma   -- only projects shipped with that tech
 *
 * The `stack` filter is what the Skills view links into: clicking a skill
 * fires a real, shareable request rather than filtering in component state.
 * Matching is case-insensitive and substring-based so "express" finds both
 * "Express" and "Express.js" as they're spelled across the seed data.
 */
export async function GET(request: Request) {
  const stack = new URL(request.url).searchParams.get("stack")?.trim();

  if (!stack) {
    return NextResponse.json({
      status: 200,
      statusText: "OK",
      data: projects,
    });
  }

  const needle = stack.toLowerCase();
  const matched = projects.filter((p) =>
    p.stack.some((tech) => {
      const t = tech.toLowerCase();
      return t === needle || t.includes(needle) || needle.includes(t);
    }),
  );

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: matched,
    tests: [
      { label: `filter: stack=${stack}`, pass: true },
      {
        label: `${matched.length} of ${projects.length} projects matched`,
        pass: matched.length > 0,
      },
    ],
  });
}
