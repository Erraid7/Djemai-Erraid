"use client";

import { useState } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { collections } from "@/lib/collections";
import { MethodBadge } from "./badges";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profile } from "@/lib/seed/profile";

export function Sidebar({
  currentUrl,
  currentMethod,
  onSelect,
}: {
  currentUrl: string;
  currentMethod: "GET" | "POST";
  onSelect: (method: "GET" | "POST", url: string, locked?: boolean) => void;
}) {
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border border-border-strong">
            <AvatarImage src={profile.photoUrl} alt={profile.name} />
            <AvatarFallback className="mono text-sm">
              {profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="mono text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Portfolio
            </div>
            <div className="text-lg font-semibold text-foreground">
              erraid.api
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {collections.map((col) => {
          const isProjectsGroup = col.label === "Projects";
          const [headerItem, ...restItems] = col.items;
          const items = isProjectsGroup ? [headerItem] : col.items;
          const subItems = isProjectsGroup ? restItems : [];

          return (
            <div key={col.label} className="mb-2">
              <div className="mono px-2 py-1 text-[13px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {col.label}
              </div>
              <ul className="mt-1 space-y-1">
                {items.map((item) => {
                  const isActive =
                    item.url === currentUrl && item.method === currentMethod;
                  const Icon = item.icon;
                  return (
                    <li key={`${item.method}-${item.url}`}>
                      <div
                        className={cn(
                          "group relative flex w-full items-stretch overflow-hidden rounded-lg transition-colors duration-200",
                          "hover:bg-surface-2",
                          isActive && "bg-surface-3",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-all duration-200",
                            isActive ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(item.method, item.url, item.locked);
                            if (isProjectsGroup) setProjectsOpen(true);
                          }}
                          className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 text-left"
                        >
                          <MethodBadge
                            method={item.method}
                            className="w-11 shrink-0 text-right"
                          />
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                          <span className="mono truncate text-base text-foreground/90 group-hover:text-foreground">
                            {item.url}
                          </span>
                          {item.locked ? (
                            <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          ) : null}
                        </button>
                        {isProjectsGroup && (
                          <button
                            type="button"
                            onClick={() => setProjectsOpen((v) => !v)}
                            aria-label={projectsOpen ? "Collapse project list" : "Expand project list"}
                            aria-expanded={projectsOpen}
                            className="flex shrink-0 items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                projectsOpen && "rotate-180",
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {isProjectsGroup && (
                <ul
                  className={cn(
                    "mt-1 space-y-1 overflow-hidden transition-all duration-300",
                    projectsOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {subItems.map((item) => {
                    const isActive =
                      item.url === currentUrl && item.method === currentMethod;
                    const Icon = item.icon;
                    return (
                      <li key={`${item.method}-${item.url}`} className="pl-3">
                        <button
                          type="button"
                          onClick={() => onSelect(item.method, item.url, item.locked)}
                          className={cn(
                            "group relative flex w-full items-center gap-2.5 rounded-lg border-l-2 border-border py-2.5 pl-3 pr-3 text-left transition-colors duration-200",
                            "hover:bg-surface-2 hover:border-border-strong",
                            isActive && "border-primary bg-surface-3",
                          )}
                        >
                          <MethodBadge
                            method={item.method}
                            className="w-11 shrink-0 text-right"
                          />
                          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                          <span className="mono truncate text-[15px] text-foreground/90 group-hover:text-foreground">
                            {item.url}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
        <span className="mono">Tip: </span>
        Try editing <span className="mono text-foreground">/api/projects/7</span>{" "}
        in the URL bar.
      </div>
    </aside>
  );
}
