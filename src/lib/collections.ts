import type { LucideIcon } from "lucide-react";
import { Home, UserRound, FolderGit2, Wrench, BriefcaseBusiness, Sparkles, Mail, Lock } from "lucide-react";

export type CollectionItem = {
  method: "GET" | "POST";
  url: string;
  locked?: boolean;
  icon: LucideIcon;
};

export type Collection = {
  label: string;
  items: CollectionItem[];
};

export const collections: Collection[] = [
  {
    label: "Overview",
    items: [
      { method: "GET", url: "/api/home", icon: Home },
      { method: "GET", url: "/api/about", icon: UserRound },

      { method: "GET", url: "/api/skills", icon: Wrench },
      { method: "GET", url: "/api/experience", icon: BriefcaseBusiness },
      { method: "GET", url: "/api/services", icon: Sparkles },
    ],
  },
  {
    label: "Projects",
    items: [
      { method: "GET", url: "/api/projects", icon: FolderGit2 },
      { method: "GET", url: "/api/projects/1", icon: FolderGit2 },
      { method: "GET", url: "/api/projects/2", icon: FolderGit2 },
      { method: "GET", url: "/api/projects/3", icon: FolderGit2 },
      { method: "GET", url: "/api/projects/4", icon: FolderGit2 },
      { method: "GET", url: "/api/projects/5", icon: FolderGit2 },
      { method: "GET", url: "/api/projects/6", icon: FolderGit2 },
    ],
  },
  {
    label: "Actions",
    items: [
      { method: "POST", url: "/api/contact", icon: Mail },
      { method: "POST", url: "/api/auth/login", locked: true, icon: Lock },
    ],
  },
];
