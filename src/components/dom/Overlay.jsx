import React from 'react';
import { Scroll, useScroll } from '@react-three/drei'; // <--- IMPORTANTE: AÑADIR useScroll
import { PORTFOLIO_DATA } from '../../store/Assets';
import { useGameStore } from '../../store/gameStore';

const Section = ({ children, align = "left", id = "" }) => (
  <section id={id} className={`min-h-screen w-full p-4 md:p-10 flex flex-col justify-center ${align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center"}`}>
    <div className="w-full md:w-1/2">
      {children}
    </div>
  </section>
);

export function Overlay() {
  const setTarget = useGameStore((state) => state.setTarget);
  
  // 1. OBTENEMOS EL CONTROLADOR DE SCROLL 3D
  const scroll = useScroll();

  // 2. FUNCIÓN DE VIAJE DE CÁMARA
  const scrollToProfile = () => {
    // 'scroll.el' es el contenedor que controla la animación 3D.
    // Le decimos que baje exactamente 1 altura de pantalla (window.innerHeight)
    // que es donde empieza la segunda sección.
    scroll.el.scrollTo({ 
      top: window.innerHeight, 
      behavior: 'smooth' 
    });
  };

  return (
    <Scroll html>
      <div className="w-screen">
        
        {/* SECCIÓN 1: HERO */}
        <section className="h-screen w-full flex flex-col justify-end items-center pb-12">
          <div 
            onClick={scrollToProfile} // <--- ACTIVAMOS EL VIAJE
            className="group cursor-pointer flex flex-col items-center gap-2 transition-opacity duration-500 hover:opacity-100 opacity-70 pointer-events-auto"
          >
            <p className="text-[10px] text-cyan-500 font-['JetBrains_Mono'] tracking-[0.3em] animate-pulse">
              SCROLL_DOWN
            </p>
            {/* Flecha animada */}
            <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 transform rotate-45 animate-bounce group-hover:border-white transition-colors" />
          </div>
        </section>

        {/* SECCIÓN 2: SOBRE MÍ */}
        <Section align="left"> 
          <div className="flex flex-col md:flex-row items-center gap-8 bg-black/60 backdrop-blur-md border border-cyan-500/30 p-6 md:p-8 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <div className="flex-1">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 font-['Orbitron']">
                <span className="text-cyan-400">01.</span> PERFIL_DE_PILOTO
              </h2>
              <p className="text-sm md:text-base text-gray-300 font-['JetBrains_Mono'] leading-relaxed mb-6">
                Desarrollador Creativo. No construyo webs, construyo mundos.
                <br/><br/>
                Mi misión es fusionar el diseño visual de alto impacto con ingeniería de software robusta.
              </p>
              <div className="flex gap-4">
                <div className="h-2 w-20 bg-cyan-500/50" />
                <div className="h-2 w-10 bg-pink-500/50" />
              </div>
            </div>

            {/* FOTO CLICABLE */}
            <div 
              className="relative w-40 h-40 md:w-64 md:h-64 shrink-0 group cursor-pointer pointer-events-auto"
              onClick={() => setTarget('profile')}
            >
              <div className="absolute -inset-2 border-2 border-cyan-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="absolute inset-0 border-2 border-cyan-500 rounded-lg overflow-hidden transform rotate-3 transition-transform group-hover:rotate-0 duration-500 bg-black">
                <img 
                  src={PORTFOLIO_DATA.personal.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-full w-full animate-scan" />
                
                <div className="absolute bottom-2 right-2 bg-black/80 text-cyan-400 text-[10px] font-mono px-2 py-1 border border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  [VIEW_DATA]
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* SECCIÓN 3: ARCHIVOS DE MISIÓN */}
        <Section align="right">
          <div className="bg-black/60 backdrop-blur-md border border-pink-500/30 p-6 md:p-8 rounded-lg text-right shadow-[0_0_20px_rgba(255,42,109,0.1)] w-full">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 font-['Orbitron']">
              ARCHIVOS_DE_MISIÓN <span className="text-pink-500">.02</span>
            </h2>
            <ul className="space-y-4 font-['JetBrains_Mono'] text-sm md:text-base text-gray-400">
              <li className="border-b border-gray-800 pb-2">
                <a href="https://www.indiedevday.es/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors block w-full">
                  [2024] Indie Dev Day Barcelona 2024 ↗
                </a>
              </li>
              <li className="border-b border-gray-800 pb-2">
                <a href="https://www.gamescom.global/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors block w-full">
                  [2023] Colonia Gamescom ↗
                </a>
              </li>
            </ul>
          </div>
        </Section>

        {/* SECCIÓN 4: CONTACTO */}
        <Section align="center">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-8">
              INICIAR_CONEXIÓN
            </h1>
            <a 
              href="mailto:tucorreo@ejemplo.com?subject=INCOMING_TRANSMISSION"
              className="relative z-50 pointer-events-auto inline-block px-6 py-3 md:px-8 md:py-4 bg-cyan-500/10 border border-cyan-400 text-cyan-400 font-bold tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 font-['JetBrains_Mono'] cursor-pointer decoration-transparent text-sm md:text-base"
            >
              ENVIAR_TRANSMISIÓN
            </a>
            <p className="mt-4 text-xs text-gray-500 font-mono">SECURE CHANNEL: ESTABLISHED</p>
          </div>
        </Section>
      </div>
    </Scroll>
  );
}