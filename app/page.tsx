// app/page.tsx - Main page

'use client';

import dynamic from 'next/dynamic';
import { UIOverlay } from '@/components/ui/UIOverlay';

// Dynamic import for 3D scene to avoid SSR issues
const Office = dynamic(
  () => import('@/components/scene/Office').then((mod) => mod.Office),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Carregando cena 3D...</p>
        </div>
      </div>
    ),
  }
);

/**
 * Main page component
 */
export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* 3D Scene */}
      <Office />

      {/* UI Overlay */}
      <UIOverlay />
    </main>
  );
}
