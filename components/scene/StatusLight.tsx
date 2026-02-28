// components/scene/StatusLight.tsx - LED status indicator

'use client';

import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { AgentStatus, Position3D } from '@/types';

interface StatusLightProps {
  status: AgentStatus;
  color: string;
  position?: Position3D;
}

/**
 * Status LED indicator light
 */
export function StatusLight({
  status,
  color,
  position = [0, 0, 0],
}: StatusLightProps) {
  // Pulse animation for working/error states
  const isPulsing = status === 'working' || status === 'error';
  const pulseSpeed = status === 'error' ? 200 : 800;

  const { intensity, scale } = useSpring({
    intensity: isPulsing ? 2 : 0.5,
    scale: isPulsing ? 1.3 : 1,
    config: { duration: pulseSpeed },
    loop: isPulsing,
  });

  return (
    <group position={position}>
      {/* Light fixture base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Glowing LED */}
      <animated.mesh position={[0, 0.08, 0]} scale={scale as unknown as number}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity as unknown as number}
        />
      </animated.mesh>

      {/* Glow effect (point light) */}
      <animated.pointLight
        color={color}
        intensity={intensity as unknown as number}
        distance={3}
        decay={2}
        position={[0, 0.2, 0]}
      />

      {/* Label */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.4, 0.15]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}
