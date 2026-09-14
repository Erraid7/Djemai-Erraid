import { Briefcase, CircleCheck, Lock, MonitorPlay, type LucideIcon } from "lucide-react";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE: Record<
  ProjectStatus["kind"],
  { className: string; icon: LucideIcon | null }
> = {
  // `null` icon = a live dot, which reads as "running" faster than any glyph.
  live: {
    className: "border-status-2xx/40 bg-status-2xx/10 text-status-2xx",
    icon: null,
  },
  demo: {
    className: "border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent",
    icon: MonitorPlay,
  },
  "hosted-private": {
    className: "border-border-strong bg-surface-3 text-muted-foreground",
    icon: Lock,
  },
  internship: {
    className: "border-method-post/40 bg-method-post/10 text-method-post",
    icon: Briefcase,
  },
  completed: {
    className: "border-border bg-surface-2 text-muted-foreground",
    icon: CircleCheck,
  },
};

export function ProjectStatusBadge({
  status,
  size = "md",
}: {
  status: ProjectStatus;
  size?: "sm" | "md";
}) {
  const tone = TONE[status.kind];
  const Icon = tone.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-[12px]",
        tone.className,
      )}
    >
      {Icon ? (
        <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {status.label}
    </span>
  );
}
