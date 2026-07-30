import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactBody = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        status: 400,
        statusText: "Bad Request",
        data: {
          error: "Invalid request body.",
        },
      },
      { status: 400 }
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      {
        status: 400,
        statusText: "Bad Request",
        data: {
          error: "Name, email and message are required.",
        },
      },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        status: 400,
        statusText: "Bad Request",
        data: {
          error: "Invalid email address.",
        },
      },
      { status: 400 }
    );
  }

  if (!CONTACT_FROM_EMAIL || !CONTACT_RECEIVER_EMAIL) {
    console.error("Missing email environment variables.");

    return NextResponse.json(
      {
        status: 500,
        statusText: "Internal Server Error",
        data: {
          error: "Email service is not configured.",
        },
      },
      { status: 500 }
    );
  }

  try {
    await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_RECEIVER_EMAIL,
      subject: `Portfolio Contact • ${name}`,
      replyTo: email,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;">
          <h2>New Portfolio Contact</h2>

          <table style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="padding:8px;font-weight:bold;">Name</td>
              <td style="padding:8px;">${escapeHtml(name)}</td>
            </tr>

            <tr>
              <td style="padding:8px;font-weight:bold;">Email</td>
              <td style="padding:8px;">
                <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
              </td>
            </tr>
          </table>

          <h3 style="margin-top:30px;">Message</h3>

          <div
            style="
              white-space:pre-wrap;
              background:#f6f6f6;
              padding:18px;
              border-radius:8px;
            "
          >
${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      status: 202,
      statusText: "Accepted",
      data: {
        message: "Message sent successfully.",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 500,
        statusText: "Internal Server Error",
        data: {
          error: "Failed to send message.",
        },
      },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}