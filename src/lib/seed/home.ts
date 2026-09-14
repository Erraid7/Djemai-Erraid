import { profile } from "./profile";
import { projects } from "./projects";
import { skillCategories } from "./skills";

// Statuses that mean "running somewhere right now". hosted-private counts:
// a confidential deployment is still a deployment, it just has no public link.
const DEPLOYED = new Set(["live", "demo", "hosted-private"]);

// Derived from the seed data instead of typed by hand, so the numbers on the
// home page can't drift out of date when a project or skill is added.
const deployedCount = projects.filter((p) => DEPLOYED.has(p.status.kind)).length;
const skillCount = skillCategories.reduce((n, c) => n + c.items.length, 0);

// The home response -- a short, centered welcome. Distinct on purpose from
// the About response: this one orients a first-time visitor, About tells
// the longer personal story.
export const home = {
  name: profile.name,
  role: profile.role,
  photoUrl: profile.photoUrl,
  status: `${profile.role} · ${profile.seeking}`,
  tagline:
    "This portfolio works like a real API client -- pick a request from the sidebar, hit Send, and the response renders as a real page instead of raw JSON.",
  stats: [
    { value: String(projects.length), label: "projects built" },
    { value: String(deployedCount), label: "live deployments" },
    // Not derivable from seed data. Counted as test cases in the two solo
    // backends' repos (Khatma V1: 518, HamsyNet: 249) in Sept 2026, rounded
    // down. Team projects are deliberately excluded.
    { value: "750+", label: "automated tests in my solo backends" },
    { value: String(skillCount), label: "technologies & practices" },
  ],
  howToUse: [
    "Pick a request from the sidebar on the left (or the menu on mobile).",
    "Hit Send to see the response render below.",
    "Try editing the URL bar yourself -- some ids aren't pinned anywhere.",
  ],
};
