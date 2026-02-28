// lib/utils.ts - Utility functions for M3 Office 3D

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AgentType, AgentStatus, Position3D, M3Phase } from '@/types';
import { AGENT_COLORS, STATUS_COLORS } from './constants';

// ============================================
// TAILWIND UTILS
// ============================================

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// COLOR UTILS
// ============================================

/**
 * Convert hex color to Three.js number format
 * @param hex - Hex color string (e.g., '#3B82F6')
 * @returns Number for Three.js (e.g., 0x3B82F6)
 */
export function hexToThree(hex: string): number {
  return parseInt(hex.replace('#', '0x'));
}

/**
 * Get agent color by type
 */
export function getAgentColor(agent: AgentType) {
  return AGENT_COLORS[agent];
}

/**
 * Get status color
 */
export function getStatusColor(status: AgentStatus): string {
  return STATUS_COLORS[status] || STATUS_COLORS.idle;
}

/**
 * Convert hex to rgba string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// TIME UTILS
// ============================================

/**
 * Format milliseconds to readable time string
 * @param ms - Milliseconds
 * @returns Formatted string (e.g., "2m 30s")
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format timestamp to readable date/time
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// ============================================
// MATH UTILS
// ============================================

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Lerp for 3D positions
 */
export function lerpPosition(a: Position3D, b: Position3D, t: number): Position3D {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
  ];
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Generate random number in range
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// ============================================
// STRING UTILS
// ============================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

// ============================================
// ARRAY UTILS
// ============================================

/**
 * Get last N items from array
 */
export function lastN<T>(arr: T[], n: number): T[] {
  return arr.slice(-n);
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  return arr.reduce((chunks, item, i) => {
    const chunkIndex = Math.floor(i / size);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), item];
    return chunks;
  }, [] as T[][]);
}

// ============================================
// 3D UTILS
// ============================================

/**
 * Calculate distance between two 3D positions
 */
export function distance3D(a: Position3D, b: Position3D): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Add two 3D positions
 */
export function addPosition(a: Position3D, b: Position3D): Position3D {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/**
 * Scale a 3D position
 */
export function scalePosition(pos: Position3D, scale: number): Position3D {
  return [pos[0] * scale, pos[1] * scale, pos[2] * scale];
}

// ============================================
// CANVAS UTILS (for screen textures)
// ============================================

/**
 * Create a rounded rectangle path on canvas
 */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Wrap text on canvas
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// ============================================
// VALIDATION UTILS
// ============================================

/**
 * Check if value is a valid AgentType
 */
export function isValidAgentType(value: unknown): value is AgentType {
  return typeof value === 'string' && ['organizer', 'coder', 'verifier', 'maestro'].includes(value);
}

/**
 * Check if value is a valid AgentStatus
 */
export function isValidAgentStatus(value: unknown): value is AgentStatus {
  return typeof value === 'string' && 
    ['idle', 'working', 'completed', 'error', 'thinking'].includes(value);
}

// ============================================
// DEBUG UTILS
// ============================================

/**
 * Log with timestamp prefix
 */
export function logWithTime(...args: unknown[]): void {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}]`, ...args);
}

/**
 * Create a debug string for position
 */
export function debugPosition(pos: Position3D): string {
  return `[${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}]`;
}

// ============================================
// AGENT UTILS
// ============================================

/**
 * Determine agent status based on current M3 phase
 */
export function getAgentStatus(agent: AgentType, phase: M3Phase): AgentStatus {
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
