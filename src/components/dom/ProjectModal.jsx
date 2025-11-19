import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../store/Assets';

// 1. ESTILOS CSS INYECTADOS
const styles = `
  @keyframes hologramExpand {
    0% { transform: scaleY(0) scaleX(0.95); opacity: 0; }
    40% { opacity: 1; }
    100% { transform: scaleY(1) scaleX(1); opacity: 1; }
  }
  @keyframes hologramCollapse {
    0% { transform: scaleY(1) scaleX(1); opacity: 1; }
    60% { opacity: 1; }
    100% { transform: scaleY(0) scaleX(0.95); opacity: 0; }
  }
  .animate-enter { animation: hologramExpand 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards; transform-origin: center; }
  .animate-exit { animation: hologramCollapse 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards; transform-origin: center; }
  .scanlines {
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0, 240, 255, 0.1) 50%, rgba(0, 240, 255, 0.1));
    background-size: 100% 4px; animation: scrollScanlines 10s linear infinite; pointer-events: none;
  }
`;

const Typewriter = ({ text }) => {
  const [displayed, setDisplayed] = React.useState('');
  React.useEffect(() => {
    let i = 0; setDisplayed('');
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayed(p => p + text.charAt(i)); i++; } 
      else clearInterval(timer);
    }, 15);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayed}</span>;
};

export function ProjectModal() {
  const { targetLocked, setTarget } = useGameStore();
  const [isClosing, setIsClosing] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // GESTIÓN DEL CURSOR Y BLOQUEO DE ANIMACIÓN
  useEffect(() => {
    if (targetLocked) {
      document.body.style.cursor = 'auto'; 
      setIsLocked(true);
      const timer = setTimeout(() => { setIsLocked(false); }, 500);
      return () => { clearTimeout(timer); document.body.style.cursor = 'none'; };
    }
  }, [targetLocked]);

  const handleClose = () => {
    if (isLocked) return;
    setIsClosing(true); 
    setTimeout(() => { setTarget(null); setIsClosing(false); }, 500);
  };

  if (!targetLocked) return null;

  // --- LÓGICA DE SELECCIÓN DE DATOS (PROYECTO VS PERFIL) ---
  let data = null;

  if (targetLocked === 'profile') {
    // Datos del PERFIL
    data = {
      title: PORTFOLIO_DATA.personal.name,
      image: PORTFOLIO_DATA.personal.photo,
      desc: PORTFOLIO_DATA.personal.longDescription,
      link: PORTFOLIO_DATA.personal.socialLink,
      linkText: "CONNECT_LINKEDIN" 
    };
  } else {
    // Datos de PROYECTO
    const project = PORTFOLIO_DATA.projects.find(p => p.id === targetLocked);
    if (project) {
      data = {
        ...project,
        linkText: "Initialize_Protocol (Itch.io)"
      };
    }
  }

  if (!data) return null;

  return (
    <>
      <style>{styles}</style>
      
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
        <div className={`relative max-w-5xl w-full mx-4 md:mx-0 bg-black/90 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col md:flex-row rounded-sm overflow-hidden ${isClosing ? 'animate-exit' : 'animate-enter'}`}>
          
          <div className="scanlines absolute inset-0 z-20" />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 z-30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 z-30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 z-30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 z-30" />

          {/* Imagen */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative border-b md:border-b-0 md:border-r border-cyan-800/50 group">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale-[50%] group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay pointer-events-none" />
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between relative z-30">
            
            <button 
              onClick={handleClose}
              className={`absolute top-4 right-4 px-6 py-3 border font-mono text-lg uppercase tracking-widest transition-all duration-300 ${isLocked ? 'border-gray-800 text-gray-600 cursor-wait opacity-50' : 'border-cyan-900 text-cyan-500 hover:text-white hover:bg-red-500/80 hover:border-red-500 cursor-pointer'}`}
            >
              {isLocked ? '[ ... ]' : '[ Close ]'}
            </button>

            <div className="mt-8">
              <h3 className="text-xs text-cyan-300 font-mono mb-2 tracking-[0.2em] animate-pulse">/// SECURE_CONNECTION_ESTABLISHED</h3>
              
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-600 font-['Orbitron'] mb-6 uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                {data.title}
              </h2>
              
              <div className="text-cyan-100 font-['JetBrains_Mono'] text-sm leading-relaxed border-l-2 border-cyan-500/50 pl-4 h-40 overflow-y-auto pr-2 custom-scrollbar">
                <Typewriter text={data.desc} />
                <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse align-middle ml-1"/>
              </div>
            </div>

            {/* Botón Dinámico */}
            <div className="mt-8">
              <a href={data.link} target="_blank" rel="noreferrer" className="relative block w-full text-center py-4 bg-cyan-900/30 border border-cyan-400 text-cyan-400 font-['Orbitron'] tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 uppercase shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]">
                {data.linkText} ↗
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}