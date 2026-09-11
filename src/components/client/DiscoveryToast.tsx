"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { DiscoverableEndpoint } from "@/lib/discovery";
import { cn } from "@/lib/utils";

const VISIBLE_MS = 5000;
const EXIT_MS = 250;

/**
 * The reward for finding an unlisted endpoint. Terminal-styled on purpose --
 * it should read like the app printed a line, not like a marketing toast.
 */
export function DiscoveryToast({
  endpoint,
  found,
  total,
  onDismiss,
}: {
  endpoint: DiscoverableEndpoint | null;
  found: number;
  total: number;
  onDismiss: () => void;
}) {
  if (!endpoint) return null;
  // Keyed so a second discovery remounts the toast and restarts its timers,
  // rather than needing an effect to reset the exit state.
  return (
    <Toast
      key={`${endpoint.method} ${endpoint.url}`}
      endpoint={endpoint}
      found={found}
      total={total}
      onDismiss={onDismiss}
    />
  );
}

function Toast({
  endpoint,
  found,
  total,
  onDismiss,
}: {
  endpoint: DiscoverableEndpoint;
  found: number;
  total: number;
  onDismiss: () => void;
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const hide = setTimeout(() => setExiting(true), VISIBLE_MS);
    const remove = setTimeout(onDismiss, VISIBLE_MS + EXIT_MS);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [onDismiss]);

  const complete = found >= total;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 right-4 z-90 w-[min(22rem,calc(100vw-2rem))]",
        "transition-[opacity,transform] duration-250 ease-(--e-out-expo)",
        exiting
          ? "translate-y-2 opacity-0"
          : "animate-pop translate-y-0 opacity-100",
      )}
    >
      <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-card p-4 elev-3">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {complete ? "all endpoints found" : "endpoint discovered"}
            </div>
            <div className="mono mt-1 truncate text-sm text-foreground">
              {endpoint.method} {endpoint.url}
            </div>
            <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
              {complete
                ? "That's every route on the site. Try GET /api/secret if you haven't."
                : `${endpoint.label} — it's in the sidebar now.`}
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-linear-to-r from-primary/60 to-primary transition-[width] duration-700 ease-(--e-out-expo)"
                  style={{ width: `${(found / total) * 100}%` }}
                />
              </div>
              <span className="mono text-[11px] tabular-nums text-muted-foreground">
                {found}/{total}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="press -mr-1 -mt-1 shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
