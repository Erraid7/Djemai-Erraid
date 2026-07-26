import { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  Check,
  Loader2,
  Layout,
  Server,
  Database,
  Smartphone,
  Bot,
  Palette,
  TestTube,
  Wrench,
  Crown,
  Code2,
  GraduationCap,
  Presentation,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";
import type { ApiEnvelope, Project } from "@/lib/types";
import { StatusBadge } from "./badges";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectListPreview } from "./ProjectListPreview";
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

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
        <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Response
        </div>
        {response ? (
          <>
            <StatusBadge
              status={response.status}
              statusText={response.statusText}
            />
            {response._meta ? (
              <div className="mono flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>
                  time <span className="text-foreground">{response._meta.time}ms</span>
                </span>
                <span>·</span>
                <span>
                  size{" "}
                  <span className="text-foreground">
                    {formatBytes(response._meta.size)}
                  </span>
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">
            Fire a request to see the response.
          </span>
        )}

        {loading && response ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ) : null}

        <div className="ml-auto inline-flex overflow-hidden rounded-md border border-border">
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

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && !response ? (
          <ResponseSkeleton />
        ) : !response ? (
          <EmptyState method={method} />
        ) : mode === "pretty" ? (
          <div
            key={`pretty-${response.status}-${response._meta?.time ?? 0}`}
            className="animate-in fade-in duration-200"
          >
            <PrettyJson data={response} />
          </div>
        ) : (
          <div
            key={`preview-${response.status}-${response._meta?.time ?? 0}`}
            className="animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
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

function ResponseSkeleton() {
  return (
    <div className="space-y-4 p-5" aria-hidden>
      <div className="skeleton-shimmer h-20 w-20 rounded-full" />
      <div className="skeleton-shimmer h-5 w-48 rounded-md" />
      <div className="skeleton-shimmer h-4 w-72 rounded-md" />
      <div className="skeleton-shimmer h-32 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton-shimmer h-16 rounded-xl" />
        <div className="skeleton-shimmer h-16 rounded-xl" />
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
        "px-3 py-1.5 text-[11px] font-medium transition-colors",
        active
          ? "bg-surface-3 text-foreground"
          : "bg-surface text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ method }: { method: HttpMethod }) {
  return (
    <div className="flex h-full items-center justify-center p-10 text-center">
      <div>
        <div className="mono text-xs uppercase tracking-widest text-muted-foreground">
          idle
        </div>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {method === "GET"
            ? "Pick a request from the sidebar or hit Send to fire the current one."
            : "This is a POST endpoint — Send when you're ready."}
        </p>
      </div>
    </div>
  );
}

function PrettyJson({ data }: { data: unknown }) {
  return (
    <pre className="mono whitespace-pre-wrap break-words p-4 text-[12.5px] leading-relaxed text-foreground/85">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function PreviewBody({
  response,
  onOpenProject,
  onExpand,
  // Reserved for a future interactive-retry feature (e.g. re-firing a request
  // with edited params directly from the preview) -- not consumed yet.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Contact accepted
  if (
    isRecord(data) &&
    "queued" in data &&
    (data as { queued?: boolean }).queued === true
  ) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-6 py-6 text-center">
          <Check className="mx-auto mb-2 h-6 w-6 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Message queued
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Server accepted your message. In the real backend this would send an
            email and store the row.
          </p>
        </div>
      </div>
    );
  }

  // Project[]
  if (Array.isArray(data) && data.length > 0 && isRecord(data[0]) && "stack" in data[0]) {
    return (
      <div className="p-5">
        <ProjectListPreview
          projects={data as Project[]}
          onOpen={onOpenProject}
        />
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
        data={data as {
          name: string;
          role: string;
          photoUrl?: string;
          status: string;
          tagline: string;
          stats?: { value: string; label: string }[];
          howToUse: string[];
        }}
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
      <SkillsGrid
        categories={data as { id: string; label: string; items: string[] }[]}
      />
    );
  }

  // Experience envelope shape: { experience }
  if (isRecord(data) && "experience" in data && Array.isArray((data as Record<string, unknown>).experience)) {
    return (
      <ExperienceView
        experience={
          (data as { experience: ExperienceItem[] }).experience
        }
      />
    );
  }

  // Contact form fallback: prompt to submit
  if (
    // If this rendered from picking POST /api/contact (before any submit), data may not match.
    // Show a small compose form.
    false
  ) {
    // handled by request tab body — see index route
  }

  return <PrettyJson data={data} />;
}

// -- helpers ---------------------------------------------------------------

function ErrorCard({ status, data }: { status: number; data: unknown }) {
  const tone =
    status === 401 || status === 429 || status >= 500
      ? "border-[color:var(--status-5xx)]/50 bg-[color:var(--status-5xx)]/10 text-[color:var(--status-5xx)]"
      : "border-[color:var(--status-4xx)]/50 bg-[color:var(--status-4xx)]/10 text-[color:var(--status-4xx)]";
  const message =
    (isRecord(data) && typeof data.error === "string" ? data.error : null) ??
    "Something went wrong.";
  const Icon =
    status === 401 || status === 429 ? ShieldAlert : AlertTriangle;

  return (
    <div className="p-6">
      <div
        className={cn(
          "flex items-start gap-4 rounded-xl border-l-4 border bg-surface p-5",
          tone,
        )}
      >
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <div className="mono text-[11px] uppercase tracking-widest">
            {status} error
          </div>
          <p className="mt-1 text-sm text-foreground">{message}</p>
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


const skillCategoryIcons: Record<string, LucideIcon> = {
  frontend: Layout,
  backend: Server,
  database: Database,
  mobile: Smartphone,
  ai: Bot,
  design: Palette,
  devops: TestTube,
};

const skillCategoryAccents = [
  "border-l-[color:var(--primary)]",
  "border-l-[color:var(--method-post)]",
  "border-l-[color:var(--status-2xx)]",
  "border-l-[color:var(--method-get)]",
];

function SkillsGrid({
  categories,
}: {
  categories: { id: string; label: string; items: string[] }[];
}) {
  return (
    <div className="grid gap-4 p-5 md:grid-cols-2">
      {categories.map((cat, i) => {
        const Icon = skillCategoryIcons[cat.id] ?? Wrench;
        const accent = skillCategoryAccents[i % skillCategoryAccents.length];
        return (
          <div
            key={cat.id}
            className={cn(
              "animate-in fade-in slide-in-from-bottom-1 rounded-xl border border-border border-l-2 bg-card p-4 duration-500 [animation-fill-mode:backwards]",
              accent,
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {cat.label}
                </h3>
              </div>
              <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {cat.items.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((s) => (
                <span
                  key={s}
                  className="mono rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11.5px] text-foreground/85 transition-colors hover:border-ring hover:text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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

      <ol className="relative space-y-3 border-l border-border pl-5">
        <span
          aria-hidden
          className="absolute -left-px top-0 w-px origin-top animate-in fade-in bg-gradient-to-b from-primary/60 to-transparent duration-700"
          style={{ height: "100%" }}
        />
        {experience.map((e, i) => {
          const isActive = /present/i.test(e.period);
          const Icon = roleIcon(e.role);
          return (
            <li
              key={i}
              className="relative animate-in fade-in slide-in-from-left-2 duration-500 [animation-fill-mode:backwards]"
              style={{ animationDelay: `${150 + i * 90}ms` }}
            >
              <span
                className={cn(
                  "absolute -left-[27px] top-2 h-2 w-2 rounded-full ring-4 ring-background",
                  isActive ? "bg-primary animate-pulse" : "bg-border-strong",
                )}
              />
              <div
                className={cn(
                  "rounded-xl border bg-card p-4",
                  isActive ? "border-primary/40" : "border-border",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {e.role}
                    {isActive && (
                      <span className="mono ml-1 rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-primary">
                        active
                      </span>
                    )}
                  </h3>
                  <span className="mono text-[11px] text-muted-foreground">
                    {e.period}
                  </span>
                </div>
                <div className="text-xs text-primary">{e.org}</div>
                <ul className="mt-2 space-y-1.5">
                  {e.bullets.map((b, k) => (
                    <li
                      key={k}
                      className="relative pl-4 text-sm text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.55rem] h-1.5 w-1.5 rounded-full bg-primary/60"
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
            className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none focus:border-ring"
          />
        </Field>
        <Field label="email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none focus:border-ring"
          />
        </Field>
      </div>
      <Field label="message">
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring"
        />
      </Field>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Send message (POST)
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mono mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
