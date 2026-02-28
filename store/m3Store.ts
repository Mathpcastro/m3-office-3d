// store/m3Store.ts - Zustand store for M3 state management

import { create } from 'zustand';
import { M3Store, M3State, LogEntry, AgentType, M3Phase } from '@/types';
import { POLLING_CONFIG } from '@/lib/constants';

const DEFAULT_STATE: M3State = {
  task: 'Aguardando tarefa...',
  status: 'idle',
  currentAgent: null,
  progress: 0,
  attempts: {
    organizer: 0,
    coder: 0,
    verifier: 0,
    maestro: 0,
  },
  logs: [],
  timestamp: Date.now(),
};

// Create the store
export const useM3Store = create<M3Store>((set, get) => ({
  // Initial state
  state: DEFAULT_STATE,
  isLoading: false,
  error: null,

  // Actions
  setState: (newState) => {
    set({ state: newState });
  },

  updateProgress: (progress) => {
    set((state) => ({
      state: {
        ...state.state,
        progress: Math.min(100, Math.max(0, progress)),
        timestamp: Date.now(),
      },
    }));
  },

  setStatus: (status) => {
    set((state) => ({
      state: {
        ...state.state,
        status,
        timestamp: Date.now(),
      },
    }));
  },

  addLog: (entry) => {
    set((state) => ({
      state: {
        ...state.state,
        logs: [...state.state.logs, entry].slice(-100), // Keep last 100 logs
        timestamp: Date.now(),
      },
    }));
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  refresh: async () => {
    const { setState, setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/m3-state.json', {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API data to M3State format
      const newState: M3State = {
        task: data.task || 'Tarefa em andamento',
        status: (data.status || 'idle') as M3Phase,
        currentAgent: data.current_agent as AgentType | null,
        progress: data.progress || 0,
        attempts: data.attempts || {
          organizer: 0,
          coder: 0,
          verifier: 0,
          maestro: 0,
        },
        logs: (data.logs || []).map((log: { time: number; agent: string; message: string; level?: string }) => ({
          timestamp: log.time || Date.now(),
          agent: log.agent as AgentType,
          message: log.message,
          level: (log.level || 'info') as LogEntry['level'],
        })),
        timestamp: Date.now(),
      };
      
      setState(newState);
    } catch (error) {
      console.error('Failed to fetch M3 state:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  },
}));

// Auto-polling setup (optional - can be started from a component)
let pollingInterval: NodeJS.Timeout | null = null;

export function startPolling(interval: number = POLLING_CONFIG.interval) {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  const { refresh } = useM3Store.getState();
  
  // Initial fetch
  refresh();
  
  // Set up interval
  pollingInterval = setInterval(() => {
    refresh();
  }, interval);
  
  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };
}

export function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}
