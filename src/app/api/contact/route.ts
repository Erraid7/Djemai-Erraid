import { NextResponse } from "next/server";

// This route accepts the contact form submission.
// It currently logs the message server-side. To actually receive these
// emails, plug in a provider here -- Resend is the simplest option:
//
//   npm install resend
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   await resend.emails.send({
//     from: "portfolio@yourdomain.com",
//     to: "nm_djemai@esi.dz",
//     subject: `Portfolio message from ${name}`,
//     text: message,
//   });
//
// Or swap in Prisma + PostgreSQL to store submissions in a database,
// consistent with the stack used in ESI Flow and Khatma.

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body: ContactBody = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are all required." },
      { status: 400 }
    );
  }

  console.log("New portfolio contact message:", { name, email, message });

  return NextResponse.json({ ok: true });
}
