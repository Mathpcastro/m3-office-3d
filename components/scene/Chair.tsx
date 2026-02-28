// components/scene/Chair.tsx - Office chair

'use client';

import { DIMENSIONS } from '@/lib/constants';
import { Position3D } from '@/types';

interface ChairProps {
  color?: string;
  position?: Position3D;
  rotation?: [number, number, number];
}

/**
 * Simple office chair
 */
export function Chair({
  color = '#1E40AF',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ChairProps) {
  const { seatWidth, seatDepth, seatHeight, backHeight, legHeight } = DIMENSIONS.chair;
  const chairColor = color;
  const baseColor = '#334155';

  return (
    <group position={position} rotation={rotation}>
      {/* Chair base (legs) */}
      <group position={[0, legHeight / 2, 0]}>
        {/* Central column */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, legHeight, 16]} />
          <meshStandardMaterial color={baseColor} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Wheel base (star shape) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.25, -legHeight / 2 + 0.05, 0]} castShadow>
                <boxGeometry args={[0.5, 0.05, 0.05]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              {/* Wheel */}
              <mesh position={[0.5, -legHeight / 2, 0]} castShadow>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Seat */}
      <mesh position={[0, legHeight + seatHeight / 2, 0]} castShadow>
        <boxGeometry args={[seatWidth, seatHeight, seatDepth]} />
        <meshStandardMaterial color={chairColor} roughness={0.7} />
      </mesh>

      {/* Backrest */}
      <mesh
        position={[0, legHeight + seatHeight + backHeight / 2 - 0.1, -seatDepth / 2 + 0.05]}
        castShadow
      >
        <boxGeometry args={[seatWidth, backHeight, 0.1]} />
        <meshStandardMaterial color={chairColor} roughness={0.7} />
      </mesh>

      {/* Armrests */}
      <mesh
        position={[-seatWidth / 2 - 0.05, legHeight + seatHeight + 0.3, 0]}
        castShadow
      >
        <boxGeometry args={[0.05, 0.05, seatDepth * 0.7]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      
      <mesh
        position={[seatWidth / 2 + 0.05, legHeight + seatHeight + 0.3, 0]}
        castShadow
      >
        <boxGeometry args={[0.05, 0.05, seatDepth * 0.7]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Vertical armrest supports */}
      <mesh
        position={[-seatWidth / 2 - 0.05, legHeight + seatHeight + 0.15, seatDepth * 0.3]}
        castShadow
      >
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      
      <mesh
        position={[seatWidth / 2 + 0.05, legHeight + seatHeight + 0.15, seatDepth * 0.3]}
        castShadow
      >
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
    </group>
  );
}
