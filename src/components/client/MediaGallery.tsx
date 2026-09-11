"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { optimizedMedia, placeholderMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

export function MediaGallery({
  media,
  fallbackReason,
}: {
  media: MediaItem[];
  fallbackReason?: string;
}) {
  const [i, setI] = useState(0);
  // Only slides the user has actually reached get an <img> in the DOM. All
  // slides share one box, so browser lazy-loading would consider every one of
  // them "in viewport" and fetch the lot on mount.
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      if (media.length === 0) return;
      const idx = (next + media.length) % media.length;
      setI(idx);
      setVisited((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
    },
    [media.length],
  );

  if (media.length === 0) {
    return (
      <div className="flex min-h-55 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-2 px-6 py-10 text-center">
        <ImageOff className="mb-3 h-6 w-6 text-muted-foreground" />
        <p className="max-w-sm text-base text-muted-foreground">
          {fallbackReason ??
            "No screenshots or video available for this project yet."}
        </p>
      </div>
    );
  }

  const current = media[i] ?? media[0]!;
  const multiple = media.length > 1;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-black/40 elev-2">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Project media"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!multiple) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(i - 1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(i + 1);
          }
        }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (start === null || !multiple) return;
          const delta = (e.changedTouches[0]?.clientX ?? start) - start;
          if (Math.abs(delta) > 45) go(delta < 0 ? i + 1 : i - 1);
        }}
        className="group/media relative aspect-16/10 w-full overflow-hidden bg-black"
      >
        {current.type === "image" ? (
          <>
            {/* Ambient backdrop: the same frame, blown up and blurred, so a
                letterboxed screenshot sits in its own colour instead of on
                dead black bars. */}
            <div
              aria-hidden
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-2xl transition-[background-image] duration-500"
              style={{ backgroundImage: `url("${placeholderMedia(current.src)}")` }}
            />
            {media.map((m, k) =>
              m.type === "image" && visited.has(k) ? (
                // Plain <img> is intentional: media URLs are arbitrary
                // Cloudinary URLs decided at content-edit time, not build
                // time, so next/image's static domain allowlist would need
                // constant upkeep for no real gain. `optimizedMedia` gets the
                // format/quality/width win straight from the URL instead.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.src}
                  src={optimizedMedia(m.src)}
                  alt={m.alt}
                  decoding="async"
                  fetchPriority={k === 0 ? "high" : "low"}
                  onLoad={() => setLoaded((p) => new Set(p).add(k))}
                  onError={() => setFailed((p) => new Set(p).add(k))}
                  className={cn(
                    "absolute inset-0 h-full w-full object-contain",
                    "transition-[opacity,transform] duration-500 ease-(--e-out-expo)",
                    k === i && loaded.has(k) && !failed.has(k)
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-[1.03] opacity-0",
                  )}
                />
              ) : null,
            )}
            {failed.has(i) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="h-6 w-6" />
                <span className="text-sm">Image unavailable</span>
              </div>
            ) : null}
          </>
        ) : (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            controls
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          >
            <track kind="captions" />
          </video>
        )}

        {current.type === "video" ? (
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[12px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
            <Play className="h-3 w-3" /> video
          </div>
        ) : null}

        {multiple ? (
          <>
            <NavButton side="left" onClick={() => go(i - 1)} />
            <NavButton side="right" onClick={() => go(i + 1)} />
            <div className="mono pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/65 px-2 py-0.5 text-[12px] tabular-nums text-white/85 backdrop-blur">
              {i + 1} / {media.length}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-3 border-t border-border bg-surface px-3 py-2">
        <div className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
          {current.alt}
        </div>
        {multiple ? (
          <div className="flex shrink-0 gap-1.5">
            {media.map((m, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Show ${m.alt}`}
                aria-current={k === i}
                onClick={() => go(k)}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-(--e-out-expo)",
                  k === i
                    ? "w-6 bg-primary"
                    : "w-2.5 bg-border-strong hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NavButton({
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
      aria-label={side === "left" ? "Previous" : "Next"}
      onClick={onClick}
      className={cn(
        "press absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white/90 backdrop-blur",
        "opacity-0 hover:bg-black/80 focus-visible:opacity-100 group-hover/media:opacity-100",
        // Always reachable on touch, where there is no hover to reveal them.
        "max-md:opacity-70",
        side === "left" ? "left-2 -translate-x-1 group-hover/media:translate-x-0" : "right-2 translate-x-1 group-hover/media:translate-x-0",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
