// components/ui/StatusBar.tsx - Top status bar

'use client';

import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { M3Phase } from '@/types';
import { PHASE_DISPLAY_NAMES } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';

interface StatusBarProps {
  task: string;
  phase: M3Phase;
  progress: number;
  elapsedTime: number;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Top status bar showing overall M3 status
 */
export function StatusBar({
  task,
  phase,
  progress,
  elapsedTime,
  isLoading,
  error,
}: StatusBarProps) {
  const getPhaseColor = (phase: M3Phase) => {
    switch (phase) {
      case 'completed':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      case 'idle':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left - Task info */}
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full animate-pulse ${getPhaseColor(phase)}`} />
          
          <div>
            <h1 className="text-white font-semibold text-lg">
              {task || 'Aguardando tarefa...'}
            </h1>            
            <p className="text-slate-400 text-sm">
              {PHASE_DISPLAY_NAMES[phase] || phase}
            </p>
          </div>
        </div>

        {/* Center - Progress */}
        <div className="flex items-center gap-4">
          <div className="w-48">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>            
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right - Status indicators */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-slate-400 text-xs">Tempo decorrido</p>            
            <p className="text-white font-mono">{formatDuration(elapsedTime)}</p>
          </div>

          {isLoading && (
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          )}

          {error && (
            <div title={error} className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          )}

          {phase === 'completed' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>
      </div>
    </div>
  );
}
