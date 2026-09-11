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
      ? "text-method-get"
      : "text-method-post";
  return (
    <span
      className={cn(
        "mono text-[12px] font-bold uppercase tracking-wider",
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
  const ok = status >= 200 && status < 300;
  const severe = status === 401 || status === 429 || status >= 500;
  const tone = ok
    ? "border-status-2xx/40 text-status-2xx bg-status-2xx/10"
    : severe
      ? "border-status-5xx/40 text-status-5xx bg-status-5xx/10"
      : status >= 400
        ? "border-status-4xx/40 text-status-4xx bg-status-4xx/10"
        : "border-border text-muted-foreground bg-muted";

  return (
    // Keyed on status so a new response replays the pop -- the status code is
    // the one thing a user checks first, so it earns the motion.
    <span
      key={status}
      className={cn(
        "animate-pop mono inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-[13px] font-medium",
        tone,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          ok ? "" : "animate-pulse",
        )}
      />
      <span className="font-semibold tabular-nums">{status}</span>
      {statusText ? <span className="opacity-80">{statusText}</span> : null}
    </span>
  );
}
