import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * SheetHeader mimics an architectural drawing's title block:
 * a sheet number, a section title, and a short descriptor —
 * consistent scaffolding that reinforces the "blueprint" concept
 * without decorating for its own sake.
 */
export function SheetHeader({
  index,
  total,
  title,
  descriptor,
}: {
  index: string;
  total: string;
  title: string;
  descriptor: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-baseline gap-3 bp-label">
        <span className="text-signal">SHEET {index}/{total}</span>
        <span className="h-px flex-1 bg-line-soft" />
        <span>{descriptor}</span>
      </div>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function CornerFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`bp-corners ${className}`}>{children}</div>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-line-soft bg-bg-raised px-2 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-muted">
      {children}
    </span>
  );
}
