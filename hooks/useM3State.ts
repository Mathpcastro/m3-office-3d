// hooks/useM3State.ts - Hook for accessing M3 state

import { useEffect, useCallback } from 'react';
import { useM3Store, startPolling, stopPolling } from '@/store/m3Store';
import { M3State } from '@/types';

interface UseM3StateReturn {
  state: M3State;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to access M3 state with auto-polling
 * @param autoPoll - Whether to start auto-polling
 * @param interval - Polling interval in ms
 */
export function useM3State(autoPoll = true, interval: number = 1000): UseM3StateReturn {
  const { state, isLoading, error, refresh } = useM3Store();

  useEffect(() => {
    if (autoPoll) {
      const cleanup = startPolling(interval);
      return cleanup;
    }
  }, [autoPoll, interval]);

  return {
    state,
    isLoading,
    error,
    refresh,
  };
}

/**
 * Hook to get current active agent
 */
export function useCurrentAgent() {
  const { state } = useM3Store();
  return state.currentAgent;
}

/**
 * Hook to get current phase/status
 */
export function useCurrentPhase() {
  const { state } = useM3Store();
  return state.status;
}

/**
 * Hook to get current progress
 */
export function useProgress() {
  const { state } = useM3Store();
  return state.progress;
}

/**
 * Hook to get logs
 */
export function useLogs(limit?: number) {
  const { state } = useM3Store();
  const logs = state.logs;
  
  if (limit) {
    return logs.slice(-limit);
  }
  
  return logs;
}

/**
 * Hook to manually trigger refresh
 */
export function useRefresh() {
  const { refresh } = useM3Store();
  return useCallback(() => refresh(), [refresh]);
}
