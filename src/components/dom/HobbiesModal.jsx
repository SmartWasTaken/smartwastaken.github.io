import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../store/Assets';

export function HobbiesModal() {
  const { targetLocked, setTarget } = useGameStore();

  // Verificamos si el target es una categoría de hobbies
  const isHobby = ['games', 'movies', 'series'].includes(targetLocked);

  if (!isHobby) return null;

  const list = PORTFOLIO_DATA.hobbies[targetLocked];
  const title = targetLocked.toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-black/90 border-2 border-pink-500 rounded-lg shadow-[0_0_50px_rgba(255,42,109,0.3)] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-pink-900 bg-pink-900/20 flex justify-between items-center">
          <h2 className="text-3xl font-['Orbitron'] text-white tracking-widest">
            DB_{title}
          </h2>
          <button 
            onClick={() => setTarget(null)}
            className="text-pink-500 hover:text-white font-mono text-xl px-4 py-2 border border-pink-500 hover:bg-pink-500 cursor-pointer"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Lista Infinita */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {list.map((item, idx) => (
              <li key={idx} className="text-gray-300 font-['JetBrains_Mono'] text-lg border-b border-gray-800 pb-2 hover:text-pink-400 hover:pl-4 transition-all duration-300 cursor-crosshair">
                <span className="text-pink-600 text-xs mr-4">//{String(idx + 1).padStart(3, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Decoración Footer */}
        <div className="p-2 bg-black border-t border-pink-900 text-center">
          <span className="text-xs text-pink-700 font-mono animate-pulse">END_OF_FILE</span>
        </div>
      </div>
    </div>
  );
}