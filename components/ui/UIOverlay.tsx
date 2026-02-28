// components/ui/UIOverlay.tsx - Main UI overlay container

'use client';

import { useM3State, useLogs } from '@/hooks/useM3State';
import { StatusBar } from './StatusBar';
import { AgentCard } from './AgentCard';
import { Controls } from './Controls';
import { Legend } from './Legend';
import { LogPanel } from './LogPanel';
import { WORKSTATION_CONFIGS, AGENT_INFO } from '@/lib/constants';
import { getAgentStatus } from '@/lib/utils';

/**
 * Main UI Overlay component
 * Renders all UI elements on top of the 3D scene
 */
export function UIOverlay() {
  const { state, isLoading, error, refresh } = useM3State();
  const logs = useLogs(20);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col">
      {/* Top Status Bar */}
      <div className="pointer-events-auto">
        <StatusBar
          task={state.task}
          phase={state.status}
          progress={state.progress}
          elapsedTime={Date.now() - state.timestamp}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex justify-between p-4">
        {/* Left side - Agent Cards */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {WORKSTATION_CONFIGS.map((config) => {
            const agentStatus = getAgentStatus(config.agent, state.status);
            const isActive = state.currentAgent === config.agent;
            
            return (
              <AgentCard
                key={config.agent}
                agent={{
                  type: config.agent,
                  name: AGENT_INFO[config.agent].name,
                  description: AGENT_INFO[config.agent].description,
                  color: {
                    primary: config.deskColor,
                    secondary: config.chairColor,
                    glow: config.deskColor,
                  },
                }}
                state={{
                  type: config.agent,
                  status: agentStatus,
                  currentTask: isActive ? state.task : null,
                  progress: isActive ? state.progress : 0,
                  attemptCount: state.attempts[config.agent],
                  lastUpdate: state.timestamp,
                }}
                isActive={isActive}
              />
            );
          })}
        </div>

        {/* Right side - Logs and Controls */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <LogPanel logs={logs} />
          <Controls onRefresh={refresh} />
          <Legend />
        </div>
      </div>
    </div>
  );
}
