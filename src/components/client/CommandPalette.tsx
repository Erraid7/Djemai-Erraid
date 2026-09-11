"use client";

import { useEffect, useMemo } from "react";
import { FolderGit2, Layers, Sparkles } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { collections } from "@/lib/collections";
import { projects } from "@/lib/seed/projects";
import { skillCategories, matchesTech } from "@/lib/seed/skills";
import type { HttpMethod } from "@/hooks/useApiClient";
import { MethodBadge } from "./badges";
import { cn } from "@/lib/utils";

/**
 * ⌘K palette over every endpoint, project and technology on the site.
 *
 * Built on the `cmdk` wrapper that already shipped in components/ui but was
 * never wired to anything. Deliberately not using `CommandDialog`: this owns
 * its own overlay so it can match the rest of the app's motion and chrome
 * instead of the default shadcn dialog.
 */
export function CommandPalette({
  open,
  onOpenChange,
  onRun,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRun: (url: string, method: HttpMethod) => void;
}) {
  // Only technologies with real project evidence are offered as filters --
  // a filter that always returns nothing is just a dead end.
  const stacks = useMemo(() => {
    const out: { name: string; count: number }[] = [];
    for (const cat of skillCategories) {
      for (const skill of cat.items) {
        const count = projects.filter((p) =>
          p.stack.some((tech) => matchesTech(skill, tech)),
        ).length;
        if (count > 0) out.push({ name: skill.name, count });
      }
    }
    return out.sort((a, b) => b.count - a.count);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Freeze the page behind the palette while it's up.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  function run(url: string, method: HttpMethod) {
    onOpenChange(false);
    onRun(url, method);
  }

  const endpoints = collections.flatMap((c) =>
    c.items.map((item) => ({ ...item, group: c.label })),
  );

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-100 flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-md duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="animate-pop w-full max-w-xl overflow-hidden rounded-2xl border border-border-strong bg-popover elev-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          loop
          className="bg-transparent [&_[cmdk-group-heading]]:mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground/70"
        >
          <CommandInput placeholder="Search endpoints, projects, technologies…" />
          <CommandList className="max-h-[min(24rem,60vh)]">
            <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
              Nothing matches. Try “projects”, “Prisma”, or “contact”.
            </CommandEmpty>

            <CommandGroup heading="Endpoints">
              {endpoints.map((item) => (
                <CommandItem
                  key={`${item.method}-${item.url}`}
                  value={`${item.url} ${item.group} endpoint`}
                  onSelect={() => run(item.url, item.method)}
                  className={itemClass}
                >
                  <MethodBadge
                    method={item.method}
                    className="w-10 shrink-0 text-right"
                  />
                  <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="mono truncate">{item.url}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.role} ${p.stack.join(" ")} project`}
                  onSelect={() => run(`/api/projects/${p.id}`, "GET")}
                  className={itemClass}
                >
                  <FolderGit2 className="ml-10 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{p.name}</span>
                  <span className="mono ml-auto shrink-0 text-[11px] text-muted-foreground">
                    /api/projects/{p.id}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Filter projects by tech">
              {stacks.map((s) => (
                <CommandItem
                  key={s.name}
                  value={`${s.name} stack filter technology`}
                  onSelect={() =>
                    run(
                      `/api/projects?stack=${encodeURIComponent(s.name)}`,
                      "GET",
                    )
                  }
                  className={itemClass}
                >
                  <Layers className="ml-10 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{s.name}</span>
                  <span className="mono ml-auto shrink-0 text-[11px] tabular-nums text-primary/80">
                    {s.count}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <div className="mono flex items-center gap-3 border-t border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
            <Hint keys="↑↓">navigate</Hint>
            <Hint keys="↵">run</Hint>
            <Hint keys="esc">close</Hint>
            <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground/70">
              <Sparkles className="h-3 w-3" />
              some routes aren&apos;t listed
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

const itemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/85 data-[selected=true]:bg-surface-3 data-[selected=true]:text-foreground";

function Hint({ keys, children }: { keys: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <kbd
        className={cn(
          "rounded border border-border bg-surface-2 px-1 py-0.5 text-[10px] text-muted-foreground",
        )}
      >
        {keys}
      </kbd>
      {children}
    </span>
  );
}
