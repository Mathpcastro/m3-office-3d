// hooks/useSpriteAnimation.ts
// Sistema de animação de sprites 2D para avatares em 3D

import { useState, useEffect, useCallback } from 'react';
import { AgentStatus } from '@/types';

export type SpriteAnimation = 'idle' | 'working' | 'thinking' | 'completed' | 'error';

interface SpriteFrame {
  src: string;
  duration: number;
}

interface SpriteAnimationConfig {
  frames: SpriteFrame[];
  loop: boolean;
}

// Configurações de animação para cada estado
const ANIMATION_CONFIGS: Record<SpriteAnimation, SpriteAnimationConfig> = {
  idle: {
    frames: [
      { src: '/sprites/idle-1.svg', duration: 1000 },
      { src: '/sprites/idle-2.svg', duration: 1000 },
    ],
    loop: true,
  },
  working: {
    frames: [
      { src: '/sprites/typing-1.svg', duration: 150 },
      { src: '/sprites/typing-2.svg', duration: 150 },
      { src: '/sprites/typing-3.svg', duration: 150 },
      { src: '/sprites/typing-4.svg', duration: 150 },
    ],
    loop: true,
  },
  thinking: {
    frames: [
      { src: '/sprites/thinking-1.svg', duration: 800 },
      { src: '/sprites/thinking-2.svg', duration: 800 },
      { src: '/sprites/thinking-3.svg', duration: 800 },
    ],
    loop: true,
  },
  completed: {
    frames: [
      { src: '/sprites/completed-1.svg', duration: 200 },
      { src: '/sprites/completed-2.svg', duration: 200 },
      { src: '/sprites/completed-3.svg', duration: 200 },
      { src: '/sprites/completed-4.svg', duration: 2000 },
    ],
    loop: false,
  },
  error: {
    frames: [
      { src: '/sprites/error-1.svg', duration: 300 },
      { src: '/sprites/error-2.svg', duration: 300 },
    ],
    loop: true,
  },
};

// Mapeia AgentStatus para SpriteAnimation
const statusToAnimation = (status: AgentStatus): SpriteAnimation => {
  switch (status) {
    case 'working':
      return 'working';
    case 'thinking':
      return 'thinking';
    case 'completed':
      return 'completed';
    case 'error':
      return 'error';
    case 'idle':
    default:
      return 'idle';
  }
};

export function useSpriteAnimation(
  status: AgentStatus,
  frameRate: number = 12
) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animation, setAnimation] = useState<SpriteAnimation>('idle');

  // Atualiza animação baseada no status
  useEffect(() => {
    const newAnimation = statusToAnimation(status);
    setAnimation(newAnimation);
    setCurrentFrame(0); // Reseta para primeiro frame
  }, [status]);

  // Loop de animação
  useEffect(() => {
    const config = ANIMATION_CONFIGS[animation];
    if (!config || config.frames.length === 0) return;

    let frameIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const nextFrame = () => {
      const frame = config.frames[frameIndex];
      
      timeoutId = setTimeout(() => {
        frameIndex++;
        
        // Se chegou no fim
        if (frameIndex >= config.frames.length) {
          if (config.loop) {
            frameIndex = 0; // Volta ao início
          } else {
            frameIndex = config.frames.length - 1; // Fica no último frame
          }
        }
        
        setCurrentFrame(frameIndex);
        nextFrame();
      }, frame.duration);
    };

    nextFrame();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [animation]);

  // Retorna o src do frame atual
  const currentSrc = ANIMATION_CONFIGS[animation]?.frames[currentFrame]?.src || '/sprites/idle-1.svg';

  return {
    currentFrame,
    currentSrc,
    animation,
    totalFrames: ANIMATION_CONFIGS[animation]?.frames.length || 1,
  };
}

// Hook para pré-carregar sprites
export function usePreloadSprites() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const allSprites = Object.values(ANIMATION_CONFIGS)
      .flatMap(config => config.frames.map(f => f.src));
    
    const uniqueSprites = Array.from(new Set(allSprites));
    let loadedCount = 0;

    uniqueSprites.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === uniqueSprites.length) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++; // Continua mesmo se falhar
        if (loadedCount === uniqueSprites.length) {
          setLoaded(true);
        }
      };
      img.src = src;
    });
  }, []);

  return loaded;
}
