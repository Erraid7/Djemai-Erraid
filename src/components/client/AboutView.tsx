import { GraduationCap, Mail, MapPin, Github, Linkedin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type AboutData = {
  name: string;
  role: string;
  photoUrl?: string;
  school: string;
  speciality?: string;
  schoolYears?: string;
  location?: string;
  seeking?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  bio: string[];
  journey?: string[];
  interests?: string[];
};

export function AboutView({ data }: { data: AboutData }) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="border-b border-border bg-linear-to-br from-surface-3 to-surface px-6 py-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shrink-0 border border-border-strong sm:h-20 sm:w-20">
            <AvatarImage src={data.photoUrl} alt={data.name} />
            <AvatarFallback className="mono text-lg">
              {data.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="mono text-[11px] uppercase tracking-widest text-primary">
              {data.seeking}
            </div>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">{data.name}</h2>
            <div className="mt-1 text-sm text-muted-foreground">{data.role}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            {data.school}
            {data.speciality ? ` · ${data.speciality}` : ""}
            {data.schoolYears ? ` · ${data.schoolYears}` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {data.location}
          </span>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        <div className="space-y-3">
          {data.bio.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/85">
              {p}
            </p>
          ))}
        </div>

        {data.journey && data.journey.length > 0 && (
          <div>
            <p className="mono mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              journey
            </p>
            <div className="space-y-3 border-l border-border pl-4">
              {data.journey.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground/80">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {data.interests && data.interests.length > 0 && (
          <div>
            <p className="mono mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              interests
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.interests.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-foreground/85"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-ring hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
          )}
          {data.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-ring hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-ring hover:text-foreground"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
