"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/data/portfolio";
import { Container, SheetHeader } from "./ui";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28">
      <Container>
        <SheetHeader
          index="05"
          total="05"
          title="Get in touch"
          descriptor="Summer 2026 internship"
        />

        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="max-w-md text-ink-muted">
              Open to Summer 2026 internships in full-stack or backend-heavy
              roles. The fastest way to reach me is email, or send a message
              directly here.
            </p>
            <div className="mt-8 space-y-3 font-mono text-sm">
              <a href={`mailto:${profile.email}`} className="block text-ink hover:text-signal">
                {profile.email}
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="block text-ink-muted hover:text-signal">
                github.com/Erraid7 ↗
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="block text-ink-muted hover:text-signal">
                linkedin.com/in/djemai-mohamed-erraid ↗
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="bp-label mb-2 block">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-sm border border-line-soft bg-bg-raised px-3.5 py-2.5 text-sm text-ink outline-none focus:border-signal"
              />
            </div>
            <div>
              <label htmlFor="email" className="bp-label mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-sm border border-line-soft bg-bg-raised px-3.5 py-2.5 text-sm text-ink outline-none focus:border-signal"
              />
            </div>
            <div>
              <label htmlFor="message" className="bp-label mb-2 block">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full resize-none rounded-sm border border-line-soft bg-bg-raised px-3.5 py-2.5 text-sm text-ink outline-none focus:border-signal"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-sm bg-signal px-5 py-3 font-mono text-sm font-medium tracking-wide text-bg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "sent" && (
              <p className="font-mono text-xs text-success">Message sent — thanks, I&apos;ll reply soon.</p>
            )}
            {status === "error" && (
              <p className="font-mono text-xs text-signal">
                Something went wrong — email me directly at {profile.email}.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
