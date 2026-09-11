"use client";

import { ArrowRight, EyeOff, Pin } from "lucide-react";
import type { Project } from "@/lib/types";
import { spotlightMove } from "@/lib/spotlight";
import { cn } from "@/lib/utils";

export function ProjectListPreview({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (id: number) => void;
}) {
  const pinnedCount = projects.filter((p) => p.pinned).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-baseline gap-2 text-lg font-semibold text-foreground">
            <span className="mono text-2xl tabular-nums text-primary">
              {projects.length}
            </span>
            projects
          </h2>
          <p className="text-sm text-muted-foreground">
            The sidebar pins {pinnedCount} highlights. Everything the API returns
            is here.
          </p>
        </div>
        <span className="mono rounded-md border border-border bg-surface-2 px-2 py-1 text-[13px] text-muted-foreground">
          Project[]
        </span>
      </div>

      <ul className="grid gap-2.5">
        {projects.map((p, i) => {
          const preview = p.stack.slice(0, 3);
          const extra = p.stack.length - preview.length;
          return (
            <li
              key={p.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                type="button"
                onClick={() => onOpen(p.id)}
                onPointerMove={spotlightMove}
                className={cn(
                  "spotlight group flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-l-2 bg-card p-4 text-left",
                  "transition-[transform,border-color,box-shadow] duration-300 ease-(--e-out-quart)",
                  "hover:-translate-y-0.5 hover:border-border-strong hover:elev-2",
                  p.pinned
                    ? "border-border border-l-primary/60 hover:border-l-primary"
                    : "border-dashed border-border border-l-border-strong",
                )}
              >
                <span aria-hidden className="spotlight-layer" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                        {p.name}
                      </span>
                      {p.pinned ? (
                        <Pin
                          className="h-3.5 w-3.5 text-primary/70 transition-transform duration-300 ease-(--e-spring) group-hover:rotate-12 group-hover:scale-110"
                          aria-label="pinned"
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-3 px-1.5 py-0.5 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> hidden
                        </span>
                      )}
                      <span className="mono rounded bg-surface-2 px-1.5 py-0.5 text-[12px] text-muted-foreground">
                        id: {p.id}
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {p.role}
                    </div>
                  </div>
                  <span className="mono inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                    <span className="hidden sm:inline">details</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-(--e-out-expo) group-hover:translate-x-1" />
                  </span>
                </div>

                <p className="relative text-base leading-relaxed text-foreground/85">
                  {p.summary}
                </p>

                <div className="relative flex flex-wrap gap-1.5">
                  {preview.map((s) => (
                    <span
                      key={s}
                      className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[12.5px] text-foreground/80 transition-colors duration-200 group-hover:border-border-strong"
                    >
                      {s}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="mono rounded border border-dashed border-border px-1.5 py-0.5 text-[12.5px] text-muted-foreground">
                      +{extra} more
                    </span>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
