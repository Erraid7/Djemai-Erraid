import { NextResponse } from "next/server";
import { projects } from "@/lib/seed/projects";

export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: projects,
  });
}
