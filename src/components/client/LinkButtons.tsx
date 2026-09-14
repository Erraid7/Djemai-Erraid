import { Ban, ExternalLink, Github, PlayCircle, Rocket } from "lucide-react";
import type { Project, ProjectLink } from "@/lib/types";
import { cn } from "@/lib/utils";

type Icon = React.ComponentType<{ className?: string }>;

type Slot = ProjectLink & { key: string; text: string; icon: Icon };

export function LinkButtons({ links }: { links: Project["links"] }) {
  const slots: Slot[] = [
    { key: "live", ...links.live, text: links.live.label ?? "Live site", icon: ExternalLink },
    { key: "github", ...links.github, text: links.github.label ?? "Source", icon: Github },
    {
      key: "demoVideo",
      ...links.demoVideo,
      text: links.demoVideo.label ?? "Watch demo",
      icon: PlayCircle,
    },
    // Project-specific extras, e.g. a second deployment of the same product.
    ...(links.extra ?? []).map((l, i) => ({
      key: `extra-${i}`,
      ...l,
      text: l.label,
      icon: Rocket,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map(({ key, text, icon: Icon, ...entry }) => {
        if (entry.available && entry.url) {
          return (
            <a
              key={key}
              href={entry.url}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "press group inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-foreground",
                "hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-3 hover:shadow-(--glow-primary)",
              )}
            >
              <Icon className="h-3.5 w-3.5 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />
              {text}
              <span
                aria-hidden
                className="text-muted-foreground transition-transform duration-300 ease-(--e-out-expo) group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              >
                ↗
              </span>
            </a>
          );
        }
        return (
          <span
            key={key}
            title={entry.reason}
            className="inline-flex max-w-full items-start gap-2 rounded-md border border-dashed border-border bg-surface/40 px-3 py-1.5 text-sm text-muted-foreground"
          >
            <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <span className="mr-1 font-medium text-foreground/70">{text}:</span>
              {entry.reason ?? "unavailable"}
            </span>
          </span>
        );
      })}
    </div>
  );
}
