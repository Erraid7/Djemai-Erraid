"use client";

import { ArrowRight, Layers, ServerCog, Smartphone, Check } from "lucide-react";
import type { Service } from "@/lib/seed/services";
import { spotlightMove } from "@/lib/spotlight";

const iconFor: Record<string, typeof Layers> = {
  fullstack: Layers,
  "backend-api": ServerCog,
  "mobile-first": Smartphone,
};

// One accent per card so the three offers read as distinct at a glance
// without introducing a second brand colour.
const accents = ["var(--primary)", "var(--cyan-accent)", "var(--method-post)"];

export function ServicesView({
  services,
  onOpenProject,
}: {
  services: Service[];
  onOpenProject: (id: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="animate-fade-up">
        <h2 className="text-xl font-semibold text-foreground">
          What I can build for you
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three ways I typically work with clients — each grounded in a real
          project on this site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s, i) => {
          const Icon = iconFor[s.id] ?? Layers;
          const accent = accents[i % accents.length]!;
          return (
            <div
              key={s.id}
              onPointerMove={spotlightMove}
              className="spotlight group animate-fade-up flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-[transform,border-color,box-shadow] duration-300 ease-(--e-out-quart) hover:-translate-y-1 hover:elev-3"
              style={{
                animationDelay: `${i * 90}ms`,
                borderTopColor: `color-mix(in oklab, ${accent} 45%, var(--border))`,
              }}
            >
              <span aria-hidden className="spotlight-layer" />
              <div
                className="relative flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-400 ease-(--e-spring) group-hover:-rotate-6 group-hover:scale-110"
                style={{
                  background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                  color: accent,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 25%, transparent)`,
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-3 text-base font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="relative mt-1 text-sm italic text-muted-foreground">
                {s.tagline}
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-foreground/85">
                {s.description}
              </p>

              <ul className="relative mt-4 space-y-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-foreground/80">
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      style={{ color: accent }}
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              {s.exampleProjectId && s.exampleLabel && (
                <button
                  type="button"
                  onClick={() => onOpenProject(s.exampleProjectId!)}
                  className="press group/link relative mt-5 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-medium"
                  style={{ color: accent }}
                >
                  {s.exampleLabel}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-(--e-out-expo) group-hover/link:translate-x-1" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="animate-fade-up relative overflow-hidden rounded-xl border border-dashed border-border-strong bg-surface-2 p-5 text-center"
        style={{ animationDelay: "300ms" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-12 h-24 bg-primary/10 blur-3xl"
        />
        <p className="relative text-sm text-foreground/85">
          Have something else in mind?{" "}
          <code className="mono rounded border border-border bg-background px-1.5 py-0.5 text-method-post">
            POST /api/contact
          </code>{" "}
          is right there in the sidebar.
        </p>
      </div>
    </div>
  );
}
