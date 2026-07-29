import { ArrowRight, Layers, ServerCog, Smartphone, Check } from "lucide-react";
import type { Service } from "@/lib/seed/services";

const iconFor: Record<string, typeof Layers> = {
  fullstack: Layers,
  "backend-api": ServerCog,
  "mobile-first": Smartphone,
};

export function ServicesView({
  services,
  onOpenProject,
}: {
  services: Service[];
  onOpenProject: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">What I can build for you</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three ways I typically work with clients -- each grounded in a real project on this site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s, i) => {
          const Icon = iconFor[s.id] ?? Layers;
          return (
            <div
              key={s.id}
              className="flex animate-in fade-in slide-in-from-bottom-1 flex-col rounded-xl border border-border bg-card p-5 duration-500 [animation-fill-mode:backwards]"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm italic text-muted-foreground">{s.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{s.description}</p>

              <ul className="mt-4 space-y-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              {s.exampleProjectId && s.exampleLabel && (
                <button
                  type="button"
                  onClick={() => onOpenProject(s.exampleProjectId!)}
                  className="group mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary transition-all hover:gap-2"
                >
                  {s.exampleLabel}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-border-strong bg-surface-2 p-4 text-center">
        <p className="text-sm text-foreground/85">
          Have something else in mind? <span className="text-muted-foreground">POST /api/contact</span> is right there in the sidebar.
        </p>
      </div>
    </div>
  );
}
