"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="app-vignette absolute inset-0" />
        <div className="app-grid absolute inset-0" />
      </div>

      <div className="animate-fade-up relative w-full max-w-md">
        <div className="overflow-hidden rounded-xl border border-border bg-card lit-edge elev-3">
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
            <span className="mono text-[12px] uppercase tracking-widest text-muted-foreground">
              Response
            </span>
            <span className="mono inline-flex items-center gap-2 rounded-md border border-status-5xx/40 bg-status-5xx/10 px-2 py-0.5 text-[13px] font-medium text-status-5xx">
              <span
                aria-hidden
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
              />
              500 Internal Error
            </span>
          </div>

          <div className="px-6 py-7 text-center">
            <h1 className="mono bg-linear-to-b from-foreground to-foreground/40 bg-clip-text text-6xl font-bold text-transparent">
              500
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              This page didn&apos;t load
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Something went wrong on our end. Retry the request, or head back
              to the client.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={reset}
                className="press group inline-flex items-center gap-2 rounded-md bg-linear-to-b from-[color-mix(in_oklab,var(--primary)_92%,white)] to-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-(--glow-primary) hover:brightness-110"
              >
                <RotateCw className="h-4 w-4 transition-transform duration-500 ease-(--e-out-expo) group-hover:rotate-180" />
                Try again
              </button>
              <Link
                href="/"
                className="press group inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-foreground hover:border-border-strong hover:bg-surface-3"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-(--e-out-expo) group-hover:-translate-x-0.5" />
                Go home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
