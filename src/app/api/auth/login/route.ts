import { NextResponse } from "next/server";

// In-memory rate-limit tracker. Worker instances are ephemeral; this is fine
// for a joke endpoint -- the whole route is a mock. No real credential
// handling of any kind happens here.
const attempts = new Map<string, number[]>();
const WINDOW_MS = 10_000;
const LIMIT = 3;

export async function POST(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for") ??
    "anon";
  const now = Date.now();
  const prev = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  prev.push(now);
  attempts.set(ip, prev);

  if (prev.length > LIMIT) {
    return NextResponse.json(
      {
        status: 429,
        statusText: "Too Many Requests",
        data: { error: "Too many attempts — try again in a few seconds." },
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      status: 401,
      statusText: "Unauthorized",
      data: { error: "Nice try — this one needs an actual offer letter." },
    },
    { status: 401 }
  );
}