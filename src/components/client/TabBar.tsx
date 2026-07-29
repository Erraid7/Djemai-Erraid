import { cn } from "@/lib/utils";

export type RequestTab = "params" | "headers" | "body" | "docs";

const TABS: { id: RequestTab; label: string }[] = [
  { id: "params", label: "Params" },
  { id: "headers", label: "Headers" },
  { id: "body", label: "Body" },
  { id: "docs", label: "Docs" },
];

export function TabBar({
  active,
  onChange,
}: {
  active: RequestTab;
  onChange: (t: RequestTab) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border bg-background px-4">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "relative px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {isActive ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
