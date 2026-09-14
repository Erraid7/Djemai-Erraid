"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "./badges";
import type { ApiEnvelope, Project } from "@/lib/types";
import { ProjectPreview } from "./ProjectPreview";
import { cn } from "@/lib/utils";

const EXIT_MS = 200;

export function ExpandedPreviewModal({
  open,
  response,
  onClose,
  onNavigate,
  canNavigate,
}: {
  open: boolean;
  response: ApiEnvelope<unknown> | null;
  onClose: () => void;
  onNavigate: (offset: 1 | -1) => void;
  canNavigate: boolean;
}) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intentional: this effect exists specifically to sync local
    // mount/closing state to the external `open` prop so an exit animation
    // can play before actually unmounting -- the documented "adjust state
    // when a prop changes" exception, not an accidental effect.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
      const t = setTimeout(() => {
        setRendered(false);
        setClosing(false);
      }, EXIT_MS);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && canNavigate) onNavigate(1);
      else if (e.key === "ArrowLeft" && canNavigate) onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNavigate, canNavigate]);

  // Freeze the page behind the overlay, and hand focus to the panel so the
  // arrow/Escape keys work without the user clicking first.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!rendered || !response) return null;

  const project = (response.data ?? null) as Project | null;
  const isProject =
    project &&
    typeof project === "object" &&
    "stack" in project &&
    "links" in project;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-stretch justify-center bg-black/75 backdrop-blur-md",
        "transition-opacity duration-200 ease-(--e-out-quart)",
        closing ? "opacity-0" : "animate-in fade-in opacity-100",
      )}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Expanded project preview"
        tabIndex={-1}
        className={cn(
          "relative m-4 flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border-strong bg-background outline-none elev-3",
          "transition-[transform,opacity] duration-200 ease-(--e-out-expo)",
          closing ? "scale-[0.97] opacity-0" : "animate-pop",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3">
          <StatusBadge status={response.status} statusText={response.statusText} />
          {response._meta ? (
            <div className="mono flex items-center gap-3 text-[13px] text-muted-foreground">
              <span className="tabular-nums">{response._meta.time}ms</span>
              <span>·</span>
              <span>{formatBytes(response._meta.size)}</span>
            </div>
          ) : null}
          <div className="mono ml-2 hidden truncate text-[14px] text-foreground/70 sm:block">
            expanded preview
          </div>

          {canNavigate ? (
            <div className="mono ml-auto hidden items-center gap-1.5 text-[11px] text-muted-foreground md:flex">
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              <span>to browse</span>
              <Kbd>esc</Kbd>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close expanded preview"
            className={cn(
              "press group inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-sm text-muted-foreground hover:border-border-strong hover:text-foreground",
              canNavigate ? "ml-3" : "ml-auto",
            )}
          >
            <X className="h-3.5 w-3.5 transition-transform duration-300 ease-(--e-out-expo) group-hover:rotate-90" />
            Close
          </button>
        </header>

        <div className="relative flex-1 overflow-y-auto p-6">
          {isProject ? (
            <div key={project.id} className="animate-fade-up">
              <ProjectPreview project={project} caseStudyOpen />
            </div>
          ) : (
            <pre className="mono whitespace-pre-wrap text-sm text-foreground/80">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>

        {canNavigate ? (
          <>
            <ModalNav side="left" onClick={() => onNavigate(-1)} />
            <ModalNav side="right" onClick={() => onNavigate(1)} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function ModalNav({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous project" : "Next project"}
      onClick={onClick}
      className={cn(
        "press absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2.5 text-foreground backdrop-blur elev-2",
        "hover:border-primary/50 hover:bg-surface-3 hover:shadow-(--glow-primary)",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted-foreground">
      {children}
    </kbd>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
