// components/ui/Legend.tsx - Color and status legend

'use client';

import { Info } from 'lucide-react';

/**
 * Legend explaining colors and status meanings
 */
export function Legend() {
  const agentColors = [
    { name: 'Organizer', color: '#3B82F6', description: 'Planejamento' },
    { name: 'Coder', color: '#10B981', description: 'Implementação' },
    { name: 'Verifier', color: '#8B5CF6', description: 'Verificação' },
    { name: 'Maestro', color: '#F59E0B', description: 'Supervisão' },
  ];

  const statusColors = [
    { name: 'Inativo', color: '#6B7280' },
    { name: 'Trabalhando', color: '#FBBF24' },
    { name: 'Pensando', color: '#F59E0B' },
    { name: 'Concluído', color: '#10B981' },
    { name: 'Erro', color: '#EF4444' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700 p-4 w-64">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-slate-400" />
        <span className="text-slate-200 font-medium text-sm">Legenda</span>
      </div>

      <div className="space-y-3">
        {/* Agent colors */}
        <div>
          <p className="text-slate-500 text-xs mb-2">Agentes</p>
          <div className="space-y-1">
            {agentColors.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
                <span className="text-slate-300 text-xs">{agent.name}</span>
                <span className="text-slate-500 text-xs ml-auto">
                  {agent.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-2">
          <p className="text-slate-500 text-xs mb-2">Status</p>
          <div className="grid grid-cols-2 gap-1">
            {statusColors.map((status) => (
              <div key={status.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-slate-400 text-xs">{status.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
