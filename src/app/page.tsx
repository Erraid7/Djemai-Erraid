"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/client/Sidebar";
import { RequestBar } from "@/components/client/RequestBar";
import { TabBar, type RequestTab } from "@/components/client/TabBar";
import { ResponsePanel } from "@/components/client/ResponsePanel";
import { RequestTabBody } from "@/components/client/RequestTabBody";
import { ExpandedPreviewModal } from "@/components/client/ExpandedPreviewModal";
import { TestsStrip } from "@/components/client/TestsStrip";
import { useApiClient, type HttpMethod } from "@/hooks/useApiClient";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Home() {
  const client = useApiClient();
  const { method, url, response, loading, lastProjectsListIds, setMethod, setUrl, send } =
    client;

  const [tab, setTab] = useState<RequestTab>("params");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Fire the initial /api/me request on mount so the panel isn't empty.
  useEffect(() => {
    void send("/api/me", "GET");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isProjectResponse = useMemo(
    () =>
      response &&
      response.status < 400 &&
      response.data &&
      typeof response.data === "object" &&
      "stack" in (response.data as Record<string, unknown>) &&
      "links" in (response.data as Record<string, unknown>),
    [response],
  );

  const currentProjectId =
    isProjectResponse &&
    (response!.data as { id?: number }).id !== undefined
      ? (response!.data as { id: number }).id
      : null;

  const canNavigateModal =
    isProjectResponse !== null &&
    currentProjectId !== null &&
    lastProjectsListIds.length > 1;

  async function handleSelect(m: HttpMethod, u: string, locked?: boolean) {
    setTab("params");
    setMobileNavOpen(false);
    if (locked) {
      // Locked = login endpoint; move to Body tab so user sees the joke button.
      setMethod(m);
      setUrl(u);
      setTab("body");
      return;
    }
    if (m === "GET") {
      await send(u, m);
    } else {
      setMethod(m);
      setUrl(u);
      setTab("body");
    }
  }

  async function handleSend() {
    if (method === "POST" && url.startsWith("/api/contact")) {
      // Nudge the user to submit the form instead of sending an empty body.
      setTab("body");
      return;
    }
    if (method === "POST" && url.startsWith("/api/auth/login")) {
      await send(url, "POST");
      return;
    }
    await send(url, method);
  }

  const showTests = !!response?.tests && response.tests.length > 0;

  return (
    <div className="grid h-screen w-full grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden min-h-0 md:block">
        <Sidebar currentUrl={url} currentMethod={method} onSelect={handleSelect} />
      </div>

      <main className="flex min-h-0 flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2 md:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open collections"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Request collections</SheetTitle>
              <Sidebar currentUrl={url} currentMethod={method} onSelect={handleSelect} />
            </SheetContent>
          </Sheet>
          <span className="mono text-sm text-foreground">erraid.api</span>
        </div>

        <RequestBar
          method={method}
          url={url}
          loading={loading}
          onMethodChange={setMethod}
          onUrlChange={setUrl}
          onSend={handleSend}
        />

        <TabBar active={tab} onChange={setTab} />

        <RequestTabBody
          tab={tab}
          method={method}
          url={url}
          response={response}
          loading={loading}
          onSubmitContact={(payload) => void send("/api/contact", "POST", payload)}
          onLoginPoke={(credentials) => void send("/api/auth/login", "POST", credentials)}
        />

        <ResponsePanel
          response={response}
          loading={loading}
          method={method}
          onOpenProject={(id) => void send(`/api/projects/${id}`, "GET")}
          onExpand={() => setModalOpen(true)}
          onSendRaw={(u, m, b) => void send(u, m, b)}
        />

        {showTests ? <TestsStrip tests={response!.tests} /> : null}
      </main>

      <ExpandedPreviewModal
        open={modalOpen && !!isProjectResponse}
        response={response}
        onClose={() => setModalOpen(false)}
        canNavigate={canNavigateModal}
        onNavigate={(offset) => {
          if (currentProjectId === null) return;
          const ids = lastProjectsListIds.length > 0 ? lastProjectsListIds : [1, 2, 3, 4, 5];
          const idx = ids.indexOf(currentProjectId);
          const nextIdx = idx === -1 ? 0 : (idx + offset + ids.length) % ids.length;
          const nextId = ids[nextIdx]!;
          void send(`/api/projects/${nextId}`, "GET");
        }}
      />
    </div>
  );
}
