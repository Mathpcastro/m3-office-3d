// components/scene/Computer.tsx - Computer with monitor and dynamic screen

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DIMENSIONS } from '@/lib/constants';
import { AgentType, AgentStatus, Position3D } from '@/types';
import { useScreenTexture } from '@/hooks/useScreenTexture';
import { Screen } from './Screen';

interface ComputerProps {
  agent: AgentType;
  status: AgentStatus;
  progress: number;
  task: string;
  position?: Position3D;
}

/**
 * Computer with monitor showing dynamic content
 */
export function Computer({
  agent,
  status,
  progress,
  task,
  position = [0, 0, 0],
}: ComputerProps) {
  const { monitor, pc } = DIMENSIONS.computer;
  const screenTexture = useScreenTexture(agent, {
    title: task,
    status,
    progress,
    lines: generateTerminalLines(status, agent),
  });

  // Update texture when props change
  useEffect(() => {
    screenTexture.updateContent({
      title: task,
      status,
      progress,
      lines: generateTerminalLines(status, agent),
    });
  }, [agent, status, progress, task, screenTexture]);

  return (
    <group position={position}>
      {/* Monitor Stand */}
      <mesh position={[0, -monitor.standHeight / 2, -monitor.depth / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, monitor.standHeight, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Monitor Base */}
      <mesh position={[0, -monitor.standHeight, -monitor.depth / 2]} castShadow>
        <boxGeometry args={[0.4, 0.05, 0.3]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Monitor Screen Bezel */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[monitor.width + 0.05, monitor.height + 0.05, monitor.depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Screen with dynamic texture */}
      <Screen
        texture={screenTexture.texture}
        width={monitor.width}
        height={monitor.height}
        position={[0, 0, monitor.depth / 2 + 0.001]}
      />

      {/* PC Tower (under desk) */}
      <mesh
        position={[-1, -monitor.standHeight - pc.height / 2, -0.2]}
        castShadow
      >
        <boxGeometry args={[pc.width, pc.height, pc.depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* PC Power LED */}
      <mesh position={[-1 + pc.width / 2 + 0.001, -monitor.standHeight - pc.height / 2 + 0.2, -0.2 + pc.depth / 2 - 0.05]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, -monitor.standHeight - 0.02, 0.4]} castShadow>
        <boxGeometry args={[1, 0.03, 0.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.7, -monitor.standHeight, 0.5]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

/**
 * Generate terminal-like lines based on status
 */
function generateTerminalLines(status: AgentStatus, agent: AgentType): string[] {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  const agentPrefix = `[${agent.toUpperCase()}]`;
  
  switch (status) {
    case 'working':
      return [
        `${timestamp} ${agentPrefix} Analisando...`,
        `${timestamp} ${agentPrefix} Processando dados...`,
        `> ${agent} execute --verbose`,
        `  ✓ Inicializado`,
        `  ⏳ Executando...`,
        `  ○ Aguardando...`,
      ];
    case 'thinking':
      return [
        `${timestamp} ${agentPrefix} Analisando opções...`,
        `? ${agent} ponderar estratégia`,
        `  → Avaliando abordagem A...`,
        `  → Avaliando abordagem B...`,
        `  ...`,
      ];
    case 'completed':
      return [
        `${timestamp} ${agentPrefix} Tarefa concluída!`,
        `> ${agent} finalize`,
        `  ✓ Verificação completa`,
        `  ✓ Artefatos gerados`,
        `  ✓ Sucesso!`,
      ];
    case 'error':
      return [
        `${timestamp} ${agentPrefix} ERRO detectado!`,
        `> ${agent} debug`,
        `  ✗ Falha na linha 42`,
        `  ! Verificando logs...`,
        `  ? Tentar novamente?`,
      ];
    case 'idle':
    default:
      return [
        `${timestamp} ${agentPrefix} Pronto`,
        `> _`,
        `  Aguardando instruções...`,
      ];
  }
}
