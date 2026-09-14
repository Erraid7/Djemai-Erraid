export type MediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

export type ProjectAvailability = {
  available: boolean;
  reason?: string;
};

/** One link slot. `label` overrides the default button text ("Live site", …). */
export type ProjectLink = ProjectAvailability & { url?: string; label?: string };

/** Link buttons beyond the three standard slots — these always need a label. */
export type ExtraProjectLink = ProjectLink & { label: string };

/**
 * Where a project stands today. Drives the status badge and the home page's
 * "live deployments" count, so keep it honest:
 *   live           — in production at a public URL
 *   demo           — a public demo is up; the full product is still being built
 *   hosted-private — deployed and in use, but confidential (no public link)
 *   internship     — an internship deliverable, owned by the client
 *   completed      — finished and not hosted (CLI tools, desktop apps)
 */
export type ProjectStatusKind =
  | "live"
  | "demo"
  | "hosted-private"
  | "internship"
  | "completed";

export type ProjectStatus = { kind: ProjectStatusKind; label: string };

/** A headline number shown large on the project page. Keep every one sourced. */
export type ProjectMetric = { value: string; label: string };

export type Project = {
  id: number;
  slug: string;
  name: string;
  role: string;
  pinned: boolean;
  status: ProjectStatus;
  summary: string;
  metrics?: ProjectMetric[];
  bullets: string[];
  stack: string[];
  media: MediaItem[];
  links: {
    live: ProjectLink;
    github: ProjectLink;
    demoVideo: ProjectLink;
    extra?: ExtraProjectLink[];
  };
  docsMarkdown: string;
};

export type ApiEnvelope<T> = {
  status: number;
  statusText: string;
  data: T;
  tests?: { label: string; pass: boolean }[];
  _meta?: { time: number; size: number };
};
