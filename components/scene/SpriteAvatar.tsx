// components/scene/SpriteAvatar.tsx
// Avatar em billboard com sprites animados 2D

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { AgentStatus, AgentType } from '@/types';
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation';
import { getAgentColor } from '@/lib/utils';

interface SpriteAvatarProps {
  agent: AgentType;
  status: AgentStatus;
  position?: [number, number, number];
  scale?: number;
}

// Gera SVG de sprite dinamicamente se arquivo não existir
function generateSpriteSVG(agent: AgentType, frame: number, status: AgentStatus): string {
  const color = getAgentColor(agent);
  const isTyping = status === 'working';
  const isThinking = status === 'thinking';
  const isCompleted = status === 'completed';
  const isError = status === 'error';
  
  // Animações específicas por frame
  const bounce = isTyping ? Math.sin(frame * 0.5) * 2 : 0;
  const armRotation = isTyping ? Math.sin(frame * 0.8) * 15 : 0;
  const thoughtBubble = isThinking && frame % 3 === 0;
  const starSize = isCompleted ? 20 + Math.sin(frame * 0.3) * 5 : 0;
  const shakeX = isError ? Math.sin(frame * 2) * 3 : 0;
  
  // Ícone do agente
  const icons: Record<AgentType, string> = {
    maestro: '👑',
    organizer: '📋',
    coder: '💻',
    verifier: '✅',
  };
  
  const icon = icons[agent] || '👤';
  
  return `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Glow -->
      <circle cx="64" cy="64" r="60" fill="url(#glow)"/>
      
      ${isCompleted ? `
        <!-- Stars celebration -->
        <text x="20" y="30" font-size="${starSize}">⭐</text>
        <text x="100" y="40" font-size="${starSize * 0.8}">✨</text>
        <text x="30" y="110" font-size="${starSize * 0.7}">✨</text>
        <text x="90" y="100" font-size="${starSize * 0.9}">⭐</text>
      ` : ''}
      
      ${thoughtBubble ? `
        <!-- Thought bubble -->
        <ellipse cx="90" cy="30" rx="20" ry="12" fill="white" stroke="#333" stroke-width="2"/>
        <circle cx="75" cy="50" r="3" fill="white" stroke="#333" stroke-width="1"/>
        <circle cx="70" cy="60" r="2" fill="white" stroke="#333" stroke-width="1"/>
        <text x="82" y="35" font-size="16">💡</text>
      ` : ''}
      
      <!-- Body/Circle -->
      <circle 
        cx="${64 + shakeX}" 
        cy="${64 + bounce}" 
        r="40" 
        fill="${color}20"
        stroke="${color}"
        stroke-width="3"
        filter="url(#shadow)"
      />
      
      <!-- Icon -->
      <text 
        x="${64 + shakeX}" 
        y="${74 + bounce}" 
        font-size="40" 
        text-anchor="middle"
        dominant-baseline="middle"
      >${icon}</text>
      
      ${isTyping ? `
        <!-- Typing arms -->
        <line x1="${40 + shakeX}" y1="${85 + bounce}" x2="${30 + armRotation}" y2="${95}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <line x1="${88 + shakeX}" y1="${85 + bounce}" x2="${98 - armRotation}" y2="${95}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      ` : ''}
      
      ${isError ? `
        <!-- Error X -->
        <text x="64" y="20" font-size="24" text-anchor="middle" fill="#ef4444">❌</text>
      ` : ''}
      
      <!-- Status indicator -->
      <circle cx="100" cy="100" r="8" fill="${getStatusColor(status)}"/>
    </svg>
  `;
}

function getStatusColor(status: AgentStatus): string {
  switch (status) {
    case 'working':
      return '#eab308'; // yellow
    case 'thinking':
      return '#3b82f6'; // blue
    case 'completed':
      return '#22c55e'; // green
    case 'error':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

// Converte SVG string para data URL
function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export function SpriteAvatar({ 
  agent, 
  status, 
  position = [0, 1.2, 0],
  scale = 0.8 
}: SpriteAvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { currentSrc, animation } = useSpriteAnimation(status);
  
  // Gera sprite dinamicamente
  const spriteUrl = useMemo(() => {
    // Extrai frame number do src (ex: typing-2.svg → 2)
    const match = currentSrc.match(/-(\d+)\.svg$/);
    const frame = match ? parseInt(match[1]) - 1 : 0;
    
    const svg = generateSpriteSVG(agent, frame, status);
    return svgToDataUrl(svg);
  }, [agent, status, currentSrc]);
  
  // Carrega textura
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(spriteUrl);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [spriteUrl]);
  
  // Animação suave de flutuação
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  
  // Escala baseada na animação
  const currentScale = animation === 'completed' 
    ? scale * 1.2 
    : animation === 'error' 
      ? scale * (1 + Math.sin(Date.now() * 0.01) * 0.1)
      : scale;
  
  return (
    <Billboard position={position}>
      <Plane
        ref={meshRef}
        args={[1 * currentScale, 1 * currentScale]}
      >
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          side={THREE.DoubleSide}
        />
      </Plane>
    </Billboard>
  );
}
