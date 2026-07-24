import { useMemo, useState } from "react";
import type { RequestTab } from "./TabBar";
import type { HttpMethod } from "@/hooks/useApiClient";
import { ContactCompose } from "./ResponsePanel";
import type { ApiEnvelope, Project } from "@/lib/types";

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
  onSubmitContact: (payload: { name: string; email: string; message: string }) => void;
  onLoginPoke: (credentials: { email: string; password: string }) => void;
}) {
  const params = useMemo(() => extractPathParams(url), [url]);
  const isContact = url.startsWith("/api/contact");
  const isLogin = url.startsWith("/api/auth/login");

  return (
    <div className="border-b border-border bg-background px-4 py-4">
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
  );
}

function ParamsView({ params }: { params: { key: string; value: string }[] }) {
  if (params.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No path parameters in this URL. Try{" "}
        <code className="mono text-foreground">/api/projects/1</code>.
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface text-[10px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-3 py-1.5 text-left font-medium">key</th>
            <th className="px-3 py-1.5 text-left font-medium">value</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.key} className="border-t border-border">
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
      <table className="w-full text-sm">
        <tbody>
          {headers.map((h) => (
            <tr key={h.key} className="border-t border-border first:border-t-0">
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
    <p className="text-xs text-muted-foreground">
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
          <div className="mono mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            email
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none focus:border-ring"
          />
        </label>
        <label className="block">
          <div className="mono mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            password
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none focus:border-ring"
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        Spoiler: I won&apos;t authenticate you anyway — this route is real, but
        no combination of these fields gets you in. Send it and see what comes
        back.
      </p>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:border-ring disabled:opacity-70"
        >
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
      <article className="prose-portfolio mono max-w-none whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/85">
        {project.docsMarkdown}
      </article>
    );
  }
  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p>
        The <span className="mono text-foreground">Docs</span> tab shows the
        long-form case study for a single project response.
      </p>
      <p>
        Try firing{" "}
        <span className="mono text-foreground">GET /api/projects/1</span> and
        switch back here.
      </p>
      <p className="mono text-[11px] text-muted-foreground/70">
        current: {url}
      </p>
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
