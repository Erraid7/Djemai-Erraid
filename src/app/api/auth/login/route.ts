import { NextResponse } from "next/server";

const DJANGO_API_URL =
  process.env.DJANGO_API_URL ?? "http://localhost:8000/api";

export async function POST(request: Request) {
  let body = {};

  try {
    body = await request.json();
  } catch {
    // Ignore empty bodies.
  }

  const res = await fetch(`${DJANGO_API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(
    {
      status: res.status,
      statusText: res.statusText,
      data: data.data,
      _meta: {
        time: 0, // optional if your client fills this in
        size: JSON.stringify(data.data).length,
      },
    },
    {
      status: res.status,
    }
  );
}