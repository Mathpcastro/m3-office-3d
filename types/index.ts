// types/index.ts - TypeScript definitions for M3 Office 3D

// ============================================
// AGENT TYPES
// ============================================

export type AgentType = 'organizer' | 'coder' | 'verifier' | 'maestro';

export type AgentStatus = 'idle' | 'working' | 'completed' | 'error' | 'thinking';

export interface AgentState {
  type: AgentType;
  status: AgentStatus;
  currentTask: string | null;
  progress: number;
  attemptCount: number;
  lastUpdate: number;
}

export interface AgentInfo {
  type: AgentType;
  name: string;
  description: string;
  color: AgentColor;
}

export interface AgentColor {
  primary: string;
  secondary: string;
  glow: string;
}

// ============================================
// M3 STATE
// ============================================

export type M3Phase = 'idle' | 'organizing' | 'coding' | 'verifying' | 'maestro' | 'completed' | 'error';

export interface M3State {
  task: string;
  status: M3Phase;
  currentAgent: AgentType | null;
  progress: number;
  attempts: {
    organizer: number;
    coder: number;
    verifier: number;
    maestro: number;
  };
  logs: LogEntry[];
  timestamp: number;
}

export interface LogEntry {
  timestamp: number;
  agent: AgentType;
  message: string;
  level: 'info' | 'success' | 'error' | 'warning';
}

// ============================================
// ANIMATION TYPES
// ============================================

export type AnimationState = 'idle' | 'typing' | 'thinking' | 'completed' | 'error';

export type AgentExpression = 'neutral' | 'focused' | 'happy' | 'sad' | 'surprised';

export type AgentPose = 'sitting' | 'leaning' | 'celebrating' | 'defeated';

export interface AnimationConfig {
  state: AnimationState;
  duration: number;
  easing: string;
  loop: boolean;
}

// ============================================
// 3D SCENE TYPES
// ============================================

export type Position3D = [number, number, number];

export type Rotation3D = [number, number, number];

export interface WorkstationConfig {
  agent: AgentType;
  position: Position3D;
  rotation: Rotation3D;
  deskColor: string;
  chairColor: string;
}

export interface ScreenContent {
  title: string;
  subtitle?: string;
  progress?: number;
  status: AgentStatus;
  lines?: string[];
}

// ============================================
// UI TYPES
// ============================================

export interface StatusBarProps {
  task: string;
  phase: M3Phase;
  progress: number;
  elapsedTime: number;
}

export interface AgentCardProps {
  agent: AgentInfo;
  state: AgentState;
  isActive: boolean;
}

// ============================================
// STORE TYPES
// ============================================

export interface M3Store {
  // State
  state: M3State;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setState: (state: M3State) => void;
  updateProgress: (progress: number) => void;
  setStatus: (status: M3Phase) => void;
  addLog: (entry: LogEntry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: () => Promise<void>;
}

// ============================================
// API/FILE TYPES
// ============================================

export interface M3StateFile {
  status: M3Phase;
  task?: string;
  progress?: number;
  current_agent?: AgentType;
  attempts?: {
    organizer: number;
    coder: number;
    verifier: number;
    maestro: number;
  };
  logs?: Array<{
    time: number;
    agent: string;
    message: string;
    level?: string;
  }>;
}

// ============================================
// UTILITY TYPES
// ============================================

export type ColorHex = string;

export type Size3D = [number, number, number];

export interface BoundingBox {
  min: Position3D;
  max: Position3D;
}

// Map of agent types to their state
export type AgentStateMap = Record<AgentType, AgentState>;

// Animation frame data
export interface AnimationFrame {
  time: number;
  position?: Position3D;
  rotation?: Rotation3D;
  scale?: Size3D;
}
