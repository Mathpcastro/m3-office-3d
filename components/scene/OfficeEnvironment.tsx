// components/scene/OfficeEnvironment.tsx - 3D environment (floor, walls, grid)

'use client';

import { Grid, Plane } from '@react-three/drei';
import { SCENE_CONFIG } from '@/lib/constants';
import * as THREE from 'three';

/**
 * Office Environment - Floor, walls, and grid
 */
export function OfficeEnvironment() {
  return (
    <group>
      {/* Floor */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.2}
        />
      </Plane>

      {/* Grid Helper for visual reference */}
      <Grid
        position={[0, 0.01, 0]}
        args={[SCENE_CONFIG.grid.size, SCENE_CONFIG.grid.divisions]}
        cellColor={SCENE_CONFIG.grid.colorGrid}
        sectionColor={SCENE_CONFIG.grid.colorCenter}
        cellThickness={0.5}
        sectionThickness={1}
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Back Wall */}
      <Plane
        args={[20, 8]}
        position={[0, 4, -5]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#16213e"
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>

      {/* Side Wall Left */}
      <Plane
        args={[20, 8]}
        position={[-10, 4, 5]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#16213e"
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>

      {/* Decorative elements */}
      <DecorativeElements />
    </group>
  );
}

/**
 * Decorative elements for the office
 */
function DecorativeElements() {
  return (
    <group>
      {/* Baseboard */}
      <mesh position={[0, 0.1, -4.9]} receiveShadow>
        <boxGeometry args={[20, 0.2, 0.1]} />
        <meshStandardMaterial color="#0f3460" />
      </mesh>

      {/* Ceiling light glow (visual only) */}
      <mesh position={[0, 7.9, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ambient glow on floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}
