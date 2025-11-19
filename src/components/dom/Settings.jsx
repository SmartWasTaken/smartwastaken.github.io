import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

const Toggle = ({ label, active, onClick }) => (
  <div className="flex items-center justify-between mb-2 group cursor-pointer" onClick={onClick}>
    <span className={`font-mono text-sm transition-colors ${active ? 'text-cyan-400' : 'text-gray-500'}`}>
      {label}
    </span>
    <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${active ? 'bg-cyan-900' : 'bg-gray-800'}`}>
      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${active ? 'translate-x-5 bg-cyan-400' : ''}`} />
    </div>
  </div>
);

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggleSetting } = useGameStore();

  return (
    <div className="fixed top-6 right-6 z-[1000]"> {/* Z-Index muy alto para estar sobre todo */}
      
      {/* BOTÓN HAMBURGUESA */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-cyan-500 hover:text-white border border-cyan-500/30 hover:border-cyan-400 bg-black/50 backdrop-blur-sm p-2 rounded-sm transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* MENÚ DESPLEGABLE */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-black/90 border border-cyan-500/50 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-in fade-in slide-in-from-top-5 duration-200">
          <h3 className="text-white font-['Orbitron'] text-lg mb-4 border-b border-gray-700 pb-2">
            SYSTEM_CONFIG
          </h3>
          
          <Toggle label="SUN_CORE" active={settings.sun} onClick={() => toggleSetting('sun')} />
          <Toggle label="HOLOGRAM_GRID" active={settings.grid} onClick={() => toggleSetting('grid')} />
          <Toggle label="PARTICLES" active={settings.sparkles} onClick={() => toggleSetting('sparkles')} />
          <Toggle label="OPTICAL_BLOOM" active={settings.bloom} onClick={() => toggleSetting('bloom')} />

          <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 font-mono">
            ADJUST FOR PERFORMANCE
          </div>
        </div>
      )}
    </div>
  );
}