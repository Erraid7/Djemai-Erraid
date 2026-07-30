import { NextResponse } from "next/server";
import { projects } from "@/lib/seed/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return NextResponse.json(
      {
        status: 404,
        statusText: "Not Found",
        data: { error: `No project with id ${id}.` },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: project,
  });
}