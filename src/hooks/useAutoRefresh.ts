import { useEffect, useRef } from 'react';

interface AutoRefreshOptions {
  enabled: boolean;
  intervalMs: number;
  refresh: () => void | Promise<void>;
}

/**
 * Synchronizes the workspace with a timer only while auto refresh is enabled.
 * The latest refresh callback is kept in a ref so changing render closures does
 * not tear down and recreate the timer unnecessarily.
 */
export function useAutoRefresh({ enabled, intervalMs, refresh }: AutoRefreshOptions) {
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timer = window.setInterval(() => {
      void refreshRef.current();
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs]);
}
