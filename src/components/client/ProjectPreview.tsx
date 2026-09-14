"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, EyeOff, Maximize2, Pin } from "lucide-react";
import type { Project } from "@/lib/types";
import { MediaGallery } from "./MediaGallery";
import { LinkButtons } from "./LinkButtons";
import { Markdown } from "./Markdown";
import { ProjectStatusBadge } from "./ProjectStatus";
import { cn } from "@/lib/utils";

export function ProjectPreview({
  project,
  onExpand,
  compact,
  caseStudyOpen = false,
}: {
  project: Project;
  onExpand?: () => void;
  compact?: boolean;
  /** Start with the case study expanded (the expanded modal has room for it). */
  caseStudyOpen?: boolean;
}) {
  const fallbackReason = !project.media.length
    ? project.links.demoVideo.reason ??
      project.links.live.reason ??
      project.links.github.reason
    : undefined;

  const metrics = project.metrics ?? [];
  // Stagger bookkeeping: everything after the metrics strip shifts down by it.
  const afterSummary = metrics.length > 0 ? 220 : 180;

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
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h2>
            <ProjectStatusBadge status={project.status} />
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
            placeholder={{ title: project.name, stack: project.stack }}
          />
        </div>

        {/* Right column */}
        <div className={cn("min-w-0 space-y-5", !compact && "lg:col-span-2")}>
          <p
            className="animate-fade-up text-[16px] leading-relaxed text-foreground/90"
            style={{ animationDelay: "120ms" }}
          >
            {project.summary}
          </p>

          {metrics.length > 0 ? (
            // Headline numbers pulled out of the prose, so the strongest
            // evidence is seen before anyone decides whether to read bullets.
            <div className="grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-2">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="animate-fade-up rounded-lg border border-border bg-surface-2/70 px-3 py-2.5"
                  style={{ animationDelay: `${160 + i * 50}ms` }}
                >
                  <div className="mono text-base font-semibold leading-tight tabular-nums text-primary sm:text-lg">
                    {m.value}
                  </div>
                  <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <ul className="space-y-2">
            {project.bullets.map((b, i) => (
              <li
                key={i}
                className="animate-fade-up relative pl-4 text-base leading-relaxed text-muted-foreground"
                style={{ animationDelay: `${afterSummary + i * 70}ms` }}
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
                style={{ animationDelay: `${afterSummary + 160 + i * 40}ms` }}
              >
                {s}
              </span>
            ))}
          </div>

          <div
            className="animate-fade-up"
            style={{
              animationDelay: `${afterSummary + 220 + project.stack.length * 40}ms`,
            }}
          >
            <LinkButtons links={project.links} />
          </div>
        </div>
      </div>

      {project.docsMarkdown ? (
        <CaseStudy
          key={project.id}
          project={project}
          defaultOpen={caseStudyOpen}
        />
      ) : null}
    </article>
  );
}

/**
 * The long-form write-up, inline under the project. It used to live only in
 * the request panel's Docs tab, which almost nobody would think to open.
 */
function CaseStudy({
  project,
  defaultOpen,
}: {
  project: Project;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const words = project.docsMarkdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));

  return (
    <section className="border-t border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-surface-2/60"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-110">
          <BookOpen className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-sm font-semibold text-foreground">Case study</span>
          <span className="mono ml-2 text-[12px] text-muted-foreground">
            {minutes} min read
          </span>
        </span>
        <span className="hidden text-[13px] text-muted-foreground transition-colors group-hover:text-foreground sm:inline">
          {open ? "Collapse" : "Read it"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-(--e-out-expo)",
            open && "rotate-180",
          )}
        />
      </button>

      {/* grid-rows 0fr -> 1fr animates to the real content height. `inert`
          keeps links inside the collapsed text out of the tab order. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-400 ease-(--e-out-expo)",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="px-5 pb-7 pt-1">
            <div className="max-w-3xl border-l border-border pl-5">
              <Markdown source={project.docsMarkdown} skipHeading={project.name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
