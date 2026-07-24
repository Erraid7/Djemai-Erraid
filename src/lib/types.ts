export type MediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

export type ProjectAvailability = {
  available: boolean;
  reason?: string;
};

export type Project = {
  id: number;
  slug: string;
  name: string;
  role: string;
  pinned: boolean;
  summary: string;
  bullets: string[];
  stack: string[];
  media: MediaItem[];
  links: {
    live: ProjectAvailability & { url?: string };
    github: ProjectAvailability & { url?: string };
    demoVideo: ProjectAvailability & { url?: string };
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
