import type { LucideIcon } from "lucide-react";
import { Home, UserRound, FolderGit2, Wrench, BriefcaseBusiness, Mail, Lock } from "lucide-react";

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
    label: "Profile",
    items: [
      { method: "GET", url: "/api/home", icon: Home },
      { method: "GET", url: "/api/about", icon: UserRound },
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
  { label: "Skills", items: [{ method: "GET", url: "/api/skills", icon: Wrench }] },
  { label: "Experience", items: [{ method: "GET", url: "/api/experience", icon: BriefcaseBusiness }] },
  { label: "Contact", items: [{ method: "POST", url: "/api/contact", icon: Mail }] },
  { label: "???", items: [{ method: "POST", url: "/api/auth/login", locked: true, icon: Lock }] },
];
