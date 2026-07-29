import { Check, X } from "lucide-react";

export function TestsStrip({
  tests,
}: {
  tests?: { label: string; pass: boolean }[];
}) {
  if (!tests || tests.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface px-4 py-2">
      <span className="mono text-[12px] uppercase tracking-widest text-muted-foreground">
        tests
      </span>
      {tests.map((t, i) => (
        <span
          key={i}
          className={
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[13px] " +
            (t.pass
              ? "border-[color:var(--status-2xx)]/40 bg-[color:var(--status-2xx)]/10 text-[color:var(--status-2xx)]"
              : "border-[color:var(--status-5xx)]/40 bg-[color:var(--status-5xx)]/10 text-[color:var(--status-5xx)]")
          }
        >
          {t.pass ? (
            <Check className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
          {t.label}
        </span>
      ))}
    </div>
  );
}
