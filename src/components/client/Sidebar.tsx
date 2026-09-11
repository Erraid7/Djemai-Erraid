"use client";

import { useState } from "react";
import { Lock, ChevronDown, Terminal } from "lucide-react";
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

  // Running index across all groups so the entrance stagger reads as one
  // continuous cascade down the rail rather than restarting per section.
  let rowIndex = 0;

  return (
    <aside className="relative flex h-full w-full flex-col border-r border-border bg-surface">
      {/* Faint vertical wash: the rail reads as slightly recessed from the
          main column instead of a flat block of the same value. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/4 via-transparent to-transparent"
      />

      <div className="relative border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 border border-border-strong">
              <AvatarImage src={profile.photoUrl} alt={profile.name} />
              <AvatarFallback className="mono text-sm">
                {profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <span
              aria-hidden
              className="animate-pulse-glow absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-primary"
            />
          </div>
          <div className="min-w-0">
            <div className="mono flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              <Terminal className="h-3 w-3" />
              Portfolio
            </div>
            <div className="bg-linear-to-r from-foreground to-foreground/65 bg-clip-text text-lg font-semibold text-transparent">
              erraid.api
            </div>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 overflow-y-auto px-2 py-3">
        {collections.map((col) => {
          const isProjectsGroup = col.label === "Projects";
          const [headerItem, ...restItems] = col.items;
          const items = isProjectsGroup ? [headerItem] : col.items;
          const subItems = isProjectsGroup ? restItems : [];

          return (
            <div key={col.label} className="mb-3">
              <div className="mono flex items-center gap-2 px-2 py-1 text-[12px] uppercase tracking-[0.2em] text-muted-foreground/70">
                {col.label}
                <span
                  aria-hidden
                  className="h-px flex-1 bg-linear-to-r from-border to-transparent"
                />
              </div>
              <ul className="mt-1 space-y-0.5">
                {items.map((item) => {
                  const isActive =
                    item.url === currentUrl && item.method === currentMethod;
                  const Icon = item.icon;
                  const delay = rowIndex++ * 35;
                  return (
                    <li
                      key={`${item.method}-${item.url}`}
                      className="animate-fade-up"
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      <div
                        className={cn(
                          "spotlight group flex w-full items-stretch overflow-hidden rounded-lg",
                          "transition-colors duration-200 ease-(--e-out-quart)",
                          isActive ? "bg-surface-3" : "hover:bg-surface-2",
                        )}
                      >
                        <span aria-hidden className="spotlight-layer" />
                        {/* Active rail: scales in from the centre instead of
                            fading, so switching rows feels connected. */}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-0 top-1/2 w-0.75 -translate-y-1/2 rounded-full bg-primary",
                            "origin-center transition-[height,opacity] duration-300 ease-(--e-out-expo)",
                            isActive
                              ? "h-5 opacity-100 shadow-[0_0_10px_0_var(--primary)]"
                              : "h-0 opacity-0",
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(item.method, item.url, item.locked);
                            if (isProjectsGroup) setProjectsOpen(true);
                          }}
                          className="relative z-10 flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left"
                        >
                          <MethodBadge
                            method={item.method}
                            className="w-11 shrink-0 text-right"
                          />
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-all duration-200 ease-(--e-out-quart)",
                              isActive
                                ? "scale-110 text-primary"
                                : "text-muted-foreground group-hover:scale-110 group-hover:text-foreground",
                            )}
                          />
                          <span
                            className={cn(
                              "mono truncate text-[15px] transition-colors duration-200",
                              isActive
                                ? "text-foreground"
                                : "text-foreground/85 group-hover:text-foreground",
                            )}
                          >
                            {item.url}
                          </span>
                          {item.locked ? (
                            <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-rotate-12" />
                          ) : null}
                        </button>
                        {isProjectsGroup && (
                          <button
                            type="button"
                            onClick={() => setProjectsOpen((v) => !v)}
                            aria-label={
                              projectsOpen
                                ? "Collapse project list"
                                : "Expand project list"
                            }
                            aria-expanded={projectsOpen}
                            className="relative z-10 flex shrink-0 items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-300 ease-(--e-out-expo)",
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
                // grid-rows 0fr -> 1fr animates to the content's real height,
                // so the list never has to guess a max-height.
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-350 ease-(--e-out-expo)",
                    projectsOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <ul className="mt-1 space-y-0.5 overflow-hidden">
                    {subItems.map((item, i) => {
                      const isActive =
                        item.url === currentUrl && item.method === currentMethod;
                      const Icon = item.icon;
                      return (
                        <li key={`${item.method}-${item.url}`} className="pl-3">
                          <button
                            type="button"
                            onClick={() =>
                              onSelect(item.method, item.url, item.locked)
                            }
                            style={{
                              transitionDelay: projectsOpen ? `${i * 30}ms` : "0ms",
                            }}
                            className={cn(
                              "group relative flex w-full items-center gap-2.5 rounded-lg border-l-2 py-2 pl-3 pr-3 text-left",
                              "transition-all duration-300 ease-(--e-out-expo)",
                              projectsOpen
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-2 opacity-0",
                              isActive
                                ? "border-primary bg-surface-3"
                                : "border-border hover:border-border-strong hover:bg-surface-2",
                            )}
                          >
                            <MethodBadge
                              method={item.method}
                              className="w-11 shrink-0 text-right"
                            />
                            <Icon
                              className={cn(
                                "h-3.5 w-3.5 shrink-0 transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground",
                              )}
                            />
                            <span
                              className={cn(
                                "mono truncate text-sm transition-colors",
                                isActive
                                  ? "text-foreground"
                                  : "text-foreground/85 group-hover:text-foreground",
                              )}
                            >
                              {item.url}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="relative border-t border-border bg-background/40 px-4 py-3">
        <div className="mono mb-1 text-[11px] uppercase tracking-[0.2em] text-primary/80">
          Tip
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Try editing{" "}
          <code className="mono rounded border border-border bg-surface-2 px-1 py-0.5 text-foreground">
            /api/projects/7
          </code>{" "}
          in the URL bar — it isn&apos;t listed here.
        </p>
      </div>
    </aside>
  );
}
