"use client";

import { useEffect } from "react";
import { projects } from "@/lib/seed/projects";

export function ImagePreloader() {
  useEffect(() => {
    // Collect every unique Cloudinary image
    const urls = [
      ...new Set(
        projects.flatMap((project) =>
          project.media
            .filter(
              (media) =>
                media.type === "image" &&
                typeof media.src === "string" &&
                media.src.length > 0
            )
            .map((media) => media.src)
        )
      ),
    ];

    // Start downloading them in the background
    const images: HTMLImageElement[] = [];

    urls.forEach((url) => {
      const img = new Image();

      img.decoding = "async";
      img.loading = "eager";
      img.fetchPriority = "low";

      img.src = url;

      images.push(img);
    });

    console.log(`[ImagePreloader] Preloading ${urls.length} images`);

    return () => {
      images.length = 0;
    };
  }, []);

  return true;
}