// components/ui/AgentCard.tsx - Card showing agent status

'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Code2, CheckCircle, Loader2, Crown } from 'lucide-react';
import { AgentInfo, AgentState } from '@/types';
import { STATUS_DISPLAY_NAMES } from '@/lib/constants';

interface AgentCardProps {
  agent: AgentInfo;
  state: AgentState;
  isActive: boolean;
}

/**
 * Card displaying agent information and status
 */
export function AgentCard({ agent, state, isActive }: AgentCardProps) {
  const icons = {
    organizer: LayoutGrid,
    coder: Code2,
    verifier: CheckCircle,
    maestro: Crown,
  };

  const Icon = icons[state.type];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'thinking':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'completed':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-72 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
        isActive
          ? 'bg-slate-800/90 border-' + agent.color.primary.replace('#', '')
          : 'bg-slate-900/80 border-slate-700'
      }`}
      style={{
        borderColor: isActive ? agent.color.primary : undefined,
        boxShadow: isActive ? `0 0 20px ${agent.color.primary}30` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${agent.color.primary}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: agent.color.primary }} />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-medium">{agent.name}</h3>
          <p className="text-slate-400 text-xs">{agent.description}</p>
        </div>

        {isActive && (
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: agent.color.primary }} />
        )}
      </div>

      {/* Status */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Status</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
              state.status
            )}`}
          >
            {STATUS_DISPLAY_NAMES[state.status] || state.status}
          </span>
        </div>

        {isActive && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Progresso</span>
              <span className="text-white font-mono text-sm">{Math.round(state.progress)}%</span>
            </div>

            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${state.progress}%`,
                  backgroundColor: agent.color.primary,
                }}
              />
            </div>

            {state.currentTask && (
              <p className="text-slate-300 text-xs truncate">{state.currentTask}</p>
            )}
          </>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <span className="text-slate-400 text-xs">Tentativas</span>
          <span className="text-slate-300 font-mono text-sm">{state.attemptCount}</span>
        </div>
      </div>
    </motion.div>
  );
}
