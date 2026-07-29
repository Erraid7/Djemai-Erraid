import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MediaGallery({
  media,
  fallbackReason,
}: {
  media: MediaItem[];
  fallbackReason?: string;
}) {
  const [i, setI] = useState(0);

  if (media.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-2 px-6 py-10 text-center">
        <ImageOff className="mb-3 h-6 w-6 text-muted-foreground" />
        <p className="max-w-sm text-base text-muted-foreground">
          {fallbackReason ??
            "No screenshots or video available for this project yet."}
        </p>
      </div>
    );
  }

  const current = media[i]!;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-black/40">
      <div className="relative aspect-auto w-full bg-black">
        {current.type === "image" ? (
          // Plain <img> is intentional: media URLs will be arbitrary Cloudinary
          // URLs decided at content-edit time, not build time, so next/image's
          // static domain allowlist would need constant upkeep for no real gain here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className="h-full w-full animate-in fade-in object-cover duration-300"
          />
        ) : (
          <video
            src={current.src}
            poster={current.poster}
            controls
            className="h-full w-full object-contain"
          >
            <track kind="captions" />
          </video>
        )}
        {/* Placeholder pattern behind if image fails */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(45deg,theme(colors.white/5)_0,theme(colors.white/5)_1px,transparent_1px,transparent_10px)]"
          aria-hidden
        />
        {current.type === "video" ? (
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[12px] font-medium uppercase tracking-wider text-white/90">
            <Play className="h-3 w-3" /> video
          </div>
        ) : null}

        {media.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => setI((i - 1 + media.length) % media.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white/90 backdrop-blur transition hover:bg-black/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => setI((i + 1) % media.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white/90 backdrop-blur transition hover:bg-black/80"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
      {media.length > 1 ? (
        <div className="flex items-center justify-between border-t border-border bg-surface px-3 py-2">
          <div className="text-[13px] text-muted-foreground">{current.alt}</div>
          <div className="flex gap-1.5">
            {media.map((_, k) => (
              <button
                key={k}
                aria-label={`Go to item ${k + 1}`}
                onClick={() => setI(k)}
                className={cn(
                  "h-1.5 w-4 rounded-full transition-colors",
                  k === i ? "bg-primary" : "bg-border-strong",
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t border-border bg-surface px-3 py-2 text-[13px] text-muted-foreground">
          {current.alt}
        </div>
      )}
    </div>
  );
}
