// components/scene/Workstation.tsx - Complete workstation with desk, chair, PC, and agent

'use client';

import { Group } from 'three';
import { AgentType, AgentStatus } from '@/types';
import { WorkstationConfig } from '@/types';
import { Desk } from './Desk';
import { Chair } from './Chair';
import { Computer } from './Computer';
import { Avatar } from './Avatar';
import { SpriteAvatar } from './SpriteAvatar';
import { StatusLight } from './StatusLight';

interface WorkstationProps {
  config: WorkstationConfig;
  isActive: boolean;
  status: AgentStatus;
  progress: number;
  task: string;
  useSprite?: boolean; // Nova prop para usar sprites 2D
}

/**
 * Complete Workstation Component
 * Combines desk, chair, computer, and agent
 */
export function Workstation({
  config,
  isActive,
  status,
  progress,
  task,
  useSprite = true, // Default: usar sprites
}: WorkstationProps) {
  const { agent, position, rotation, deskColor, chairColor } = config;

  return (
    <group position={position} rotation={rotation}>
      {/* Desk */}
      <Desk color={deskColor} />

      {/* Chair - positioned behind desk */}
      <Chair
        color={chairColor}
        position={[0, 0, 1.2]}
        rotation={[-Math.PI / 8, 0, 0]}
      />

      {/* Computer on desk */}
      <Computer
        agent={agent}
        status={status}
        progress={progress}
        task={task}
        position={[0, 0.8, -0.3]}
      />

      {/* Avatar - sprite 2D ou 3D baseado na prop */}
      {useSprite ? (
        <SpriteAvatar
          agent={agent}
          status={status}
          position={[0, 1.0, 1.2]}
          scale={0.8}
        />
      ) : (
        <Avatar
          agent={agent}
          status={status}
          isActive={isActive}
          position={[0, 0.5, 1.2]}
        />
      )}

      {/* Status indicator light */}
      <StatusLight
        status={status}
        color={getStatusColor(status)}
        position={[1.2, 1.5, 0]}
      />
    </group>
  );
}

/**
 * Get color based on status
 */
function getStatusColor(status: AgentStatus): string {
  switch (status) {
    case 'working':
      return '#FBBF24'; // Amber
    case 'thinking':
      return '#F59E0B'; // Amber darker
    case 'completed':
      return '#10B981'; // Emerald
    case 'error':
      return '#EF4444'; // Red
    case 'idle':
    default:
      return '#6B7280'; // Gray
  }
}
