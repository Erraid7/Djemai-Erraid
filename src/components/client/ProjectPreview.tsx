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
    <article className="lit-edge overflow-hidden rounded-xl border border-border bg-card elev-2">
      {/* Header row */}
      <header className="relative flex items-start gap-4 border-b border-border bg-linear-to-r from-surface-2/80 to-transparent px-5 py-4">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h2>
            {project.pinned ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[12px] font-medium uppercase tracking-wider text-primary">
                <Pin className="h-3 w-3" /> pinned
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-3 px-2 py-0.5 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                <EyeOff className="h-3 w-3" /> hidden project
              </span>
            )}
          </div>
          <div className="mt-0.5 text-base text-muted-foreground">
            {project.role}
          </div>
        </div>
        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            className="press group relative inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-sm text-muted-foreground hover:border-ring hover:bg-surface-3 hover:text-foreground"
          >
            <Maximize2 className="h-3.5 w-3.5 transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />
            Expand
          </button>
        ) : null}
      </header>

      <div className={cn("grid gap-5 px-5 py-5", !compact && "lg:grid-cols-5")}>
        {/* Media */}
        <div
          className={cn("animate-fade-up", !compact && "lg:col-span-3")}
          style={{ animationDelay: "60ms" }}
        >
          {/* Keyed on the project so switching projects gets a fresh gallery
              rather than carrying over the previous slide index. */}
          <MediaGallery
            key={project.id}
            media={project.media}
            fallbackReason={fallbackReason}
          />
        </div>

        {/* Right column */}
        <div className={cn("space-y-5", !compact && "lg:col-span-2")}>
          <p
            className="animate-fade-up text-[16px] leading-relaxed text-foreground/90"
            style={{ animationDelay: "120ms" }}
          >
            {project.summary}
          </p>

          <ul className="space-y-2">
            {project.bullets.map((b, i) => (
              <li
                key={i}
                className="animate-fade-up relative pl-4 text-base leading-relaxed text-muted-foreground"
                style={{ animationDelay: `${180 + i * 70}ms` }}
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
            {project.stack.map((s, i) => (
              <span
                key={s}
                className="mono animate-fade-up cursor-default rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[13px] text-foreground/85 transition-[transform,border-color,color] duration-200 ease-(--e-out-quart) hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
                style={{ animationDelay: `${340 + i * 40}ms` }}
              >
                {s}
              </span>
            ))}
          </div>

          <div
            className="animate-fade-up"
            style={{ animationDelay: `${400 + project.stack.length * 40}ms` }}
          >
            <LinkButtons links={project.links} />
          </div>
        </div>
      </div>
    </article>
  );
}
