import { NextResponse } from "next/server";
import { coffee } from "@/lib/seed/secrets";

// 418 is a real status code and this is a real route handler returning it.
export async function GET() {
  return NextResponse.json(
    {
      status: 418,
      statusText: "I'm a teapot",
      data: coffee,
      tests: [
        { label: "brew coffee", pass: false },
        { label: "brew tea", pass: true },
      ],
    },
    { status: 418 },
  );
}
