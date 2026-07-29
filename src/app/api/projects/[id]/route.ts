import { NextResponse } from "next/server";
import { projects } from "@/lib/seed/projects";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://localhost:8000/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  try {
  const res = await fetch(`${DJANGO_API_URL}/projects/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body = await res.json();
  const project = body.data;

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
    status: res.status,
    statusText: res.statusText,
    data: project,
  });
  } catch (error) {
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
      statusText: "Ok",
      data: project,
    });
  }
}
