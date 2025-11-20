import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../store/Assets';

export function HUD() {
  const { score, targetLocked, isScrolled, section, setSection } = useGameStore();

  return (
    <div className={`pointer-events-none fixed inset-0 z-10 text-white font-mono transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
      {/* FLECHA IZQUIERDA (Ir a Aficiones) */}
      {section === 'main' && (
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group flex items-center gap-4"
          onClick={() => setSection('hobbies')}
        >
          <div className="text-6xl text-cyan-500 group-hover:text-white transition-colors font-['Orbitron']">{'<'}</div>
          <div className="hidden group-hover:block text-sm text-cyan-400 tracking-widest bg-black/80 p-2 border border-cyan-500">
            SECTOR_AFICIONES
          </div>
        </div>
      )}

      {/* FLECHA DERECHA (Volver a Main) */}
      {section === 'hobbies' && (
        <div 
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group flex items-center gap-4 flex-row-reverse"
          onClick={() => setSection('main')}
        >
          <div className="text-6xl text-pink-500 group-hover:text-white transition-colors font-['Orbitron']">{'>'}</div>
          <div className="hidden group-hover:block text-sm text-pink-400 tracking-widest bg-black/80 p-2 border border-pink-500">
            RETORNO_A_BASE
          </div>
        </div>
      )}
      
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