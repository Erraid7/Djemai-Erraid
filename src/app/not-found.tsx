import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="app-vignette absolute inset-0" />
        <div className="app-grid absolute inset-0" />
      </div>

      <div className="animate-fade-up relative w-full max-w-md">
        {/* Framed as a response envelope -- the 404 a visitor lands on should
            look like it came from the same API as everything else. */}
        <div className="overflow-hidden rounded-xl border border-border bg-card lit-edge elev-3">
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
            <span className="mono text-[12px] uppercase tracking-widest text-muted-foreground">
              Response
            </span>
            <span className="mono inline-flex items-center gap-2 rounded-md border border-status-4xx/40 bg-status-4xx/10 px-2 py-0.5 text-[13px] font-medium text-status-4xx">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              404 Not Found
            </span>
          </div>

          <div className="px-6 py-7 text-center">
            <h1 className="mono bg-linear-to-b from-foreground to-foreground/40 bg-clip-text text-6xl font-bold text-transparent">
              404
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              No route matches this path
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This page doesn&apos;t exist or has moved. The API client is still
              up — head back and pick a request from the sidebar.
            </p>

            <Link
              href="/"
              className="press group mt-6 inline-flex items-center gap-2 rounded-md bg-linear-to-b from-[color-mix(in_oklab,var(--primary)_92%,white)] to-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-(--glow-primary) hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-(--e-out-expo) group-hover:-translate-x-0.5" />
              Back to the client
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
