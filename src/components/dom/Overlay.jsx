import React from 'react';
import { Scroll } from '@react-three/drei';
import { PORTFOLIO_DATA } from '../../store/Assets';
import { useGameStore } from '../../store/gameStore'; // <--- IMPORTAR STORE

const Section = ({ children, align = "left" }) => (
  <section className={`h-screen w-full p-10 flex flex-col justify-center ${align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center"}`}>
    <div className="w-full md:w-1/2">
      {children}
    </div>
  </section>
);

export function Overlay() {
  // Extraemos la función para abrir el modal
  const setTarget = useGameStore((state) => state.setTarget);

  return (
    <Scroll html>
      <div className="w-screen">
        {/* SECCIÓN 1: VACÍA */}
        <section className="h-screen w-full" />

        {/* SECCIÓN 2: SOBRE MÍ */}
        <Section align="left">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 bg-black/60 backdrop-blur-md border border-cyan-500/30 p-8 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <h2 className="text-4xl font-bold text-white mb-4 font-['Orbitron']">
                <span className="text-cyan-400">01.</span> IVÁN_DE_CASTILLA_GUITIÁN
              </h2>
              <p className="text-gray-300 font-['JetBrains_Mono'] leading-relaxed mb-6">
                Videogame developer and designer
                <br/><br/>
                My mission is to do what I always dreamed, making my thoughts come to life.
              </p>
              <div className="flex gap-4">
                <div className="h-2 w-20 bg-cyan-500/50" />
                <div className="h-2 w-10 bg-pink-500/50" />
              </div>
            </div>

            {/* FOTO CLICABLE */}
            <div 
              className="relative w-64 h-64 shrink-0 group cursor-pointer pointer-events-auto"
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
                
                {/* Etiqueta visual para indicar que es clicable */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-cyan-400 text-[10px] font-mono px-2 py-1 border border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  [VIEW_DATA]
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* SECCIÓN 3: ARCHIVOS DE MISIÓN */}
        <Section align="right">
          <div className="bg-black/60 backdrop-blur-md border border-pink-500/30 p-8 rounded-lg text-right shadow-[0_0_20px_rgba(255,42,109,0.1)]">
            <h2 className="text-4xl font-bold text-white mb-4 font-['Orbitron']">
              ARCHIVOS_DE_MISIÓN <span className="text-pink-500">.02</span>
            </h2>
            <ul className="space-y-4 font-['JetBrains_Mono'] text-gray-400">
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
          <div className="text-center">
            <h1 className="text-6xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-8">
              INICIAR_CONEXIÓN
            </h1>
            <a 
              href="mailto:tucorreo@ejemplo.com?subject=INCOMING_TRANSMISSION"
              className="relative z-50 pointer-events-auto inline-block px-8 py-4 bg-cyan-500/10 border border-cyan-400 text-cyan-400 font-bold tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 font-['JetBrains_Mono'] cursor-pointer decoration-transparent"
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