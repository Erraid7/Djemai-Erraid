"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Braces,
  Database,
  Layout,
  Palette,
  Server,
  Smartphone,
  TestTube,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { spotlightMove } from "@/lib/spotlight";
import { cn } from "@/lib/utils";

export type SkillLevel = "core" | "strong" | "working";

export type SkillItem = {
  name: string;
  level: SkillLevel;
  projects: { id: number; name: string }[];
};

export type SkillCategoryData = {
  id: string;
  label: string;
  blurb?: string;
  items: SkillItem[];
};

const categoryIcons: Record<string, LucideIcon> = {
  frontend: Layout,
  backend: Server,
  database: Database,
  mobile: Smartphone,
  ai: Bot,
  languages: Braces,
  design: Palette,
  devops: TestTube,
};

// Level is the editorial claim; the project count next to it is the evidence.
// Both are shown together so neither has to be taken on faith.
const LEVEL_META: Record<
  SkillLevel,
  { label: string; segments: number; blurb: string }
> = {
  core: { label: "Core", segments: 3, blurb: "Daily driver — shipped repeatedly" },
  strong: { label: "Strong", segments: 2, blurb: "Comfortable and shipped" },
  working: { label: "Working", segments: 1, blurb: "Used it, still building depth" },
};

const LEVEL_ORDER: SkillLevel[] = ["core", "strong", "working"];

type Filter = "all" | "core" | "shipped";

export function SkillsView({
  categories,
  onFilterByStack,
}: {
  categories: SkillCategoryData[];
  onFilterByStack: (stack: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const all = useMemo(
    () => categories.flatMap((c) => c.items),
    [categories],
  );

  // The headline answer to "what does he actually master": core skills that
  // also have shipped projects behind them, most-used first.
  const coreStack = useMemo(
    () =>
      all
        .filter((s) => s.level === "core" && s.projects.length > 0)
        .sort((a, b) => b.projects.length - a.projects.length),
    [all],
  );

  function keep(s: SkillItem) {
    if (filter === "core") return s.level === "core";
    if (filter === "shipped") return s.projects.length > 0;
    return true;
  }

  const visibleCategories = categories
    .map((c) => ({ ...c, items: c.items.filter(keep) }))
    .filter((c) => c.items.length > 0);

  const shippedCount = all.filter((s) => s.projects.length > 0).length;

  return (
    <div className="space-y-6 p-5">
      {/* Header + level legend */}
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Skills, ranked by what I&apos;ve actually shipped
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            The level is my own call. The project count beside it isn&apos;t —
            it&apos;s derived from the stacks of the {shippedCount > 0 ? "real" : ""}{" "}
            projects on this site. Click any skill to see them.
          </p>
        </div>
        <FilterSwitch value={filter} onChange={setFilter} />
      </div>

      {/* Core stack spotlight */}
      {coreStack.length > 0 && filter !== "shipped" ? (
        <section className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <SectionLabel>Core stack</SectionLabel>
          <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {coreStack.slice(0, 8).map((s, i) => (
              <button
                key={s.name}
                type="button"
                onPointerMove={spotlightMove}
                onClick={() => onFilterByStack(s.name)}
                title={`Shipped in: ${s.projects.map((p) => p.name).join(", ")}`}
                className={cn(
                  "spotlight group animate-fade-up flex flex-col items-start gap-2 overflow-hidden rounded-xl border border-primary/25 bg-primary/6 p-3 text-left",
                  "transition-[transform,border-color,box-shadow] duration-300 ease-(--e-out-quart)",
                  "hover:-translate-y-1 hover:border-primary/60 hover:shadow-(--glow-primary)",
                )}
                style={{ animationDelay: `${100 + i * 45}ms` }}
              >
                <span aria-hidden className="spotlight-layer" />
                <span className="relative text-sm font-semibold text-foreground">
                  {s.name}
                </span>
                <LevelMeter level={s.level} />
                <span className="mono relative text-[11px] tabular-nums text-primary/90">
                  {s.projects.length} project{s.projects.length === 1 ? "" : "s"}
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Everything, grouped */}
      <section
        className="animate-fade-up space-y-3"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionLabel>
            {filter === "core"
              ? "Core skills"
              : filter === "shipped"
                ? "Backed by shipped projects"
                : "Everything, by category"}
          </SectionLabel>
          <Legend />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {visibleCategories.map((cat, i) => {
            const Icon = categoryIcons[cat.id] ?? Wrench;
            return (
              <div
                key={cat.id}
                onPointerMove={spotlightMove}
                className="spotlight group animate-fade-up overflow-hidden rounded-xl border border-border bg-card p-4 transition-[transform,border-color,box-shadow] duration-300 ease-(--e-out-quart) hover:-translate-y-0.5 hover:border-border-strong hover:elev-2"
                style={{ animationDelay: `${180 + i * 55}ms` }}
              >
                <span aria-hidden className="spotlight-layer" />

                <div className="relative flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-foreground">
                      {cat.label}
                    </h3>
                    {cat.blurb ? (
                      <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                        {cat.blurb}
                      </p>
                    ) : null}
                  </div>
                  <DistributionBar items={cat.items} />
                </div>

                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {[...cat.items]
                    .sort(
                      (a, b) =>
                        LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) ||
                        b.projects.length - a.projects.length,
                    )
                    .map((s) => (
                      <SkillChip
                        key={s.name}
                        skill={s}
                        onClick={
                          s.projects.length > 0
                            ? () => onFilterByStack(s.name)
                            : undefined
                        }
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-muted-foreground/80">
      {children}
      <span
        aria-hidden
        className="h-px flex-1 bg-linear-to-r from-border to-transparent"
      />
    </div>
  );
}

function FilterSwitch({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (f: Filter) => void;
}) {
  const options: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "core", label: "Core only" },
    { id: "shipped", label: "Shipped" },
  ];
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-border bg-surface">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "px-3 py-1.5 text-[13px] font-medium transition-colors duration-200",
            value === o.id
              ? "bg-surface-3 text-foreground"
              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Three segments filled to the skill's level — a compact, honest meter. */
function LevelMeter({ level }: { level: SkillLevel }) {
  const filled = LEVEL_META[level].segments;
  return (
    <span
      className="relative flex gap-0.5"
      aria-label={`${LEVEL_META[level].label} — ${LEVEL_META[level].blurb}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "h-1 w-4 rounded-full transition-colors duration-300",
            i < filled ? "bg-primary" : "bg-border-strong/60",
          )}
        />
      ))}
    </span>
  );
}

/** Per-category mix of levels, as one thin stacked bar. */
function DistributionBar({ items }: { items: SkillItem[] }) {
  const counts = LEVEL_ORDER.map(
    (l) => items.filter((s) => s.level === l).length,
  );
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const tone = ["bg-primary", "bg-primary/55", "bg-border-strong"];
  return (
    <div className="relative hidden w-16 shrink-0 sm:block">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
        {counts.map((c, i) =>
          c > 0 ? (
            <span
              key={i}
              className={tone[i]}
              style={{ width: `${(c / total) * 100}%` }}
            />
          ) : null,
        )}
      </div>
      <div className="mono mt-1 text-right text-[10px] tabular-nums text-muted-foreground">
        {items.length}
      </div>
    </div>
  );
}

function SkillChip({
  skill,
  onClick,
}: {
  skill: SkillItem;
  onClick?: () => void;
}) {
  const meta = LEVEL_META[skill.level];
  const shipped = skill.projects.length;

  const tone =
    skill.level === "core"
      ? "border-primary/40 bg-primary/10 text-foreground"
      : skill.level === "strong"
        ? "border-border-strong bg-surface-2 text-foreground/90"
        : "border-dashed border-border bg-transparent text-muted-foreground";

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          skill.level === "core"
            ? "bg-primary"
            : skill.level === "strong"
              ? "bg-primary/55"
              : "bg-border-strong",
        )}
      />
      {skill.name}
      {shipped > 0 ? (
        <span className="mono rounded bg-background/60 px-1 text-[10.5px] tabular-nums text-primary/90">
          {shipped}
        </span>
      ) : null}
    </>
  );

  const base =
    "mono inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[13px] transition-[transform,border-color,background-color,color] duration-200 ease-(--e-out-quart)";

  const title = shipped
    ? `${meta.label} — ${meta.blurb}. Shipped in: ${skill.projects
        .map((p) => p.name)
        .join(", ")}`
    : `${meta.label} — ${meta.blurb}`;

  if (!onClick) {
    return (
      <span className={cn(base, tone, "cursor-default")} title={title}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${title} — click to filter projects`}
      className={cn(
        base,
        tone,
        "press hover:-translate-y-0.5 hover:border-primary hover:text-foreground",
      )}
    >
      {content}
    </button>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {LEVEL_ORDER.map((l) => (
        <span
          key={l}
          className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground"
          title={LEVEL_META[l].blurb}
        >
          <LevelMeter level={l} />
          {LEVEL_META[l].label}
        </span>
      ))}
    </div>
  );
}
