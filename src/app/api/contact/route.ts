import { NextResponse } from "next/server";

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

  // MOCK: replace with real email send / DB insert in the backend phase.
  console.log("[contact] queued", { name, email });

  return NextResponse.json(
    {
      status: 202,
      statusText: "Accepted",
      data: { queued: true, receivedAt: new Date().toISOString() },
    },
    { status: 202 }
  );
}
