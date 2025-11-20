import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerformanceMonitor, ScrollControls } from '@react-three/drei';
import { SceneContent } from './components/canvas/SceneContent';
import { Effects } from './components/canvas/Effects';
import { HUD } from './components/dom/HUD';
import { Overlay } from './components/dom/Overlay';
import { PORTFOLIO_DATA } from './store/Assets';
import { CustomCursor } from './components/dom/CustomCursor';
import { ProjectModal } from './components/dom/ProjectModal';
import { Settings } from './components/dom/Settings';
import { HobbiesModal } from './components/dom/HobbiesModal';

function App() {
  const [dpr, setDpr] = useState(1.5); 

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <CustomCursor />
      <HUD />
      <Settings />
      <HobbiesModal />
      <ProjectModal />
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, toneMappingExposure: 1.5 }}
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
        <color attach="background" args={[PORTFOLIO_DATA.colors.void]} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
        
        <ScrollControls pages={4} damping={0.2}>
          <Suspense fallback={null}>
            <SceneContent /> 
          </Suspense>
          
          <Overlay />
        </ScrollControls>
        
        <Effects />
      </Canvas>
    </div>
  );
}

export default App;