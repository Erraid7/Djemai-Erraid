/**
 * Cloudinary URL helpers.
 *
 * Project media is authored as plain Cloudinary URLs in `src/lib/seed/*`
 * (see the note in MediaGallery on why `next/image` isn't used here). Those
 * raw URLs serve the original upload -- full-resolution PNG screenshots,
 * often 1-3 MB each. Cloudinary can transform on the fly from the URL alone,
 * so rewriting the URL at render time gets format negotiation (AVIF/WebP),
 * automatic quality, and a sane max width for free, with no build config and
 * no change to the seed data.
 *
 * Everything degrades safely: a non-Cloudinary URL is returned untouched.
 */

const CLOUDINARY_UPLOAD = "/image/upload/";

/** True when `src` is a Cloudinary delivery URL we can rewrite. */
function isTransformable(src: string): boolean {
  return src.includes("res.cloudinary.com") && src.includes(CLOUDINARY_UPLOAD);
}

/**
 * Insert a transformation segment directly after `/image/upload/`.
 * Bails out if the URL already carries transformations (a segment shaped
 * like `x_y,...`), so hand-tuned URLs in the seed data keep winning.
 */
function withTransform(src: string, transform: string): string {
  if (!isTransformable(src)) return src;
  const [base, rest] = src.split(CLOUDINARY_UPLOAD);
  if (base === undefined || rest === undefined) return src;
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) return src;
  return `${base}${CLOUDINARY_UPLOAD}${transform}/${rest}`;
}

/**
 * Display-quality URL: auto format, auto quality, capped width.
 * `c_limit` only ever scales down, so smaller originals are never upscaled.
 */
export function optimizedMedia(src: string, width = 1400): string {
  return withTransform(src, `f_auto,q_auto,c_limit,w_${width}`);
}

/**
 * Low-quality image placeholder -- a ~40px blurred thumbnail (typically well
 * under 1 KB) shown behind the real image so a slow load reveals a soft
 * colour field instead of an empty box.
 */
export function placeholderMedia(src: string): string {
  return withTransform(src, "f_auto,q_1,e_blur:1200,c_limit,w_40");
}
