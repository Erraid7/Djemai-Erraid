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

      <ul className="grid gap-2">
        {projects.map((p) => {
          const preview = p.stack.slice(0, 3);
          const extra = p.stack.length - preview.length;
          return (
            <li
              key={p.id}
              className={cn(
                "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors",
                "hover:border-ring/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(p.id)}
                      className="text-left text-base font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {p.name}
                    </button>
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
                    <span className="mono ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      id: {p.id}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {p.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(p.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-ring hover:bg-surface-3"
                >
                  More details
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
