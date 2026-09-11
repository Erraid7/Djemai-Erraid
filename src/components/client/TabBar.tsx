"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  bodyHint,
}: {
  active: RequestTab;
  onChange: (t: RequestTab) => void;
  /** Draws an attention dot on Body when that tab holds a composer. */
  bodyHint?: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<RequestTab, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(
    null,
  );

  const measure = useCallback(() => {
    const el = tabRefs.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width });
  }, [active]);

  // Measure before paint so the indicator never flashes at the wrong offset.
  useLayoutEffect(measure, [measure]);

  // Font loading and resize both shift tab widths after first paint.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  function onKeyDown(e: React.KeyboardEvent) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === active);
    const next = TABS[(i + dir + TABS.length) % TABS.length]!;
    onChange(next.id);
    tabRefs.current[next.id]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Request details"
      onKeyDown={onKeyDown}
      className="relative flex items-center gap-0.5 border-b border-border bg-background px-4"
    >
      {/* Single sliding underline shared by all tabs -- reads as one object
          moving rather than four independent bars blinking on and off.
          `left-0` is load-bearing: without it the static position of an
          absolute child of a flex container is the *content* box, which would
          add this row's px-4 on top of the offset already measured from
          getBoundingClientRect's border box. */}
      {indicator ? (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width] duration-300 ease-(--e-out-expo)"
          style={{
            width: `${Math.max(indicator.width - 16, 8)}px`,
            transform: `translateX(${indicator.left + 8}px)`,
            boxShadow: "0 0 12px 0 color-mix(in oklab, var(--primary) 60%, transparent)",
          }}
        />
      ) : null}

      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative rounded-t-md px-3 py-2.5 text-sm font-medium",
              "transition-colors duration-200 ease-(--e-out-quart)",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
            )}
          >
            {t.label}
            {t.id === "body" && bodyHint && !isActive ? (
              <span
                aria-hidden
                className="absolute right-0.5 top-1.5 h-1.5 w-1.5 rounded-full bg-method-post"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
