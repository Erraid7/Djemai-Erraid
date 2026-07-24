import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, GraduationCap, AlertTriangle, ShieldAlert, Send, Check, Loader2 } from "lucide-react";
import type { ApiEnvelope, Project } from "@/lib/types";
import { StatusBadge } from "./badges";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectListPreview } from "./ProjectListPreview";
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
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !response ? (
          <EmptyState method={method} />
        ) : mode === "pretty" ? (
          <PrettyJson data={response} />
        ) : (
          <PreviewBody
            response={response}
            onOpenProject={onOpenProject}
            onExpand={onExpand}
            onSendRaw={onSendRaw}
          />
        )}
      </div>
    </section>
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

  // Profile
  if (isRecord(data) && "school" in data && "bio" in data) {
    return <ProfileCard data={data as ProfileShape} />;
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

  // Experience envelope shape: { experience, impactStats }
  if (isRecord(data) && "experience" in data && "impactStats" in data) {
    return (
      <ExperienceView
        experience={
          (data as { experience: ExperienceItem[] }).experience
        }
        impactStats={(data as { impactStats: Stat[] }).impactStats}
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
  schoolYears?: string;
  location?: string;
  seeking?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  bio: string[];
};

function ProfileCard({ data }: { data: ProfileShape }) {
  return (
    <div className="p-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-gradient-to-br from-surface-3 to-surface px-6 py-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0 border border-border-strong sm:h-20 sm:w-20">
              <AvatarImage src={data.photoUrl} alt={data.name} />
              <AvatarFallback className="mono text-lg">
                {data.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="mono text-[11px] uppercase tracking-widest text-primary">
                {data.seeking}
              </div>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">
                {data.name}
              </h2>
              <div className="mt-1 text-sm text-muted-foreground">{data.role}</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {data.school && (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                {data.school} {data.schoolYears ? `· ${data.schoolYears}` : ""}
              </span>
            )}
            {data.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {data.location}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 px-6 py-5">
          {data.bio.map((p, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-foreground/85"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border bg-surface px-6 py-4">
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:border-ring"
            >
              <Mail className="h-3.5 w-3.5 text-primary" />
              {data.email}
            </a>
          )}
          {data.phone && (
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" />
              {data.phone}
            </span>
          )}
          {data.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:border-ring"
            >
              <Github className="h-3.5 w-3.5 text-primary" />
              GitHub ↗
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:border-ring"
            >
              <Linkedin className="h-3.5 w-3.5 text-primary" />
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillsGrid({
  categories,
}: {
  categories: { id: string; label: string; items: string[] }[];
}) {
  return (
    <div className="grid gap-4 p-5 md:grid-cols-2">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {cat.label}
            </h3>
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {cat.items.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((s) => (
              <span
                key={s}
                className="mono rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11.5px] text-foreground/85"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};
type Stat = { value: string; label: string };

function ExperienceView({
  experience,
  impactStats,
}: {
  experience: ExperienceItem[];
  impactStats: Stat[];
}) {
  return (
    <div className="space-y-5 p-5">
      <div className="grid gap-3 sm:grid-cols-4">
        {impactStats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <div className="text-xl font-semibold text-foreground">
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <ol className="relative space-y-3 border-l border-border pl-5">
        {experience.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-2 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {e.role}
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
        ))}
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
