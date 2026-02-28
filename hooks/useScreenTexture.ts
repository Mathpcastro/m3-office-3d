// hooks/useScreenTexture.ts - Hook for dynamic screen textures

import { useRef, useCallback, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { SCREEN_CONFIG } from '@/lib/constants';
import { AgentType, AgentStatus, ScreenContent } from '@/types';
import { getStatusColor, getAgentColor } from '@/lib/utils';

interface UseScreenTextureReturn {
  texture: THREE.CanvasTexture;
  updateContent: (content: ScreenContent) => void;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

/**
 * Create a canvas for screen texture
 */
function createCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_CONFIG.resolution.width;
  canvas.height = SCREEN_CONFIG.resolution.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  
  return { canvas, ctx };
}

/**
 * Draw screen background
 */
function drawBackground(ctx: CanvasRenderingContext2D, status: AgentStatus) {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_CONFIG.resolution.height);
  gradient.addColorStop(0, '#0F172A');
  gradient.addColorStop(1, '#1E293B');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_CONFIG.resolution.width, SCREEN_CONFIG.resolution.height);
  
  // Border glow based on status
  const statusColor = getStatusColor(status);
  ctx.strokeStyle = statusColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, SCREEN_CONFIG.resolution.width - 4, SCREEN_CONFIG.resolution.height - 4);
}

/**
 * Draw agent header
 */
function drawHeader(ctx: CanvasRenderingContext2D, agent: AgentType, status: AgentStatus) {
  const agentColor = getAgentColor(agent);
  
  // Agent name
  ctx.font = `bold ${SCREEN_CONFIG.fontSize.title}px monospace`;
  ctx.fillStyle = agentColor.primary;
  ctx.textAlign = 'left';
  ctx.fillText(agent.toUpperCase(), 20, 40);
  
  // Status indicator
  const statusColor = getStatusColor(status);
  ctx.fillStyle = statusColor;
  ctx.beginPath();
  ctx.arc(SCREEN_CONFIG.resolution.width - 40, 30, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Status text
  ctx.font = `${SCREEN_CONFIG.fontSize.subtitle}px monospace`;
  ctx.fillStyle = SCREEN_CONFIG.colors.text;
  ctx.textAlign = 'right';
  ctx.fillText(status.toUpperCase(), SCREEN_CONFIG.resolution.width - 60, 35);
}

/**
 * Draw progress bar
 */
function drawProgress(
  ctx: CanvasRenderingContext2D,
  progress: number,
  y: number
) {
  const barWidth = SCREEN_CONFIG.resolution.width - 40;
  const barHeight = 20;
  const x = 20;
  
  // Background
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y, barWidth, barHeight);
  
  // Progress
  const progressWidth = (progress / 100) * barWidth;
  const gradient = ctx.createLinearGradient(x, y, x + progressWidth, y);
  gradient.addColorStop(0, SCREEN_CONFIG.colors.accent);
  gradient.addColorStop(1, SCREEN_CONFIG.colors.success);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, progressWidth, barHeight);
  
  // Text
  ctx.font = `bold ${SCREEN_CONFIG.fontSize.body}px monospace`;
  ctx.fillStyle = SCREEN_CONFIG.colors.text;
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(progress)}%`, SCREEN_CONFIG.resolution.width / 2, y + 15);
}

/**
 * Draw terminal lines
 */
function drawTerminal(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  startY: number
) {
  ctx.font = `${SCREEN_CONFIG.fontSize.terminal}px monospace`;
  ctx.textAlign = 'left';
  
  lines.forEach((line, index) => {
    const y = startY + index * (SCREEN_CONFIG.fontSize.terminal + 8);
    
    // Line number
    ctx.fillStyle = '#64748B';
    ctx.fillText(`${(index + 1).toString().padStart(2, '0')}`, 20, y);
    
    // Line content
    ctx.fillStyle = SCREEN_CONFIG.colors.text;
    ctx.fillText(line, 50, y);
  });
}

/**
 * Draw task info
 */
function drawTaskInfo(ctx: CanvasRenderingContext2D, task: string, y: number) {
  ctx.font = `${SCREEN_CONFIG.fontSize.subtitle}px monospace`;
  ctx.fillStyle = SCREEN_CONFIG.colors.accent;
  ctx.textAlign = 'left';
  
  // Truncate if too long
  const maxWidth = SCREEN_CONFIG.resolution.width - 40;
  let displayTask = task;
  
  while (ctx.measureText(displayTask).width > maxWidth && displayTask.length > 3) {
    displayTask = displayTask.slice(0, -4) + '...';
  }
  
  ctx.fillText(displayTask, 20, y);
}

/**
 * Hook to create and manage screen texture
 */
export function useScreenTexture(
  agent: AgentType,
  initialContent?: ScreenContent
): UseScreenTextureReturn {
  const { canvas, ctx } = useMemo(() => createCanvas(), []);
  
  const textureRef = useRef<THREE.CanvasTexture>(
    new THREE.CanvasTexture(canvas)
  );
  
  // Configure texture
  useEffect(() => {
    const texture = textureRef.current;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, []);

  /**
   * Update screen content
   */
  const updateContent = useCallback((content: ScreenContent) => {
    const { title, subtitle, progress = 0, status, lines = [] } = content;
    
    // Clear and draw background
    drawBackground(ctx, status);
    
    // Draw header with agent name and status
    drawHeader(ctx, agent, status);
    
    // Draw task title
    drawTaskInfo(ctx, title, 80);
    
    // Draw subtitle if provided
    if (subtitle) {
      ctx.font = `${SCREEN_CONFIG.fontSize.body}px monospace`;
      ctx.fillStyle = SCREEN_CONFIG.colors.text;
      ctx.textAlign = 'left';
      ctx.fillText(subtitle, 20, 110);
    }
    
    // Draw progress bar
    drawProgress(ctx, progress, 140);
    
    // Draw terminal lines
    if (lines.length > 0) {
      const terminalLines = lines.slice(-8); // Show last 8 lines
      drawTerminal(ctx, terminalLines, 190);
    }
    
    // Mark texture for update
    textureRef.current.needsUpdate = true;
  }, [agent, canvas, ctx]);

  // Initial render
  useEffect(() => {
    if (initialContent) {
      updateContent(initialContent);
    } else {
      // Default content
      updateContent({
        title: `${agent.toUpperCase()} READY`,
        status: 'idle',
        progress: 0,
        lines: ['Waiting for task...'],
      });
    }
  }, [agent, initialContent, updateContent]);

  return {
    texture: textureRef.current,
    updateContent,
    canvas,
    ctx,
  };
}
