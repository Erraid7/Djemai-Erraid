import { Lock } from "lucide-react";
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
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 shrink-0 border border-border-strong">
            <AvatarImage src={profile.photoUrl} alt={profile.name} />
            <AvatarFallback className="mono text-[10px]">
              {profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Portfolio
            </div>
            <div className="text-sm font-semibold text-foreground">
              erraid.api
            </div>
          </div>
        </div>
        <div className="mono mt-2 text-[11px] text-muted-foreground">
          v1 · mocked
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {collections.map((col) => (
          <div key={col.label} className="mb-4">
            <div className="mono px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              {col.label}
            </div>
            <ul className="mt-1 space-y-0.5">
              {col.items.map((item) => {
                const isActive =
                  item.url === currentUrl && item.method === currentMethod;
                const Icon = item.icon;
                return (
                  <li key={`${item.method}-${item.url}`}>
                    <button
                      type="button"
                      onClick={() => onSelect(item.method, item.url, item.locked)}
                      className={cn(
                        "group relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-200",
                        "hover:bg-surface-2",
                        isActive && "bg-surface-3",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-primary transition-all duration-200",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <MethodBadge
                        method={item.method}
                        className="w-10 shrink-0 text-right"
                      />
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                      <span className="mono truncate text-[12.5px] text-foreground/90 group-hover:text-foreground">
                        {item.url}
                      </span>
                      {item.locked ? (
                        <Lock className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        <span className="mono">Tip: </span>
        Try editing <span className="mono text-foreground">/api/projects/6</span>{" "}
        in the URL bar.
      </div>
    </aside>
  );
}
