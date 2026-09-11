"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import { Sidebar } from "@/components/client/Sidebar";
import { RequestBar } from "@/components/client/RequestBar";
import { TabBar, type RequestTab } from "@/components/client/TabBar";
import { ResponsePanel } from "@/components/client/ResponsePanel";
import { RequestTabBody } from "@/components/client/RequestTabBody";
import { ExpandedPreviewModal } from "@/components/client/ExpandedPreviewModal";
import { TestsStrip } from "@/components/client/TestsStrip";
import { BootSequence } from "@/components/client/BootSequence";
import { ImagePreloader } from "@/components/client/ImagePreloader";
import { CommandPalette } from "@/components/client/CommandPalette";
import { DiscoveryToast } from "@/components/client/DiscoveryToast";
import { useApiClient, type HttpMethod } from "@/hooks/useApiClient";
import { useDiscovery } from "@/hooks/useDiscovery";
import { formatHash, parseHash } from "@/hooks/useHashRoute";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profile } from "@/lib/seed/profile";

export default function Home() {
  const client = useApiClient();
  const { method, url, response, loading, lastProjectsListIds, setMethod, setUrl, send } =
    client;

  const discovery = useDiscovery();
  const { record } = discovery;

  const [tab, setTab] = useState<RequestTab>("params");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Set while navigation originated from the hash (back/forward, or a pasted
  // deep link) so the resulting request doesn't push a duplicate entry.
  const fromHash = useRef(false);
  const hashInitialised = useRef(false);

  const syncHash = useCallback((m: HttpMethod, u: string) => {
    const desired = formatHash(m, u);
    if (window.location.hash === desired) return;
    if (fromHash.current) {
      fromHash.current = false;
      return;
    }
    if (!hashInitialised.current) {
      hashInitialised.current = true;
      window.history.replaceState(null, "", desired);
      return;
    }
    window.history.pushState(null, "", desired);
  }, []);

  /**
   * Single funnel for every request in the app. Everything that fires a
   * request goes through here so discovery tracking and deep-link syncing
   * can't be forgotten at one of the many call sites.
   */
  const run = useCallback(
    async (u: string, m: HttpMethod, body?: unknown) => {
      const result = await send(u, m, body);
      if (result) {
        record(m, u, result.status);
        syncHash(m, u);
      }
      return result;
    },
    [send, record, syncHash],
  );

  // Boot into whatever the hash asks for, falling back to home.
  useEffect(() => {
    const initial = parseHash(window.location.hash);
    if (initial) {
      hashInitialised.current = true;
      fromHash.current = true;
      void run(initial.url, initial.method);
    } else {
      void run("/api/home", "GET");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser back/forward.
  useEffect(() => {
    function onPop() {
      const route = parseHash(window.location.hash);
      if (!route) return;
      fromHash.current = true;
      setTab("params");
      void run(route.url, route.method);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [run]);

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
    isProjectResponse && (response!.data as { id?: number }).id !== undefined
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
      syncHash(m, u);
      return;
    }
    if (m === "GET") {
      await run(u, m);
    } else {
      setMethod(m);
      setUrl(u);
      setTab("body");
      syncHash(m, u);
    }
  }

  async function handleSend() {
    if (method === "POST" && url.startsWith("/api/contact")) {
      // Nudge the user to submit the form instead of sending an empty body.
      setTab("body");
      return;
    }
    await run(url, method);
  }

  const showTests = !!response?.tests && response.tests.length > 0;
  // Endpoints whose Body tab holds a real composer worth pointing at.
  const hasBodyComposer =
    method === "POST" &&
    (url.startsWith("/api/contact") || url.startsWith("/api/auth/login"));

  return (
    <div className="relative grid h-screen w-full grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Ambient shell. Fixed and behind everything, so panels read as layers
          floating over a lit space rather than as one flat dark fill. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="app-vignette absolute inset-0" />
        <div className="app-grid absolute inset-0" />
        <div className="app-grain absolute inset-0" />
      </div>

      <BootSequence />
      <ImagePreloader />

      <div className="hidden min-h-0 md:block">
        <Sidebar
          currentUrl={url}
          currentMethod={method}
          onSelect={handleSelect}
          secretsFound={discovery.secretsFound}
          discoveredCount={discovery.count}
          discoveredTotal={discovery.total}
          onOpenPalette={() => setPaletteOpen(true)}
        />
      </div>

      <main className="flex min-h-0 flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2 md:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open collections"
              className="press inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-foreground hover:border-border-strong hover:bg-surface-3"
            >
              <Menu className="h-5 w-5" />
            </button>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Request collections</SheetTitle>
              <Sidebar
                currentUrl={url}
                currentMethod={method}
                onSelect={handleSelect}
                secretsFound={discovery.secretsFound}
                discoveredCount={discovery.count}
                discoveredTotal={discovery.total}
              />
            </SheetContent>
          </Sheet>

          <div className="relative shrink-0">
            <Avatar className="h-7 w-7 border border-border-strong">
              <AvatarImage src={profile.photoUrl} alt={profile.name} />
              <AvatarFallback className="mono text-[9px]">
                {profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <span
              aria-hidden
              className="absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full border-2 border-surface bg-primary"
            />
          </div>
          <span className="mono bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-sm text-transparent">
            erraid.api
          </span>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search everything"
            className="press ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-muted-foreground hover:border-border-strong hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <span className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
            {discovery.count}/{discovery.total}
          </span>
        </div>

        <RequestBar
          method={method}
          url={url}
          loading={loading}
          onMethodChange={setMethod}
          onUrlChange={setUrl}
          onSend={handleSend}
        />

        <TabBar active={tab} onChange={setTab} bodyHint={hasBodyComposer} />

        <RequestTabBody
          tab={tab}
          method={method}
          url={url}
          response={response}
          loading={loading}
          onSubmitContact={(payload) => void run("/api/contact", "POST", payload)}
          onLoginPoke={(credentials) =>
            void run("/api/auth/login", "POST", credentials)
          }
        />

        <ResponsePanel
          response={response}
          loading={loading}
          method={method}
          onOpenProject={(id) => void run(`/api/projects/${id}`, "GET")}
          onExpand={() => setModalOpen(true)}
          onSendRaw={(u, m, b) => void run(u, m, b)}
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
          const ids =
            lastProjectsListIds.length > 0 ? lastProjectsListIds : [1, 2, 3, 4, 5];
          const idx = ids.indexOf(currentProjectId);
          const nextIdx = idx === -1 ? 0 : (idx + offset + ids.length) % ids.length;
          const nextId = ids[nextIdx]!;
          void run(`/api/projects/${nextId}`, "GET");
        }}
      />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onRun={(u, m) => {
          setTab("params");
          void run(u, m);
        }}
      />

      <DiscoveryToast
        endpoint={discovery.celebration}
        found={discovery.count}
        total={discovery.total}
        onDismiss={discovery.dismissCelebration}
      />
    </div>
  );
}
