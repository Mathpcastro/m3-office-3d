// components/ui/LogPanel.tsx - Panel showing recent logs

'use client';

import { useRef, useEffect } from 'react';
import { LogEntry } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { ScrollText } from 'lucide-react';

interface LogPanelProps {
  logs: LogEntry[];
}

/**
 * Panel displaying recent log entries
 */
export function LogPanel({ logs }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-amber-400';
      default:
        return 'text-slate-300';
    }
  };

  const getAgentIcon = (agent: string) => {
    const colors = {
      organizer: 'text-blue-400',
      coder: 'text-emerald-400',
      verifier: 'text-violet-400',
      maestro: 'text-amber-400',
    };
    return colors[agent as keyof typeof colors] || 'text-slate-400';
  };

  return (
    <div className="w-80 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <ScrollText className="w-4 h-4 text-slate-400" />
        <span className="text-slate-200 font-medium text-sm">Logs</span>
        <span className="ml-auto text-slate-500 text-xs">{logs.length} entries</span>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
      >
        {logs.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">
            Nenhum log disponível
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={`${log.timestamp}-${index}`}
              className="flex gap-2 p-2 rounded hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-slate-500 text-xs font-mono whitespace-nowrap">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={`text-xs font-medium uppercase ${getAgentIcon(log.agent)}`}>
                {log.agent.slice(0, 3)}
              </span>
              <span className={`text-xs ${getLevelColor(log.level)} flex-1 truncate`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
