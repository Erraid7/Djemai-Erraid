import { NextResponse } from "next/server";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://localhost:8000/api";
type ContactBody = { name?: string; email?: string; message?: string };

export async function POST(request: Request) {
  let body: ContactBody = {};
  try {
    body = await request.json();
  } catch {
    // fallthrough -- validation below handles the empty-body case
  }
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      {
        status: 400,
        statusText: "Bad Request",
        data: { error: "name, email, and message are required." },
      },
      { status: 400 }
    );
  }

  
  console.log("[contact] queued", { name, email });

  try {
  const res = await fetch(`${DJANGO_API_URL}/contact/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  });

  if (!res.ok) {
    const body = await res.json();
    return NextResponse.json(
      {
        status: res.status,
        statusText: res.statusText,
        data: body,
      },
      { status: res.status }
    );
  }

  return NextResponse.json({
    status: res.status,
    statusText: res.statusText,
    data: { message: "Message sent successfully." },
  });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      statusText: "Internal Server Error",
      data: { error: "Failed to send message." },
    });
  }
}
