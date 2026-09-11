/**
 * The endpoint-discovery mechanic.
 *
 * The site already had a hidden-in-plain-sight trick (`/api/projects/7` is
 * reachable but never listed in the sidebar). This turns that one-off into an
 * actual loop: every endpoint below is discoverable, a few are only reachable
 * by editing the URL bar or guessing, and progress persists per browser.
 *
 * Progress lives in localStorage only -- nothing is sent anywhere, and losing
 * it costs the visitor nothing but the counter.
 */

export type DiscoverableEndpoint = {
  method: "GET" | "POST";
  url: string;
  /** Shown in the sidebar once found. */
  label: string;
  /** Secret endpoints are absent from the sidebar until discovered. */
  secret?: boolean;
};

export const DISCOVERABLE: DiscoverableEndpoint[] = [
  { method: "GET", url: "/api/home", label: "Home" },
  { method: "GET", url: "/api/about", label: "About" },
  { method: "GET", url: "/api/skills", label: "Skills" },
  { method: "GET", url: "/api/experience", label: "Experience" },
  { method: "GET", url: "/api/services", label: "Services" },
  { method: "GET", url: "/api/projects", label: "All projects" },
  { method: "POST", url: "/api/contact", label: "Contact" },
  { method: "POST", url: "/api/auth/login", label: "Login" },

  // Not in the sidebar. Reachable only by editing the URL bar or guessing.
  {
    method: "GET",
    url: "/api/projects/7",
    label: "The unlisted project",
    secret: true,
  },
  { method: "GET", url: "/api/whoami", label: "whoami", secret: true },
  { method: "GET", url: "/api/coffee", label: "coffee", secret: true },
  { method: "GET", url: "/api/secret", label: "secret", secret: true },
];

export const TOTAL_DISCOVERABLE = DISCOVERABLE.length;
export const SECRET_COUNT = DISCOVERABLE.filter((e) => e.secret).length;

export const STORAGE_KEY = "erraid.discovered.v1";

/** Stable identity for an endpoint, used as the persisted key. */
export function keyOf(method: string, url: string) {
  return `${method} ${normalizeUrl(url)}`;
}

/** Strip query strings and trailing slashes so `?stack=` doesn't fork the key. */
export function normalizeUrl(url: string) {
  const noQuery = url.split("?")[0] ?? url;
  return noQuery.length > 1 ? noQuery.replace(/\/+$/, "") : noQuery;
}

/** The registry entry for a request, or null if it isn't a tracked endpoint. */
export function match(method: string, url: string): DiscoverableEndpoint | null {
  const target = normalizeUrl(url);
  return (
    DISCOVERABLE.find((e) => e.method === method && e.url === target) ?? null
  );
}

export function readDiscovered(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((v): v is string => typeof v === "string"))
      : new Set();
  } catch {
    // Private mode, disabled storage, or corrupt JSON -- start fresh rather
    // than breaking the page over a progress counter.
    return new Set();
  }
}

export function writeDiscovered(keys: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
  } catch {
    // Nothing to do -- the counter just won't survive a reload.
  }
}
