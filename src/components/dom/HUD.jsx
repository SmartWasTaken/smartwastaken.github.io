import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../store/Assets';

export function HUD() {
  const { score, targetLocked, isScrolled } = useGameStore();

  return (
    <div className={`pointer-events-none fixed inset-0 z-10 text-white font-mono transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
      {/* Esquinas Decorativas (FUI) */}
      <div className="absolute top-4 left-4 border-t-2 border-l-2 border-cyan-400 w-8 h-8" />
      <div className="absolute top-4 right-4 border-t-2 border-r-2 border-cyan-400 w-8 h-8" />
      <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-cyan-400 w-8 h-8" />
      <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-cyan-400 w-8 h-8" />

      {/* Header Datos */}
      <div className="absolute top-8 left-10">
        <h1 className="text-2xl font-bold tracking-widest opacity-80" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {PORTFOLIO_DATA.personal.name}
        </h1>
        <p className="text-xs text-cyan-300 animate-pulse">SYSTEM: ONLINE</p>
      </div>

      {/* Stats */}
      <div className="absolute bottom-8 right-10 text-right">
        <p className="text-xs text-gray-400">DATA_FRAGMENTS</p>
        <p className="text-4xl font-bold text-cyan-400">{score.toString().padStart(6, '0')}</p>
      </div>
    </div>
  );
}