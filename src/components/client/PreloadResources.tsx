"use client";

import ReactDOM from "react-dom";

const CLOUDINARY_ORIGIN = "https://res.cloudinary.com";

/**
 * Every project screenshot and the profile photo come from one Cloudinary
 * origin, and the first of them is requested only after the home response
 * renders. Opening the connection up front takes the DNS + TLS handshake off
 * that critical path.
 *
 * The Metadata API has no slot for resource hints, so this uses the ReactDOM
 * methods Next documents for exactly this case rather than a hand-written
 * <head> block, which the App Router disallows in a root layout.
 */
export function PreloadResources() {
  ReactDOM.prefetchDNS(CLOUDINARY_ORIGIN);
  ReactDOM.preconnect(CLOUDINARY_ORIGIN, { crossOrigin: "anonymous" });
  return null;
}
