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

const contactLinkClass =
  "press group inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground/85 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground hover:shadow-(--glow-primary)";

export function AboutView({ data }: { data: AboutData }) {
  return (
    <div>
      <div className="relative overflow-hidden border-b border-border bg-linear-to-br from-surface-3 to-surface px-6 py-7">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-cyan-accent/8 blur-3xl"
        />

        <div className="relative flex items-start gap-4">
          <div className="animate-pop relative shrink-0">
            <Avatar className="h-16 w-16 border border-border-strong elev-2 sm:h-20 sm:w-20">
              <AvatarImage src={data.photoUrl} alt={data.name} />
              <AvatarFallback className="mono text-lg">
                {data.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <span
              aria-hidden
              className="animate-pulse-glow absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-surface-3 bg-primary"
            />
          </div>
          <div className="min-w-0">
            <div
              className="mono animate-fade-up text-[13px] uppercase tracking-widest text-primary"
              style={{ animationDelay: "60ms" }}
            >
              {data.seeking}
            </div>
            <h2
              className="animate-fade-up mt-1 text-2xl font-semibold text-foreground"
              style={{ animationDelay: "120ms" }}
            >
              {data.name}
            </h2>
            <div
              className="animate-fade-up mt-1 text-base text-muted-foreground"
              style={{ animationDelay: "180ms" }}
            >
              {data.role}
            </div>
          </div>
        </div>

        <div
          className="animate-fade-up relative mt-4 flex flex-wrap items-center gap-2"
          style={{ animationDelay: "240ms" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1 text-[13px] text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 text-primary/80" />
            {data.school}
            {data.speciality ? ` · ${data.speciality}` : ""}
            {data.schoolYears ? ` · ${data.schoolYears}` : ""}
          </span>
          {data.location ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1 text-[13px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary/80" />
              {data.location}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-7 px-6 py-6">
        <div className="space-y-3">
          {data.bio.map((p, i) => (
            <p
              key={i}
              className="animate-fade-up text-base leading-relaxed text-foreground/85"
              style={{ animationDelay: `${300 + i * 80}ms` }}
            >
              {p}
            </p>
          ))}
        </div>

        {data.journey && data.journey.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: "480ms" }}>
            <p className="mono mb-2 text-[13px] uppercase tracking-widest text-muted-foreground">
              journey
            </p>
            <div className="relative space-y-3 pl-5">
              <span
                aria-hidden
                className="absolute bottom-1 left-0 top-1 w-px origin-top bg-linear-to-b from-primary/60 via-border to-transparent"
                style={{ animation: "scale-y-in 900ms var(--e-out-expo) 480ms both" }}
              />
              {data.journey.map((p, i) => (
                <p
                  key={i}
                  className="animate-fade-up relative text-base leading-relaxed text-foreground/80"
                  style={{ animationDelay: `${540 + i * 90}ms` }}
                >
                  <span
                    aria-hidden
                    className="absolute -left-5 top-[0.6rem] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary/60 ring-4 ring-background"
                  />
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {data.interests && data.interests.length > 0 && (
          <div>
            <p className="mono mb-2 text-[13px] uppercase tracking-widest text-muted-foreground">
              interests
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.interests.map((item, i) => (
                <span
                  key={item}
                  className="animate-fade-up cursor-default rounded-full border border-border bg-surface-2 px-3 py-1 text-sm text-foreground/85 transition-[transform,border-color,color] duration-200 ease-(--e-out-quart) hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
                  style={{ animationDelay: `${760 + i * 50}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          className="animate-fade-up flex flex-wrap gap-2 pt-1"
          style={{ animationDelay: "900ms" }}
        >
          {data.email && (
            <a href={`mailto:${data.email}`} className={contactLinkClass}>
              <Mail className="h-3.5 w-3.5 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />{" "}
              Email
            </a>
          )}
          {data.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClass}
            >
              <Github className="h-3.5 w-3.5 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />{" "}
              GitHub
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClass}
            >
              <Linkedin className="h-3.5 w-3.5 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />{" "}
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
