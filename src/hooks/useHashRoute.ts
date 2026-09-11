import type { HttpMethod } from "@/hooks/useApiClient";

/**
 * Deep-link format for the current request: `#GET:/api/projects/3`.
 *
 * Everything on this site is client state, so without this a visitor can't
 * share a link to a specific project, a refresh loses their place, and the
 * browser Back button leaves the site entirely.
 *
 * A bare `#/api/...` is accepted too and assumed to be a GET, so hand-written
 * links stay pleasant.
 */
export type Route = { method: HttpMethod; url: string };

const EXPLICIT = /^(GET|POST):(\/api\/\S*)$/i;

export function parseHash(hash: string): Route | null {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw) return null;

  const m = raw.match(EXPLICIT);
  if (m) {
    return { method: m[1]!.toUpperCase() as HttpMethod, url: m[2]! };
  }
  // Percent-encoding in a query string is left exactly as-is: fetch() wants
  // the encoded form, and round-tripping it through decode would break any
  // stack filter containing a space.
  if (raw.startsWith("/api/")) return { method: "GET", url: raw };
  return null;
}

export function formatHash(method: HttpMethod, url: string) {
  return `#${method}:${url}`;
}
