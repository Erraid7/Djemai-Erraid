import { ExternalLink, Github, PlayCircle, Ban } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type Kind = "live" | "github" | "demoVideo";

const LABELS: Record<Kind, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  live: { label: "Live site", icon: ExternalLink },
  github: { label: "Source", icon: Github },
  demoVideo: { label: "Watch demo", icon: PlayCircle },
};

export function LinkButtons({ links }: { links: Project["links"] }) {
  const kinds: Kind[] = ["live", "github", "demoVideo"];
  return (
    <div className="flex flex-wrap gap-2">
      {kinds.map((k) => {
        const entry = links[k];
        const meta = LABELS[k];
        const Icon = meta.icon;
        if (entry.available && entry.url) {
          return (
            <a
              key={k}
              href={entry.url}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "group inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-foreground",
                "transition-colors hover:border-ring hover:bg-surface-3",
              )}
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {meta.label}
              <span aria-hidden className="text-muted-foreground group-hover:text-foreground">
                ↗
              </span>
            </a>
          );
        }
        return (
          <span
            key={k}
            title={entry.reason}
            className={cn(
              "inline-flex max-w-full items-start gap-2 rounded-md border border-dashed border-border bg-surface/40 px-3 py-1.5 text-sm text-muted-foreground",
            )}
          >
            <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <span className="mr-1 font-medium text-foreground/70">
                {meta.label}:
              </span>
              {entry.reason ?? "unavailable"}
            </span>
          </span>
        );
      })}
    </div>
  );
}
