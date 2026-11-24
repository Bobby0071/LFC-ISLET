import { useEffect, useState } from "react";
import { getSystemStats, type SystemStats } from "./api";

/** How often the panel samples; CPU and network rates need a steady beat. */
const POLL_MS = 1000;

/**
 * Live CPU/memory/network readings, polled while `active`.
 *
 * Sampling stays on the backend to keep one source of truth, so polling stops
 * entirely when the panel is closed or the window is hidden: an island that is
 * never opened must not wake up once a second.
 */
export function useSystemStats(active: boolean) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async () => {
      try {
        const next = await getSystemStats();
        if (cancelled) return;
        setStats(next);
        setFailed(false);
      } catch {
        // A single failed reading is not worth tearing the panel down; the next
        // beat usually succeeds, and the panel shows placeholders meanwhile.
        if (!cancelled) setFailed(true);
      }
      // Schedule after the previous reading finished, so a slow call cannot pile
      // up a backlog of pending invokes.
      if (!cancelled) timer = setTimeout(tick, POLL_MS);
    };

    void tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [active]);

  return { stats, failed };
}
