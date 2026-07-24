import { EyeOff, Maximize2, Pin } from "lucide-react";
import type { Project } from "@/lib/types";
import { MediaGallery } from "./MediaGallery";
import { LinkButtons } from "./LinkButtons";
import { cn } from "@/lib/utils";

export function ProjectPreview({
  project,
  onExpand,
  compact,
}: {
  project: Project;
  onExpand?: () => void;
  compact?: boolean;
}) {
  const fallbackReason = !project.media.length
    ? project.links.demoVideo.reason ??
      project.links.live.reason ??
      project.links.github.reason
    : undefined;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
      )}
    >
      {/* Header row */}
      <header className="flex items-start gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h2>
            {project.pinned ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                <Pin className="h-3 w-3" /> pinned
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <EyeOff className="h-3 w-3" /> hidden project
              </span>
            )}
          </div>
          <div className="mt-0.5 text-sm text-muted-foreground">
            {project.role}
          </div>
        </div>
        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Expand
          </button>
        ) : null}
      </header>

      <div className={cn("grid gap-5 px-5 py-5", !compact && "lg:grid-cols-5")}>
        {/* Media */}
        <div className={cn(!compact && "lg:col-span-3")}>
          <MediaGallery
            media={project.media}
            fallbackReason={fallbackReason}
          />
        </div>

        {/* Right column */}
        <div className={cn("space-y-5", !compact && "lg:col-span-2")}>
          <p className="text-[15px] leading-relaxed text-foreground/90">
            {project.summary}
          </p>

          <ul className="space-y-2">
            {project.bullets.map((b, i) => (
              <li
                key={i}
                className="relative pl-4 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.55rem] h-1.5 w-1.5 rounded-full bg-primary/70"
                />
                {b}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="mono rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-foreground/85"
              >
                {s}
              </span>
            ))}
          </div>

          <LinkButtons links={project.links} />
        </div>
      </div>
    </article>
  );
}
