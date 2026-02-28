// components/ui/Controls.tsx - Control buttons

'use client';

import { RefreshCw, Camera, Pause, Play } from 'lucide-react';
import { useState } from 'react';

interface ControlsProps {
  onRefresh: () => void;
}

/**
 * Control buttons for the 3D scene
 */
export function Controls({ onRefresh }: ControlsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCameraReset = () => {
    // Dispatch custom event for the 3D scene to listen
    window.dispatchEvent(new CustomEvent('resetCamera'));
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 
                   text-slate-200 rounded-lg border border-slate-600 
                   transition-colors disabled:opacity-50"
        title="Atualizar estado"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="text-sm">Atualizar</span>
      </button>

      <button
        onClick={handleCameraReset}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 
                   text-slate-200 rounded-lg border border-slate-600 
                   transition-colors"
        title="Resetar câmera"
      >
        <Camera className="w-4 h-4" />
        <span className="text-sm">Câmera</span>
      </button>
    </div>
  );
}
