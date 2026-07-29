import { NextResponse } from "next/server";
import { services } from "@/lib/seed/services";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://localhost:8000/api";

export async function GET() {
  try {
    const res = await fetch(`${DJANGO_API_URL}/services/`, {
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
  } catch (error) {
    return NextResponse.json({
      status: 200,
      statusText: "Ok",
      data: services,
    });
  }
}
