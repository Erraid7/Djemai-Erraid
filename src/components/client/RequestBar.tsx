"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function RequestBar({
  method,
  url,
  loading,
  onMethodChange,
  onUrlChange,
  onSend,
}: {
  method: "GET" | "POST";
  url: string;
  loading: boolean;
  onMethodChange: (m: "GET" | "POST") => void;
  onUrlChange: (u: string) => void;
  onSend: () => void;
}) {
  // Local input state keeps typing responsive even when the parent updates url.
  const [draft, setDraft] = useState(url);
  // Intentional: resync the local draft whenever the external url changes
  // (sidebar click, modal navigation, etc.) -- this is the documented
  // "adjusting state when a prop changes" exception, not an accidental effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDraft(url), [url]);

  const inputRef = useRef<HTMLInputElement>(null);
  // onSend is a fresh closure on every parent render; parking it in a ref
  // keeps the global key listener registered exactly once for the session.
  const onSendRef = useRef(onSend);
  useEffect(() => {
    onSendRef.current = onSend;
  }, [onSend]);
  // Bumped on every submit so the Send button can replay its sheen sweep.
  const [sendPulse, setSendPulse] = useState(0);
  const [focused, setFocused] = useState(false);

  // Power-user shortcuts: "/" jumps to the URL bar, Ctrl/Cmd+Enter fires the
  // request from anywhere. Both bail out while the user is typing elsewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        setSendPulse((n) => n + 1);
        onSendRef.current();
        return;
      }
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isGet = method === "GET";
  const methodVar = isGet ? "var(--method-get)" : "var(--method-post)";

  return (
    <div className="relative flex items-stretch gap-2 border-b border-border bg-surface px-4 py-3">
      {/* Method selector. The native <select> stays (accessible, mobile-native
          picker) but is painted as a tinted pill matching the method colour. */}
      <div
        className="press relative flex items-center rounded-md border pl-3 pr-7"
        style={{
          borderColor: `color-mix(in oklab, ${methodVar} 35%, transparent)`,
          background: `color-mix(in oklab, ${methodVar} 10%, var(--input))`,
        }}
      >
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value as "GET" | "POST")}
          aria-label="HTTP method"
          className="mono cursor-pointer appearance-none bg-transparent pr-1 text-sm font-bold uppercase tracking-wider outline-none"
          style={{ color: methodVar }}
        >
          <option value="GET" className="bg-surface text-foreground">
            GET
          </option>
          <option value="POST" className="bg-surface text-foreground">
            POST
          </option>
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-2 h-3.5 w-3.5 opacity-60"
          style={{ color: methodVar }}
        />
      </div>

      <form
        className="flex flex-1 items-stretch gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onUrlChange(draft);
          setSendPulse((n) => n + 1);
          onSend();
          inputRef.current?.blur();
        }}
      >
        <div
          className={cn(
            "relative flex flex-1 items-center rounded-md border bg-input",
            "transition-[border-color,box-shadow,background-color] duration-200 ease-(--e-out-quart)",
            focused
              ? "border-ring shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_18%,transparent)]"
              : "border-border hover:border-border-strong",
          )}
        >
          {/* Fake origin. Sells the "real client" illusion and visually
              anchors the editable path as the only part that changes. */}
          <span
            aria-hidden
            className="mono hidden select-none py-2 pl-3 text-[15px] text-muted-foreground/60 sm:block"
          >
            erraid.api
          </span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onUrlChange(draft);
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Request URL"
            placeholder="/api/..."
            className="mono min-w-0 flex-1 bg-transparent py-2 pl-3 pr-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground sm:pl-0"
          />
          <kbd
            aria-hidden
            className={cn(
              "mono mr-2 hidden shrink-0 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted-foreground",
              "transition-opacity duration-200 lg:block",
              focused ? "opacity-0" : "opacity-100",
            )}
          >
            /
          </kbd>
        </div>

        <button
          type="submit"
          disabled={loading}
          title="Send request (Ctrl/⌘ + Enter)"
          className={cn(
            "press group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-md px-4 text-base font-semibold",
            "bg-linear-to-b from-[color-mix(in_oklab,var(--primary)_92%,white)] to-primary text-primary-foreground",
            "shadow-(--glow-primary) hover:brightness-110",
            "disabled:cursor-not-allowed disabled:opacity-70 disabled:brightness-100",
          )}
        >
          {/* Light sweep, replayed per submit via the keyed remount. */}
          <span
            key={sendPulse}
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-white/25 blur-[2px]",
              sendPulse > 0 && "animate-sheen",
            )}
          />
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 transition-transform duration-200 ease-(--e-out-quart) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
          <span className="relative">Send</span>
        </button>
      </form>

      {/* In-flight indicator hugging the bottom edge, the way a browser or a
          real API client reports an outstanding request. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden",
          loading ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300",
        )}
      >
        <div className="animate-indeterminate h-full w-full bg-linear-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
}
