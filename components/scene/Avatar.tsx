// components/scene/Avatar.tsx - 3D avatar character

'use client';

import { useRef, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { AgentType, AgentStatus, Position3D } from '@/types';
import { DIMENSIONS, AGENT_COLORS } from '@/lib/constants';
import { useAgentAnimation } from '@/hooks/useAgentAnimation';

interface AvatarProps {
  agent: AgentType;
  status: AgentStatus;
  isActive: boolean;
  position?: Position3D;
}

/**
 * 3D Avatar character
 */
export function Avatar({
  agent,
  status,
  isActive,
  position = [0, 0, 0],
}: AvatarProps) {
  const colors = AGENT_COLORS[agent];
  const { headRadius, bodyHeight, bodyRadius } = DIMENSIONS.avatar;
  
  // Get animation values based on status
  const { spring, animationState } = useAgentAnimation(status, isActive);

  return (
    <group position={position}>
      {/* Body */}
      <animated.mesh
        position={spring.position as unknown as Position3D}
        castShadow
      >
        <capsuleGeometry args={[bodyRadius, bodyHeight, 4, 8]} />
        <meshStandardMaterial
          color={colors.primary}
          roughness={0.7}
        />
      </animated.mesh>

      {/* Head */}
      <animated.group
        position={spring.position as unknown as Position3D}
        rotation={spring.rotation as unknown as [number, number, number]}
      >
        <mesh position={[0, bodyHeight / 2 + headRadius + 0.1, 0]} castShadow>
          <sphereGeometry args={[headRadius, 16, 16]} />
          <meshStandardMaterial
            color={colors.secondary}
            roughness={0.5}
          />
        </mesh>

        {/* Eyes */}
        <Eye position={[-0.08, bodyHeight / 2 + headRadius + 0.12, headRadius - 0.05]} status={status} />
        <Eye position={[0.08, bodyHeight / 2 + headRadius + 0.12, headRadius - 0.05]} status={status} />

        {/* Thought bubble for thinking status */}
        {status === 'thinking' && <ThoughtBubble position={[0.3, bodyHeight / 2 + headRadius + 0.4, 0]} />}
      </animated.group>

      {/* Arms */}
      <Arm
        side="left"
        color={colors.secondary}
        bodyHeight={bodyHeight}
        bodyRadius={bodyRadius}
        status={status}
        isActive={isActive}
      />
      <Arm
        side="right"
        color={colors.secondary}
        bodyHeight={bodyHeight}
        bodyRadius={bodyRadius}
        status={status}
        isActive={isActive}
      />
    </group>
  );
}

/**
 * Eye component
 */
function Eye({ position, status }: { position: Position3D; status: AgentStatus }) {
  const getEyeColor = () => {
    switch (status) {
      case 'completed':
        return '#10B981'; // Green
      case 'error':
        return '#EF4444'; // Red
      default:
        return '#1e293b'; // Dark
    }
  };

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color={getEyeColor()} />
    </mesh>
  );
}

/**
 * Thought bubble for thinking status
 */
function ThoughtBubble({ position }: { position: Position3D }) {
  const { scale } = useSpring({
    scale: 1,
    from: { scale: 0 },
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.group position={position} scale={scale as unknown as number}>
      {/* Bubbles */}
      <mesh position={[-0.1, -0.15, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.05, -0.1, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      
      {/* Main bubble */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </animated.group>
  );
}

/**
 * Arm component
 */
interface ArmProps {
  side: 'left' | 'right';
  color: string;
  bodyHeight: number;
  bodyRadius: number;
  status: AgentStatus;
  isActive: boolean;
}

function Arm({ side, color, bodyHeight, bodyRadius, status, isActive }: ArmProps) {
  const xOffset = side === 'left' ? -bodyRadius - 0.05 : bodyRadius + 0.05;
  
  // Arm position based on status
  const getArmRotation = (): [number, number, number] => {
    switch (status) {
      case 'completed':
        return side === 'left' ? [0, 0, Math.PI / 3] : [0, 0, -Math.PI / 3];
      case 'working':
        return [Math.PI / 4, 0, side === 'left' ? 0.2 : -0.2];
      default:
        return [0, 0, 0];
    }
  };

  const [armSpring] = useSpring(() => ({
    rotation: getArmRotation(),
    config: { tension: 200, friction: 20 },
  }), [status]);

  return (
    <animated.group
      position={[xOffset, bodyHeight / 4, 0]}
      rotation={armSpring.rotation as unknown as [number, number, number]}
    >
      {/* Upper arm */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <capsuleGeometry args={[0.04, 0.4, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Forearm */}
      <mesh position={[0, -0.5, 0.1]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <capsuleGeometry args={[0.035, 0.35, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Hand */}
      <mesh position={[0, -0.7, 0.2]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </animated.group>
  );
}
