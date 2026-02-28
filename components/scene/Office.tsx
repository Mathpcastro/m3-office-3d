// components/scene/Office.tsx - Main 3D scene component

'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';
import { SCENE_CONFIG } from '@/lib/constants';
import { OfficeEnvironment } from './OfficeEnvironment';
import { Workstation } from './Workstation';
import { WORKSTATION_CONFIGS } from '@/lib/constants';
import { useM3State } from '@/hooks/useM3State';

/**
 * Loading fallback for suspense
 */
function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#3B82F6" wireframe />
    </mesh>
  );
}

/**
 * Main Office 3D Scene
 */
export function Office() {
  const { state } = useM3State();

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows={SCENE_CONFIG.shadows.enabled}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Responsive pixel ratio
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={SCENE_CONFIG.camera.position}
          fov={SCENE_CONFIG.camera.fov}
          near={SCENE_CONFIG.camera.near}
          far={SCENE_CONFIG.camera.far}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below floor
          target={[0, 0, 0]}
        />

        {/* Lighting */}
        <ambientLight
          intensity={SCENE_CONFIG.lighting.ambient.intensity}
          color={SCENE_CONFIG.lighting.ambient.color}
        />
        
        <directionalLight
          position={SCENE_CONFIG.lighting.directional.position}
          intensity={SCENE_CONFIG.lighting.directional.intensity}
          color={SCENE_CONFIG.lighting.directional.color}
          castShadow={SCENE_CONFIG.lighting.directional.castShadow}
          shadow-mapSize-width={SCENE_CONFIG.shadows.mapSize}
          shadow-mapSize-height={SCENE_CONFIG.shadows.mapSize}
          shadow-bias={SCENE_CONFIG.shadows.bias}
        />

        {/* Point lights for ambiance */}
        {SCENE_CONFIG.lighting.pointLights.map((light, index) => (
          <pointLight
            key={index}
            position={light.position}
            color={light.color}
            intensity={light.intensity}
            distance={10}
            decay={2}
          />
        ))}

        {/* Scene Content */}
        <Suspense fallback={<SceneLoader />}>
          {/* Environment */}
          <OfficeEnvironment />

          {/* Workstations */}
          {WORKSTATION_CONFIGS.map((config) => (
            <Workstation
              key={config.agent}
              config={config}
              isActive={state.currentAgent === config.agent}
              status={getAgentStatus(config.agent, state.status)}
              progress={state.progress}
              task={state.task}
            />
          ))}
        </Suspense>

        {/* Stats (dev only) */}
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>
    </div>
  );
}

/**
 * Determine agent status based on current phase
 */
function getAgentStatus(
  agent: string,
  phase: string
): 'idle' | 'working' | 'thinking' | 'completed' | 'error' {
  switch (phase) {
    case 'organizing':
      return agent === 'organizer' ? 'working' : 'idle';
    case 'coding':
      return agent === 'coder' ? 'working' : 'idle';
    case 'verifying':
      return agent === 'verifier' ? 'working' : 'idle';
    case 'maestro':
      return agent === 'maestro' ? 'working' : 'idle';
    case 'completed':
      return 'completed';
    case 'error':
      return 'error';
    default:
      return 'idle';
  }
}
