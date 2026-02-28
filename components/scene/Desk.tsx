// components/scene/Desk.tsx - Office desk with simple geometry

'use client';

import { DIMENSIONS } from '@/lib/constants';
import * as THREE from 'three';

interface DeskProps {
  color?: string;
}

/**
 * Simple office desk using basic geometries
 */
export function Desk({ color = '#3B82F6' }: DeskProps) {
  const { width, height, depth, legThickness } = DIMENSIONS.desk;
  
  const material = (
    <meshStandardMaterial
      color={color}
      roughness={0.6}
      metalness={0.3}
    />
  );

  return (
    <group>
      {/* Desktop */}
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        {material}
      </mesh>

      {/* Front Left Leg */}
      <mesh
        position={[-width / 2 + legThickness, height / 2, depth / 2 - legThickness]}
        castShadow
      >
        <boxGeometry args={[legThickness, height, legThickness]} />
        {material}
      </mesh>

      {/* Front Right Leg */}
      <mesh
        position={[width / 2 - legThickness, height / 2, depth / 2 - legThickness]}
        castShadow
      >
        <boxGeometry args={[legThickness, height, legThickness]} />
        {material}
      </mesh>

      {/* Back Left Leg */}
      <mesh
        position={[-width / 2 + legThickness, height / 2, -depth / 2 + legThickness]}
        castShadow
      >
        <boxGeometry args={[legThickness, height, legThickness]} />
        {material}
      </mesh>

      {/* Back Right Leg */}
      <mesh
        position={[width / 2 - legThickness, height / 2, -depth / 2 + legThickness]}
        castShadow
      >
        <boxGeometry args={[legThickness, height, legThickness]} />
        {material}
      </mesh>

      {/* Drawer unit on left side */}
      <mesh
        position={[-width / 2 + 0.4, height / 2 + 0.2, 0]}
        castShadow
      >
        <boxGeometry args={[0.6, height * 0.8, depth - 0.2]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Drawer handles */}
      <mesh position={[-width / 2 + 0.4, height - 0.15, depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[-width / 2 + 0.4, height - 0.35, depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
