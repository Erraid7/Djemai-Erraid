import { cn } from "@/lib/utils";

export function MethodBadge({
  method,
  className,
}: {
  method: "GET" | "POST";
  className?: string;
}) {
  const color =
    method === "GET"
      ? "text-[color:var(--method-get)]"
      : "text-[color:var(--method-post)]";
  return (
    <span
      className={cn(
        "mono text-[12px] font-bold tracking-wider uppercase",
        color,
        className,
      )}
    >
      {method}
    </span>
  );
}

export function StatusBadge({
  status,
  statusText,
}: {
  status: number;
  statusText?: string;
}) {
  const tone =
    status >= 200 && status < 300
      ? "border-[color:var(--status-2xx)]/40 text-[color:var(--status-2xx)] bg-[color:var(--status-2xx)]/10"
      : status === 401 || status === 429 || status >= 500
        ? "border-[color:var(--status-5xx)]/40 text-[color:var(--status-5xx)] bg-[color:var(--status-5xx)]/10"
        : status >= 400
          ? "border-[color:var(--status-4xx)]/40 text-[color:var(--status-4xx)] bg-[color:var(--status-4xx)]/10"
          : "border-border text-muted-foreground bg-muted";
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-[13px] font-medium",
        tone,
      )}
    >
      <span className="tabular-nums font-semibold">{status}</span>
      {statusText ? <span className="opacity-80">{statusText}</span> : null}
    </span>
  );
}
