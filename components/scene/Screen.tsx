// components/scene/Screen.tsx - Monitor screen plane with texture

'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Position3D } from '@/types';

interface ScreenProps {
  texture: THREE.CanvasTexture;
  width: number;
  height: number;
  position?: Position3D;
}

/**
 * Screen plane with dynamic texture
 */
export function Screen({ texture, width, height, position = [0, 0, 0] }: ScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Update material when texture changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        toneMapped={false}
      />
    </mesh>
  );
}
