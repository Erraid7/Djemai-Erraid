import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestsStrip({
  tests,
}: {
  tests?: { label: string; pass: boolean }[];
}) {
  if (!tests || tests.length === 0) return null;
  const passed = tests.filter((t) => t.pass).length;
  const allPass = passed === tests.length;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface px-4 py-2">
      <span className="mono text-[12px] uppercase tracking-widest text-muted-foreground">
        tests
      </span>
      <span
        className={cn(
          "mono rounded px-1.5 py-0.5 text-[12px] tabular-nums",
          allPass
            ? "bg-status-2xx/10 text-status-2xx"
            : "bg-status-5xx/10 text-status-5xx",
        )}
      >
        {passed}/{tests.length}
      </span>
      {tests.map((t, i) => (
        <span
          key={i}
          className={cn(
            "animate-pop inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[13px]",
            t.pass
              ? "border-status-2xx/40 bg-status-2xx/10 text-status-2xx"
              : "border-status-5xx/40 bg-status-5xx/10 text-status-5xx",
          )}
          style={{ animationDelay: `${i * 70}ms` }}
        >
          {t.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          {t.label}
        </span>
      ))}
    </div>
  );
}
