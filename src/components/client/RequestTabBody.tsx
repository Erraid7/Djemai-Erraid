"use client";

import { useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import type { RequestTab } from "./TabBar";
import type { HttpMethod } from "@/hooks/useApiClient";
import { ContactCompose } from "./ResponsePanel";
import { Markdown } from "./Markdown";
import type { ApiEnvelope, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-border bg-input px-3 py-2 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-(--e-out-quart) focus:border-ring focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_18%,transparent)]";

export function RequestTabBody({
  tab,
  method,
  url,
  response,
  loading,
  onSubmitContact,
  onLoginPoke,
}: {
  tab: RequestTab;
  method: HttpMethod;
  url: string;
  response: ApiEnvelope<unknown> | null;
  loading: boolean;
  onSubmitContact: (payload: {
    name: string;
    email: string;
    message: string;
  }) => void;
  onLoginPoke: (credentials: { email: string; password: string }) => void;
}) {
  const params = useMemo(() => extractPathParams(url), [url]);
  const isContact = url.startsWith("/api/contact");
  const isLogin = url.startsWith("/api/auth/login");

  return (
    <div className="border-b border-border bg-background px-4 py-4">
      {/* Keyed on the tab so switching cross-fades the panel instead of
          snapping between two different content heights. */}
      <div key={tab} className="animate-fade-up">
        {tab === "params" ? (
          <ParamsView params={params} />
        ) : tab === "headers" ? (
          <HeadersView method={method} />
        ) : tab === "body" ? (
          isContact ? (
            <ContactCompose onSubmit={onSubmitContact} loading={loading} />
          ) : isLogin ? (
            <LoginPoke onSubmit={onLoginPoke} loading={loading} />
          ) : (
            <EmptyBody method={method} />
          )
        ) : (
          <DocsView response={response} url={url} />
        )}
      </div>
    </div>
  );
}

function ParamsView({ params }: { params: { key: string; value: string }[] }) {
  if (params.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No path parameters in this URL. Try{" "}
        <code className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-foreground">
          /api/projects/1
        </code>
        .
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-base">
        <thead className="bg-surface text-[12px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-3 py-1.5 text-left font-medium">key</th>
            <th className="px-3 py-1.5 text-left font-medium">value</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr
              key={p.key}
              className="border-t border-border transition-colors hover:bg-surface/60"
            >
              <td className="mono px-3 py-1.5 text-primary">{p.key}</td>
              <td className="mono px-3 py-1.5 text-foreground/85">{p.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HeadersView({ method }: { method: HttpMethod }) {
  const headers = [
    { key: "Accept", value: "application/json" },
    ...(method === "POST"
      ? [{ key: "Content-Type", value: "application/json" }]
      : []),
    { key: "X-Client", value: "erraid.api client v1" },
  ];
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-base">
        <tbody>
          {headers.map((h) => (
            <tr
              key={h.key}
              className="border-t border-border transition-colors first:border-t-0 hover:bg-surface/60"
            >
              <td className="mono w-1/3 bg-surface px-3 py-1.5 text-muted-foreground">
                {h.key}
              </td>
              <td className="mono px-3 py-1.5 text-foreground/85">{h.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyBody({ method }: { method: HttpMethod }) {
  return (
    <p className="text-sm text-muted-foreground">
      {method === "GET"
        ? "GET requests have no body."
        : "No body composer for this endpoint."}
    </p>
  );
}

function LoginPoke({
  onSubmit,
  loading,
}: {
  onSubmit: (credentials: { email: string; password: string }) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="grid max-w-sm gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <div className="grid gap-2">
        <label className="block">
          <div className="mono mb-1 text-[12px] uppercase tracking-widest text-muted-foreground">
            email
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <div className="mono mb-1 text-[12px] uppercase tracking-widest text-muted-foreground">
            password
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={fieldClass}
          />
        </label>
      </div>
      <p className="rounded-md border border-dashed border-border bg-surface/50 px-3 py-2 text-sm text-muted-foreground">
        Spoiler: I won&apos;t authenticate you anyway — this route is real, but
        no combination of these fields gets you in. Send it and see what comes
        back.
      </p>
      <div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "press group inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-foreground",
            "hover:border-method-post/50 hover:bg-surface-3 disabled:opacity-70",
          )}
        >
          <KeyRound className="h-3.5 w-3.5 text-method-post transition-transform duration-300 ease-(--e-spring) group-hover:rotate-12" />
          Try to log in
        </button>
      </div>
    </form>
  );
}

function DocsView({
  response,
  url,
}: {
  response: ApiEnvelope<unknown> | null;
  url: string;
}) {
  const project =
    response &&
    isRecord(response.data) &&
    "stack" in response.data &&
    "docsMarkdown" in response.data
      ? (response.data as Project)
      : null;

  if (project) {
    return (
      <article className="max-h-80 overflow-y-auto pr-2">
        <Markdown source={project.docsMarkdown} />
      </article>
    );
  }
  return (
    <div className="space-y-2 text-base text-muted-foreground">
      <p>
        The <span className="mono text-foreground">Docs</span> tab shows the
        long-form case study for a single project response.
      </p>
      <p>
        Try firing{" "}
        <code className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-foreground">
          GET /api/projects/1
        </code>{" "}
        and switch back here.
      </p>
      <p className="mono text-[13px] text-muted-foreground/70">current: {url}</p>
    </div>
  );
}

function extractPathParams(url: string) {
  // Cheap heuristic: last numeric segment on /api/projects/:id → { id }.
  const m = url.match(/^\/api\/projects\/(\d+)\/?$/);
  if (m) return [{ key: "id", value: m[1]! }];
  return [];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
