// hooks/useAgentAnimation.ts - Hook for agent animations

import { useMemo } from 'react';
import { useSpring, config, SpringValue } from '@react-spring/three';
import { AgentStatus, AnimationState, Position3D } from '@/types';
import { ANIMATION_CONFIG } from '@/lib/constants';

export interface AgentAnimationSpring {
  position: SpringValue<Position3D>;
  rotation: SpringValue<[number, number, number]>;
  scale: SpringValue<number>;
}

/**
 * Map agent status to animation state
 */
function statusToAnimation(status: AgentStatus): AnimationState {
  switch (status) {
    case 'working':
      return 'typing';
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
}

/**
 * Hook to manage agent animations based on status
 */
export function useAgentAnimation(
  status: AgentStatus,
  isActive: boolean
) {
  const animationState = useMemo(() => {
    return statusToAnimation(status);
  }, [status]);

  // Idle animation (breathing)
  const [idleSpring] = useSpring(() => ({
    position: [0, 0, 0] as Position3D,
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1,
    config: { duration: ANIMATION_CONFIG.idle.duration },
  }), [animationState]);

  // Typing animation
  const [typingSpring] = useSpring(() => ({
    position: isActive 
      ? [0, Math.sin(Date.now() * 0.01) * ANIMATION_CONFIG.typing.amplitude, 0] as Position3D
      : [0, 0, 0] as Position3D,
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1,
    config: { duration: ANIMATION_CONFIG.typing.duration },
  }), [isActive, animationState]);

  // Thinking animation
  const [thinkingSpring] = useSpring(() => ({
    position: [0, 0, 0] as Position3D,
    rotation: isActive && animationState === 'thinking'
      ? [0, 0, ANIMATION_CONFIG.thinking.rotationAngle] as [number, number, number]
      : [0, 0, 0] as [number, number, number],
    scale: 1,
    config: { ...config.gentle, duration: ANIMATION_CONFIG.thinking.duration },
  }), [isActive, animationState]);

  // Completed animation (celebration)
  const [completedSpring] = useSpring(() => ({
    position: animationState === 'completed'
      ? [0, ANIMATION_CONFIG.completed.jumpHeight, 0] as Position3D
      : [0, 0, 0] as Position3D,
    rotation: [0, 0, 0] as [number, number, number],
    scale: animationState === 'completed' ? 1.1 : 1,
    config: { ...config.wobbly, duration: ANIMATION_CONFIG.completed.duration },
  }), [animationState]);

  // Error animation (shake)
  const [errorSpring] = useSpring(() => ({
    position: animationState === 'error'
      ? [Math.sin(Date.now() * 0.05) * ANIMATION_CONFIG.error.shakeIntensity, 0, 0] as Position3D
      : [0, 0, 0] as Position3D,
    rotation: animationState === 'error'
      ? [0.1, 0, 0] as [number, number, number]
      : [0, 0, 0] as [number, number, number],
    scale: 1,
    config: { duration: ANIMATION_CONFIG.error.duration },
  }), [animationState]);

  // Return appropriate spring based on state
  const getSpring = (): AgentAnimationSpring => {
    switch (animationState) {
      case 'typing':
        return typingSpring as unknown as AgentAnimationSpring;
      case 'thinking':
        return thinkingSpring as unknown as AgentAnimationSpring;
      case 'completed':
        return completedSpring as unknown as AgentAnimationSpring;
      case 'error':
        return errorSpring as unknown as AgentAnimationSpring;
      case 'idle':
      default:
        return idleSpring as unknown as AgentAnimationSpring;
    }
  };

  return {
    animationState,
    spring: getSpring(),
    isAnimating: animationState !== 'idle',
  };
}

/**
 * Hook for screen glow animation
 */
export function useScreenGlow(isActive: boolean, color: string) {
  return useSpring({
    intensity: isActive ? 1.5 : 0.5,
    config: { duration: 500 },
  });
}

/**
 * Hook for status light pulse
 */
export function useStatusPulse(status: AgentStatus) {
  const isPulsing = status === 'working' || status === 'error';
  const speed = status === 'error' ? 200 : 1000;

  return useSpring({
    opacity: isPulsing ? 1 : 0.5,
    scale: isPulsing ? 1.2 : 1,
    config: { duration: speed },
    loop: isPulsing,
  });
}
