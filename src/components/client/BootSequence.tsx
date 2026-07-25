"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Connecting to erraid.api ...",
  "Authenticating session ... ok",
  "Loading collections (7) ...",
  "Ready.",
];

const SESSION_KEY = "boot-sequence-shown";
const LINE_DELAY_MS = 320;
const HOLD_MS = 450;
const EXIT_MS = 400;

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [linesShown, setLinesShown] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      onClick={skip}
      onKeyDown={skip}
      tabIndex={0}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-start justify-center bg-background px-8 transition-opacity duration-[400ms] sm:px-16 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="mono w-full max-w-lg space-y-2 text-sm text-muted-foreground">
        {LINES.slice(0, linesShown).map((line, i) => (
          <div
            key={i}
            className="animate-in fade-in slide-in-from-left-2 duration-300"
          >
            <span className="text-primary">$</span> {line}
          </div>
        ))}
        {linesShown < LINES.length && (
          <span className="caret-blink text-primary">▍</span>
        )}
      </div>
      <div className="mono absolute bottom-6 right-8 text-[10px] uppercase tracking-widest text-muted-foreground/60">
        click to skip
      </div>
    </div>
  );
}
