import { NextResponse } from "next/server";
import { skillCategories } from "@/lib/seed/skills";

export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: skillCategories,
  });
}