import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "./badges";
import type { ApiEnvelope, Project } from "@/lib/types";
import { ProjectPreview } from "./ProjectPreview";

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

  if (!open || !response) return null;

  const project = (response.data ?? null) as Project | null;
  const isProject =
    project && typeof project === "object" && "stack" in project && "links" in project;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative m-4 flex w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3">
          <StatusBadge status={response.status} statusText={response.statusText} />
          {response._meta ? (
            <div className="mono flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>{response._meta.time}ms</span>
              <span>·</span>
              <span>{formatBytes(response._meta.size)}</span>
            </div>
          ) : null}
          <div className="mono ml-2 truncate text-[12px] text-foreground/80">
            expanded preview
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Close
          </button>
        </header>

        <div className="relative flex-1 overflow-y-auto p-6">
          {isProject ? (
            <ProjectPreview project={project} />
          ) : (
            <pre className="mono whitespace-pre-wrap text-xs text-foreground/80">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>

        {canNavigate ? (
          <>
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => onNavigate(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2 text-foreground shadow-lg backdrop-blur transition hover:bg-surface-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => onNavigate(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2 text-foreground shadow-lg backdrop-blur transition hover:bg-surface-3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
