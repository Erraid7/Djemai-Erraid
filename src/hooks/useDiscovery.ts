"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DISCOVERABLE,
  TOTAL_DISCOVERABLE,
  type DiscoverableEndpoint,
  keyOf,
  match,
  readDiscovered,
  writeDiscovered,
} from "@/lib/discovery";

export type DiscoveryState = {
  /** Persisted keys, e.g. "GET /api/coffee". */
  discovered: Set<string>;
  count: number;
  total: number;
  secretsFound: DiscoverableEndpoint[];
  allFound: boolean;
  /** Most recent secret found, awaiting its celebration toast. */
  celebration: DiscoverableEndpoint | null;
  dismissCelebration: () => void;
  /** Call once per completed request. */
  record: (method: string, url: string, status: number) => void;
};

export function useDiscovery(): DiscoveryState {
  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set());
  const [celebration, setCelebration] = useState<DiscoverableEndpoint | null>(
    null,
  );
  // Mirrors state so `record` can dedupe without depending on the latest
  // render's closure (it's called from async request handlers).
  const discoveredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const stored = readDiscovered();
    discoveredRef.current = stored;
    // Intentional: localStorage is unavailable during SSR, so first paint is
    // always the empty set and this reconciles it on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiscovered(stored);
  }, []);

  const record = useCallback((method: string, url: string, status: number) => {
    // A 404 or a network failure means they guessed a route that isn't there.
    // Guessing wrong shouldn't tick the counter.
    if (status === 0 || status === 404) return;

    const entry = match(method, url);
    if (!entry) return;

    const key = keyOf(method, url);
    if (discoveredRef.current.has(key)) return;

    const next = new Set(discoveredRef.current).add(key);
    discoveredRef.current = next;
    writeDiscovered(next);
    setDiscovered(next);

    // Only the unlisted ones are worth interrupting someone for.
    if (entry.secret) setCelebration(entry);
  }, []);

  const dismissCelebration = useCallback(() => setCelebration(null), []);

  const secretsFound = DISCOVERABLE.filter(
    (e) => e.secret && discovered.has(keyOf(e.method, e.url)),
  );

  return {
    discovered,
    count: discovered.size,
    total: TOTAL_DISCOVERABLE,
    secretsFound,
    allFound: discovered.size >= TOTAL_DISCOVERABLE,
    celebration,
    dismissCelebration,
    record,
  };
}
