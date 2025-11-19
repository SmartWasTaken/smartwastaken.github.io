import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useGameStore } from '../../store/gameStore'; // Importar Store

export function Effects() {
  const bloomEnabled = useGameStore((state) => state.settings.bloom);

  return (
    <EffectComposer disableNormalPass>
      {/* Solo activamos Bloom si el ajuste está en TRUE */}
      {bloomEnabled && (
        <Bloom 
          luminanceThreshold={1} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6}
        />
      )}
      
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}