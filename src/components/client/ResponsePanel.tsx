"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  Check,
  Copy,
  Loader2,
  Crown,
  Code2,
  GraduationCap,
  Presentation,
  BriefcaseBusiness,
  Clock,
  HardDrive,
  MousePointerClick,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import type { ApiEnvelope, Project } from "@/lib/types";
import { StatusBadge } from "./badges";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectListPreview } from "./ProjectListPreview";
import { ServicesView } from "./ServicesView";
import { SkillsView, type SkillCategoryData } from "./SkillsView";
import type { Service } from "@/lib/seed/services";
import { HomeView } from "./HomeView";
import { AboutView } from "./AboutView";
import type { HttpMethod } from "@/hooks/useApiClient";
import { cn } from "@/lib/utils";

type Mode = "preview" | "pretty";

export function ResponsePanel({
  response,
  loading,
  onOpenProject,
  onExpand,
  onSendRaw,
  method,
}: {
  response: ApiEnvelope<unknown> | null;
  loading: boolean;
  method: HttpMethod;
  onOpenProject: (id: number) => void;
  onExpand: () => void;
  onSendRaw: (url: string, method: HttpMethod, body?: unknown) => void;
}) {
  const [mode, setMode] = useState<Mode>("preview");

  // Identity of the current render, so switching responses remounts the body
  // and replays its entrance instead of swapping content in place.
  const renderKey = `${response?.status ?? "none"}-${response?._meta?.time ?? 0}`;

  return (
    <section className="relative flex min-h-0 flex-1 flex-col">
      <header className="relative z-10 flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
        <div className="mono text-[12px] uppercase tracking-widest text-muted-foreground">
          Response
        </div>
        {response ? (
          <>
            <StatusBadge
              status={response.status}
              statusText={response.statusText}
            />
            {response._meta ? (
              <div className="mono flex items-center gap-2 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5">
                  <Clock className="h-3 w-3" />
                  <span className="tabular-nums text-foreground">
                    {response._meta.time}
                  </span>
                  ms
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5">
                  <HardDrive className="h-3 w-3" />
                  <span className="text-foreground">
                    {formatBytes(response._meta.size)}
                  </span>
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            Fire a request to see the response.
          </span>
        )}

        {loading && response ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        ) : null}

        <div className="ml-auto inline-flex overflow-hidden rounded-md border border-border bg-surface">
          <ModeButton
            active={mode === "preview"}
            onClick={() => setMode("preview")}
          >
            Preview
          </ModeButton>
          <ModeButton
            active={mode === "pretty"}
            onClick={() => setMode("pretty")}
          >
            Pretty JSON
          </ModeButton>
        </div>
      </header>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          // Fade the whole body slightly while a follow-up request is in
          // flight: clearly "stale" without the jarring blank of a full reset.
          "transition-opacity duration-200",
          loading && response ? "opacity-55" : "opacity-100",
        )}
      >
        {loading && !response ? (
          <ResponseSkeleton />
        ) : !response ? (
          <EmptyState method={method} />
        ) : mode === "pretty" ? (
          <div key={`pretty-${renderKey}`} className="animate-fade-up">
            <PrettyJson data={response} />
          </div>
        ) : (
          <div key={`preview-${renderKey}`} className="animate-fade-up">
            <PreviewBody
              response={response}
              onOpenProject={onOpenProject}
              onExpand={onExpand}
              onSendRaw={onSendRaw}
            />
          </div>
        )}
      </div>
    </section>
  );
}

/** Mirrors the real profile-card layout so the swap to content doesn't jump. */
function ResponseSkeleton() {
  return (
    <div className="p-5" aria-hidden>
      <div className="mx-auto grid max-w-4xl gap-8 py-6 md:grid-cols-[280px_1fr]">
        <div className="skeleton-shimmer mx-auto aspect-4/5 w-full max-w-70 rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton-shimmer h-3 w-28 rounded-full" />
          <div className="skeleton-shimmer h-9 w-4/5 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
          <div className="space-y-2 pt-2">
            <div className="skeleton-shimmer h-3.5 w-full rounded-md" />
            <div className="skeleton-shimmer h-3.5 w-11/12 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-2 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer h-16 rounded-xl" />
            ))}
          </div>
          <div className="flex gap-2.5 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-shimmer h-10 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-200",
        active
          ? "bg-surface-3 text-foreground"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}

function NoResults() {
  return (
    <div className="flex h-full items-center justify-center p-10 text-center">
      <div className="animate-fade-up">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-border bg-surface-2 text-muted-foreground">
          <SearchX className="h-5 w-5" />
        </div>
        <div className="mono text-sm uppercase tracking-widest text-muted-foreground">
          200 · empty
        </div>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          The request succeeded — there just isn&apos;t anything matching it.
          Try a different filter, or fire{" "}
          <code className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-foreground">
            GET /api/projects
          </code>{" "}
          for everything.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ method }: { method: HttpMethod }) {
  return (
    <div className="flex h-full items-center justify-center p-10 text-center">
      <div className="animate-fade-up">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-2 text-muted-foreground">
          <MousePointerClick className="h-5 w-5" />
        </div>
        <div className="mono text-sm uppercase tracking-widest text-muted-foreground">
          idle
        </div>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          {method === "GET"
            ? "Pick a request from the sidebar or hit Send to fire the current one."
            : "This is a POST endpoint — Send when you're ready."}
        </p>
      </div>
    </div>
  );
}

// -- Pretty JSON -----------------------------------------------------------

type Token = { text: string; cls: string };

// One pass over a line, classifying the four JSON literal shapes. Strings are
// matched first (and a trailing ":" promotes one to a key) so punctuation and
// numbers inside a string are never highlighted as syntax.
const TOKEN_RE =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function tokenizeLine(line: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN_RE)) {
    const start = m.index;
    if (start > last) out.push({ text: line.slice(last, start), cls: "json-punct" });

    if (m[1] !== undefined) {
      const isKey = m[2] !== undefined;
      out.push({ text: m[1], cls: isKey ? "json-key" : "json-string" });
      if (isKey) out.push({ text: m[2]!, cls: "json-punct" });
    } else if (m[3] !== undefined) {
      out.push({ text: m[3], cls: "json-boolean" });
    } else if (m[4] !== undefined) {
      out.push({ text: m[4], cls: "json-null" });
    } else if (m[5] !== undefined) {
      out.push({ text: m[5], cls: "json-number" });
    }
    last = start + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), cls: "json-punct" });
  return out;
}

function PrettyJson({ data }: { data: unknown }) {
  const raw = useMemo(() => JSON.stringify(data, null, 2) ?? "", [data]);
  const lines = useMemo(() => raw.split("\n"), [raw]);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context / permissions) -- nothing useful
      // to do but leave the button in its idle state.
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        className={cn(
          "press sticky top-3 z-10 ml-auto mr-4 flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12.5px] font-medium backdrop-blur",
          copied
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border bg-surface/90 text-muted-foreground hover:border-border-strong hover:text-foreground",
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>

      <pre className="mono -mt-8 overflow-x-auto px-4 pb-6 pt-4 text-[13.5px] leading-[1.65]">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="group/line flex">
              <span
                aria-hidden
                className="sticky left-0 mr-4 w-8 shrink-0 select-none bg-background text-right text-muted-foreground/35 tabular-nums transition-colors group-hover/line:text-muted-foreground/70"
              >
                {i + 1}
              </span>
              <span className="min-w-0 whitespace-pre">
                {tokenizeLine(line).map((t, k) => (
                  <span key={k} className={t.cls}>
                    {t.text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function PreviewBody({
  response,
  onOpenProject,
  onExpand,
  onSendRaw,
}: {
  response: ApiEnvelope<unknown>;
  onOpenProject: (id: number) => void;
  onExpand: () => void;
  onSendRaw: (url: string, method: HttpMethod, body?: unknown) => void;
}) {
  const { data, status } = response;

  // Errors
  if (status >= 400) {
    return <ErrorCard status={status} data={data} />;
  }

  const isSuccess =
    status === 202 && isRecord(data) && typeof data.message === "string";

  // Contact accepted
  if (isSuccess) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="animate-pop relative max-w-md overflow-hidden rounded-2xl border border-status-2xx/30 bg-status-2xx/8 p-8 text-center elev-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-status-2xx/20 blur-3xl"
          />
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-status-2xx/40 bg-status-2xx/15">
            <Check className="h-7 w-7 text-status-2xx" />
          </div>
          <h2 className="relative text-xl font-semibold text-foreground">
            Message sent successfully
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
            Thank you for reaching out! Your message has been received and I&apos;ll
            get back to you as soon as possible.
          </p>
        </div>
      </div>
    );
  }

  // An empty list is a real, reachable outcome (e.g. ?stack=cobol) and should
  // not fall through to a bare "[]" dump.
  if (Array.isArray(data) && data.length === 0) {
    return <NoResults />;
  }

  // Project[]
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    isRecord(data[0]) &&
    "stack" in data[0]
  ) {
    return (
      <div className="p-5">
        <ProjectListPreview projects={data as Project[]} onOpen={onOpenProject} />
      </div>
    );
  }

  // Services[]
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    isRecord(data[0]) &&
    "deliverables" in data[0]
  ) {
    return (
      <div className="p-5">
        <ServicesView services={data as Service[]} onOpenProject={onOpenProject} />
      </div>
    );
  }

  // Single Project
  if (isRecord(data) && "stack" in data && "links" in data) {
    return (
      <div className="p-5">
        <ProjectPreview project={data as Project} onExpand={onExpand} />
      </div>
    );
  }

  // Home (welcome/landing)
  if (isRecord(data) && "howToUse" in data && "tagline" in data) {
    return (
      <HomeView
        data={
          data as {
            name: string;
            role: string;
            photoUrl?: string;
            status: string;
            tagline: string;
            stats?: { value: string; label: string }[];
            howToUse: string[];
          }
        }
        onNavigate={(url, method) => onSendRaw(url, method)}
      />
    );
  }

  // About (personal narrative)
  if (isRecord(data) && "school" in data && "bio" in data) {
    return <AboutView data={data as ProfileShape} />;
  }

  // Skills
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    isRecord(data[0]) &&
    "items" in data[0] &&
    "label" in data[0]
  ) {
    return (
      <SkillsView
        categories={data as SkillCategoryData[]}
        onFilterByStack={(stack) =>
          onSendRaw(`/api/projects?stack=${encodeURIComponent(stack)}`, "GET")
        }
      />
    );
  }

  // Experience envelope shape: { experience }
  if (
    isRecord(data) &&
    "experience" in data &&
    Array.isArray((data as Record<string, unknown>).experience)
  ) {
    return (
      <ExperienceView
        experience={(data as { experience: ExperienceItem[] }).experience}
      />
    );
  }

  return <PrettyJson data={data} />;
}

// -- helpers ---------------------------------------------------------------

function ErrorCard({ status, data }: { status: number; data: unknown }) {
  const severe = status === 401 || status === 429 || status >= 500;
  const accent = severe ? "var(--status-5xx)" : "var(--status-4xx)";
  const message =
    (isRecord(data) && typeof data.error === "string" ? data.error : null) ??
    "Something went wrong.";
  const Icon = status === 401 || status === 429 ? ShieldAlert : AlertTriangle;

  return (
    <div className="p-6">
      <div
        className="animate-pop relative flex items-start gap-4 overflow-hidden rounded-xl border bg-surface p-5 elev-2"
        style={{
          borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`,
        }}
      >
        {/* Thick status-coloured spine plus a soft bleed of the same hue --
            an error should be unmistakable at a glance, not just tinted. */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1"
          style={{ background: accent }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: `color-mix(in oklab, ${accent} 25%, transparent)` }}
        />
        <Icon
          className="relative mt-0.5 h-5 w-5 shrink-0"
          style={{ color: accent }}
        />
        <div className="relative min-w-0">
          <div
            className="mono text-[13px] uppercase tracking-widest"
            style={{ color: accent }}
          >
            {status} error
          </div>
          <p className="mt-1 text-base text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

type ProfileShape = {
  name: string;
  role: string;
  photoUrl?: string;
  school: string;
  speciality?: string;
  schoolYears?: string;
  location?: string;
  seeking?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  bio: string[];
  journey?: string[];
  interests?: string[];
};

type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

function roleIcon(role: string): LucideIcon {
  const r = role.toLowerCase();
  if (r.includes("freelance") || r.includes("developer")) return Code2;
  if (r.includes("president") || r.includes("lead")) return Crown;
  if (r.includes("mentor")) return GraduationCap;
  if (r.includes("instructor") || r.includes("workshop")) return Presentation;
  return BriefcaseBusiness;
}

function ExperienceView({ experience }: { experience: ExperienceItem[] }) {
  return (
    <div className="space-y-5 p-5">
      <ol className="relative space-y-3 pl-6">
        {/* The spine draws itself downward once, so the timeline reads as
            being traced rather than simply appearing. */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 top-1 w-px origin-top bg-linear-to-b from-primary/70 via-border to-transparent"
          style={{ animation: "scale-y-in 900ms var(--e-out-expo) both" }}
        />
        {experience.map((e, i) => {
          const isActive = /present/i.test(e.period);
          const Icon = roleIcon(e.role);
          return (
            <li
              key={i}
              className="animate-fade-up relative"
              style={{ animationDelay: `${180 + i * 90}ms` }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-6 top-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4 ring-background",
                  isActive ? "animate-pulse-glow bg-primary" : "bg-border-strong",
                )}
              />
              <div
                className={cn(
                  "spotlight group rounded-xl border bg-card p-4 transition-[transform,box-shadow,border-color] duration-300 ease-(--e-out-quart) hover:-translate-y-0.5 hover:elev-2",
                  isActive
                    ? "border-primary/40"
                    : "border-border hover:border-border-strong",
                )}
              >
                <span aria-hidden className="spotlight-layer" />
                <div className="relative flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />
                    {e.role}
                    {isActive && (
                      <span className="mono ml-1 rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-primary">
                        active
                      </span>
                    )}
                  </h3>
                  <span className="mono text-[13px] text-muted-foreground">
                    {e.period}
                  </span>
                </div>
                <div className="relative text-sm text-primary">{e.org}</div>
                <ul className="relative mt-2 space-y-1.5">
                  {e.bullets.map((b, k) => (
                    <li
                      key={k}
                      className="relative pl-4 text-base text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.55rem] h-1.5 w-1.5 rounded-full bg-primary/60 transition-colors duration-300 group-hover:bg-primary"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

// Contact compose form — used by the request-tab Body area, not the response.
export function ContactCompose({
  onSubmit,
  loading,
}: {
  onSubmit: (payload: { name: string; email: string; message: string }) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, email, message });
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="message">
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputClass, "resize-y")}
        />
      </Field>
      <div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "press group relative inline-flex items-center gap-2 overflow-hidden rounded-md px-4 py-2 text-sm font-semibold",
            "bg-linear-to-b from-[color-mix(in_oklab,var(--primary)_92%,white)] to-primary text-primary-foreground",
            "shadow-(--glow-primary) hover:brightness-110 disabled:opacity-70",
          )}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5 transition-transform duration-200 ease-(--e-out-quart) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
          Send message (POST)
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-(--e-out-quart) focus:border-ring focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_18%,transparent)]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mono mb-1 text-[12px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
