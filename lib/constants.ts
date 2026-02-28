// lib/constants.ts - Constants and configuration for M3 Office 3D

import { AgentType, AgentColor, Position3D, WorkstationConfig } from '@/types';

// ============================================
// AGENT COLORS
// ============================================

export const AGENT_COLORS: Record<AgentType, AgentColor> = {
  organizer: {
    primary: '#3B82F6',   // Blue-500
    secondary: '#1D4ED8', // Blue-700
    glow: '#60A5FA',      // Blue-400
  },
  coder: {
    primary: '#10B981',   // Emerald-500
    secondary: '#047857', // Emerald-700
    glow: '#34D399',      // Emerald-400
  },
  verifier: {
    primary: '#8B5CF6',   // Violet-500
    secondary: '#6D28D9', // Violet-700
    glow: '#A78BFA',      // Violet-400
  },
  maestro: {
    primary: '#F59E0B',   // Amber-500
    secondary: '#B45309', // Amber-700
    glow: '#FBBF24',      // Amber-400
  },
};

// ============================================
// STATUS COLORS
// ============================================

export const STATUS_COLORS = {
  idle: '#6B7280',      // Gray-500
  working: '#FBBF24',   // Amber-400
  completed: '#10B981', // Emerald-500
  error: '#EF4444',     // Red-500
  thinking: '#F59E0B',  // Amber-500
} as const;

// ============================================
// WORKSTATION POSITIONS
// ============================================

export const WORKSTATION_CONFIGS: WorkstationConfig[] = [
  {
    agent: 'organizer',
    position: [-4, 0, 0],
    rotation: [0, Math.PI / 6, 0],
    deskColor: '#3B82F6',
    chairColor: '#1E40AF',
  },
  {
    agent: 'coder',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    deskColor: '#10B981',
    chairColor: '#065F46',
  },
  {
    agent: 'verifier',
    position: [4, 0, 0],
    rotation: [0, -Math.PI / 6, 0],
    deskColor: '#8B5CF6',
    chairColor: '#5B21B6',
  },
  {
    agent: 'maestro',
    position: [0, 0, -3],
    rotation: [0, Math.PI, 0],
    deskColor: '#F59E0B',
    chairColor: '#B45309',
  },
];

// ============================================
// AGENT INFO
// ============================================

export const AGENT_INFO: Record<AgentType, { name: string; description: string; icon: string }> = {
  organizer: {
    name: 'Organizer',
    description: 'Analisa requisitos e planeja a implementação',
    icon: 'LayoutGrid',
  },
  coder: {
    name: 'Coder',
    description: 'Implementa código e soluções técnicas',
    icon: 'Code2',
  },
  verifier: {
    name: 'Verifier',
    description: 'Testa e verifica a qualidade do código',
    icon: 'CheckCircle',
  },
  maestro: {
    name: 'Maestro',
    description: 'Coordena e supervisiona todo o processo',
    icon: 'Crown',
  },
};

// ============================================
// SCENE CONFIGURATION
// ============================================

export const SCENE_CONFIG = {
  // Camera
  camera: {
    position: [0, 8, 12] as Position3D,
    fov: 50,
    near: 0.1,
    far: 1000,
  },
  
  // Lighting
  lighting: {
    ambient: {
      intensity: 0.4,
      color: '#ffffff',
    },
    directional: {
      position: [10, 20, 10] as Position3D,
      intensity: 1,
      color: '#ffffff',
      castShadow: true,
    },
    pointLights: [
      { position: [-4, 5, 2] as Position3D, color: '#3B82F6', intensity: 0.3 },
      { position: [0, 5, 2] as Position3D, color: '#10B981', intensity: 0.3 },
      { position: [4, 5, 2] as Position3D, color: '#8B5CF6', intensity: 0.3 },
      { position: [0, 5, -2] as Position3D, color: '#F59E0B', intensity: 0.3 },
    ],
  },
  
  // Shadows
  shadows: {
    enabled: true,
    mapSize: 2048,
    bias: -0.0001,
  },
  
  // Grid
  grid: {
    size: 20,
    divisions: 20,
    colorCenter: '#444444',
    colorGrid: '#222222',
  },
} as const;

// ============================================
// OBJECT DIMENSIONS
// ============================================

export const DIMENSIONS = {
  desk: {
    width: 2.5,
    height: 0.8,
    depth: 1.5,
    legThickness: 0.1,
  },
  chair: {
    seatWidth: 0.8,
    seatDepth: 0.8,
    seatHeight: 0.1,
    backHeight: 1,
    legHeight: 0.5,
  },
  computer: {
    monitor: {
      width: 1.2,
      height: 0.7,
      depth: 0.05,
      standHeight: 0.3,
    },
    pc: {
      width: 0.3,
      height: 0.6,
      depth: 0.6,
    },
  },
  avatar: {
    headRadius: 0.25,
    bodyHeight: 0.8,
    bodyRadius: 0.2,
  },
} as const;

// ============================================
// ANIMATION CONFIGURATION
// ============================================

export const ANIMATION_CONFIG = {
  idle: {
    amplitude: 0.02,
    frequency: 2,
    duration: 2000,
  },
  typing: {
    amplitude: 0.01,
    frequency: 10,
    duration: 100,
  },
  thinking: {
    rotationAngle: 0.3,
    duration: 1500,
  },
  completed: {
    jumpHeight: 0.5,
    duration: 500,
    bounce: 1.5,
  },
  error: {
    shakeIntensity: 0.1,
    shakeCount: 5,
    duration: 300,
  },
  transition: {
    duration: 300,
    easing: 'easeInOut',
  },
} as const;

// ============================================
// SCREEN CONFIGURATION
// ============================================

export const SCREEN_CONFIG = {
  resolution: {
    width: 512,
    height: 512,
  },
  updateInterval: 100, // ms
  fontSize: {
    title: 24,
    subtitle: 16,
    body: 14,
    terminal: 12,
  },
  colors: {
    background: '#0F172A', // Slate-900
    text: '#F8FAFC',       // Slate-50
    accent: '#38BDF8',     // Sky-400
    success: '#4ADE80',    // Green-400
    error: '#F87171',      // Red-400
    warning: '#FBBF24',    // Amber-400
  },
} as const;

// ============================================
// DATA POLLING
// ============================================

export const POLLING_CONFIG = {
  interval: 1000, // ms
  retryDelay: 2000,
  maxRetries: 3,
} as const;

// ============================================
// FILE PATHS
// ============================================

export const FILE_PATHS = {
  stateFile: '/m3-state.json',
  textures: '/textures/',
} as const;

// ============================================
// PHASE DISPLAY NAMES
// ============================================

export const PHASE_DISPLAY_NAMES: Record<string, string> = {
  idle: 'Aguardando',
  organizing: 'Organizando',
  coding: 'Codificando',
  verifying: 'Verificando',
  maestro: 'Supervisão',
  completed: 'Concluído',
  error: 'Erro',
};

// ============================================
// STATUS DISPLAY NAMES
// ============================================

export const STATUS_DISPLAY_NAMES: Record<string, string> = {
  idle: 'Inativo',
  working: 'Trabalhando',
  thinking: 'Pensando',
  completed: 'Completado',
  error: 'Erro',
};

// ============================================
// UI CONFIGURATION
// ============================================

export const UI_CONFIG = {
  statusBar: {
    height: 60,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    textColor: '#F8FAFC',
  },
  agentCards: {
    width: 280,
    gap: 16,
  },
  progressRing: {
    size: 60,
    strokeWidth: 6,
  },
  controls: {
    position: 'bottom-right' as const,
    gap: 8,
  },
} as const;
