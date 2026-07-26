import { ArrowRight, EyeOff, Pin } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectListPreview({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (id: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {projects.length} projects
          </h2>
          <p className="text-xs text-muted-foreground">
            The sidebar pins the highlights. Everything the API returns is here.
          </p>
        </div>
        <span className="mono rounded-md border border-border bg-surface-2 px-2 py-1 text-[11px] text-muted-foreground">
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
              className="animate-in fade-in slide-in-from-bottom-1 duration-500 [animation-fill-mode:backwards]"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <button
                type="button"
                onClick={() => onOpen(p.id)}
                className={cn(
                  "group flex w-full flex-col gap-3 rounded-lg border border-l-2 bg-card p-4 text-left",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:border-ring hover:shadow-md",
                  p.pinned ? "border-border border-l-primary/50" : "border-dashed border-border border-l-border-strong",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-foreground group-hover:text-primary">
                        {p.name}
                      </span>
                      {p.pinned ? (
                        <Pin
                          className="h-3.5 w-3.5 text-primary/70"
                          aria-label="pinned"
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-3 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> hidden
                        </span>
                      )}
                      <span className="mono rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        id: {p.id}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {p.role}
                    </div>
                  </div>
                  <span className="mono inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-all group-hover:gap-1.5 group-hover:text-primary">
                    details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-foreground/85">
                  {p.summary}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {preview.map((s) => (
                    <span
                      key={s}
                      className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10.5px] text-foreground/80"
                    >
                      {s}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="mono rounded border border-dashed border-border px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
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
