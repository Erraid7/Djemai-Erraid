import { useCallback, useState } from "react";
import type { ApiEnvelope } from "@/lib/types";

export type HttpMethod = "GET" | "POST";

export type ApiClientState = {
  method: HttpMethod;
  url: string;
  response: ApiEnvelope<unknown> | null;
  loading: boolean;
  lastProjectsListIds: number[];
  setMethod: (m: HttpMethod) => void;
  setUrl: (u: string) => void;
  send: (overrideUrl?: string, overrideMethod?: HttpMethod, body?: unknown) => Promise<ApiEnvelope<unknown> | null>;
};

export function useApiClient(): ApiClientState {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("/api/me");
  const [response, setResponse] = useState<ApiEnvelope<unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastProjectsListIds, setLastProjectsListIds] = useState<number[]>([]);

  const send = useCallback(
    async (overrideUrl?: string, overrideMethod?: HttpMethod, body?: unknown) => {
      const targetUrl = overrideUrl ?? url;
      const targetMethod = overrideMethod ?? method;
      setUrl(targetUrl);
      setMethod(targetMethod);
      setLoading(true);
      const t0 =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      let json: ApiEnvelope<unknown>;
      try {
        const res = await fetch(targetUrl, {
          method: targetMethod,
          headers:
            targetMethod === "POST"
              ? { "Content-Type": "application/json" }
              : undefined,
          body: targetMethod === "POST" && body !== undefined
            ? JSON.stringify(body)
            : undefined,
        });
        try {
          json = (await res.json()) as ApiEnvelope<unknown>;
        } catch {
          json = {
            status: res.status,
            statusText: res.statusText || "Error",
            data: { error: "Response body was not valid JSON." },
          };
        }
        if (typeof json.status !== "number") json.status = res.status;
        if (typeof json.statusText !== "string")
          json.statusText = res.statusText || "";
      } catch (err) {
        json = {
          status: 0,
          statusText: "Network error",
          data: {
            error: err instanceof Error ? err.message : "Request failed to send.",
          },
        };
      }
      const time = Math.round(
        (typeof performance !== "undefined" ? performance.now() : Date.now()) - t0,
      );
      const size = new Blob([JSON.stringify(json)]).size;
      const enriched: ApiEnvelope<unknown> = { ...json, _meta: { time, size } };
      setResponse(enriched);

      // Cache the numeric ids returned by GET /api/projects so the modal's
      // arrow navigation can iterate through the full list (pinned + hidden).
      if (
        targetMethod === "GET" &&
        /^\/api\/projects\/?$/.test(targetUrl) &&
        Array.isArray(enriched.data)
      ) {
        const ids = (enriched.data as Array<{ id?: number }>)
          .map((p) => (typeof p?.id === "number" ? p.id : null))
          .filter((n): n is number => n !== null);
        setLastProjectsListIds(ids);
      }

      setLoading(false);
      return enriched;
    },
    [method, url],
  );

  return {
    method,
    url,
    response,
    loading,
    lastProjectsListIds,
    setMethod,
    setUrl,
    send,
  };
}
