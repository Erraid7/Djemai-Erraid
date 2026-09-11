"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINES = [
  "Connecting to erraid.api ...",
  "Authenticating session ... ok",
  "Loading collections (7) ...",
  "Ready.",
];

const SESSION_KEY = "boot-sequence-shown";
const LINE_DELAY_MS = 300;
const HOLD_MS = 450;
const EXIT_MS = 450;

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [linesShown, setLinesShown] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Intentional: sessionStorage/matchMedia are unavailable during SSR, so
    // this has to run in an effect on mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(prefersReduced);

    if (alreadyShown || prefersReduced) {
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible || exiting) return;
    if (linesShown >= LINES.length) {
      const holdTimer = setTimeout(() => setExiting(true), HOLD_MS);
      return () => clearTimeout(holdTimer);
    }
    const timer = setTimeout(() => setLinesShown((n) => n + 1), LINE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [visible, exiting, linesShown]);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => setVisible(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [exiting]);

  function skip() {
    setLinesShown(LINES.length);
    setExiting(true);
  }

  if (!visible || reducedMotion) return null;

  const progress = Math.round((linesShown / LINES.length) * 100);

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      onClick={skip}
      onKeyDown={skip}
      tabIndex={0}
      className={cn(
        "fixed inset-0 z-100 flex cursor-pointer flex-col items-start justify-center overflow-hidden bg-background px-8 sm:px-16",
        "transition-[opacity,transform] duration-450 ease-(--e-out-expo)",
        exiting ? "pointer-events-none scale-105 opacity-0" : "opacity-100",
      )}
    >
      {/* Terminal dressing: faint grid, a slow scanline, and a green wash --
          enough to read as a console without obscuring the text. */}
      <div aria-hidden className="app-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]"
      />
      <div
        aria-hidden
        className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-transparent via-primary/6 to-transparent"
      />

      <div className="relative w-full max-w-lg">
        <div className="mono mb-4 flex items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-primary/70">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          erraid.api
        </div>

        <div className="mono space-y-2 text-base text-muted-foreground">
          {LINES.slice(0, linesShown).map((line, i) => (
            <div
              key={i}
              className="animate-in fade-in slide-in-from-left-2 flex items-baseline gap-2 duration-300"
            >
              <span className="text-primary">$</span>
              <span>{line}</span>
              {i === LINES.length - 1 ? (
                <span className="text-primary">✓</span>
              ) : null}
            </div>
          ))}
          {linesShown < LINES.length && (
            <span className="caret-blink inline-block text-primary">▍</span>
          )}
        </div>

        {/* Determinate bar: the overlay says how much longer it intends to
            stay, instead of just sitting there. */}
        <div className="mt-6 h-px w-full overflow-hidden bg-border">
          <div
            className="h-full bg-linear-to-r from-primary/40 to-primary transition-[width] duration-300 ease-(--e-out-expo)"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mono absolute bottom-6 right-8 text-[12px] uppercase tracking-widest text-muted-foreground/50">
        click to skip
      </div>
    </div>
  );
}
