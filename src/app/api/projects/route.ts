import { NextResponse } from "next/server";
import { projects } from "@/lib/seed/projects";

export async function GET() {
  // MOCK: replace with `await prisma.project.findMany()` in the backend phase.
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: projects,
    tests: [
      { label: "status is 200", pass: true },
      { label: "returns array", pass: Array.isArray(projects) },
      { label: `${projects.length} projects present`, pass: projects.length === 7 },
    ],
  });
}
