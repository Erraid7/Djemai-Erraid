import { profile } from "./profile";

// The Home response -- a short, centered welcome. Distinct on purpose from
// the About response: this one orients a first-time visitor, About tells
// the longer personal story.
export const home = {
  name: profile.name,
  role: profile.role,
  photoUrl: profile.photoUrl,
  status: `${profile.role} · ${profile.seeking}`,
  tagline:
    "This portfolio works like a real API client -- pick a request from the sidebar, hit Send, and the response renders as a real page instead of raw JSON.",
  // Dev/technical stats -- kept honest and derivable from the actual seed
  // data rather than vanity numbers. Update alongside projects.ts/skills.ts
  // if those change.
  stats: [
    { value: "7", label: "projects shipped" },
    { value: "3", label: "live deployments" },
    { value: "3", label: "platforms — web, mobile, desktop" },
    { value: "30+", label: "technologies across the stack" },
  ],
  howToUse: [
    "Pick a request from the sidebar on the left (or the menu on mobile).",
    "Hit Send to see the response render below.",
    "Try editing the URL bar yourself -- some ids aren't pinned anywhere.",
  ],
};
