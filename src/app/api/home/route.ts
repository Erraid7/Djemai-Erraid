import { NextResponse } from "next/server";
import { home } from "@/lib/seed/home";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://localhost:8000/api";

export async function GET() {
  const res = await fetch(`${DJANGO_API_URL}/home/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body = await res.json();
  return NextResponse.json({
    status: res.status,
    statusText: res.statusText,
    data: body.data,
  });
}
