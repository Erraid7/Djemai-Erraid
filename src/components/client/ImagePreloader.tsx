"use client";

import { useEffect } from "react";
import { projects } from "@/lib/seed/projects";
import { optimizedMedia } from "@/lib/media";

/**
 * Warms the browser cache for the *first* frame of each project's gallery.
 *
 * Deliberately not every image: the seed data carries ~27 screenshots, and
 * eagerly fetching all of them on load is exactly the kind of thing that makes
 * a "light and fast" portfolio slow. One cover per project is enough for
 * clicking through `/api/projects/:id` to feel instant, and MediaGallery
 * fetches the remaining slides only once a visitor actually navigates to them.
 *
 * Runs at idle so it never competes with the initial render, and uses the
 * same optimized URLs the gallery requests, so these are cache hits rather
 * than a second set of downloads.
 */
export function ImagePreloader() {
  useEffect(() => {
    const covers = projects
      .map((project) => project.media.find((m) => m.type === "image"))
      .filter((m): m is { type: "image"; src: string; alt: string } => !!m?.src)
      .map((m) => optimizedMedia(m.src));

    if (covers.length === 0) return;

    let cancelled = false;
    const images: HTMLImageElement[] = [];

    function warm() {
      if (cancelled) return;
      for (const url of covers) {
        const img = new Image();
        img.decoding = "async";
        img.fetchPriority = "low";
        img.src = url;
        images.push(img);
      }
    }

    // requestIdleCallback isn't in Safari before 17; the timeout fallback keeps
    // the behaviour identical there, just on a fixed delay.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(warm, { timeout: 3000 })
      : window.setTimeout(warm, 1200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      // Dropping the references lets an in-flight decode be collected; the
      // bytes already fetched stay in the HTTP cache, which is the point.
      images.length = 0;
    };
  }, []);

  return null;
}
