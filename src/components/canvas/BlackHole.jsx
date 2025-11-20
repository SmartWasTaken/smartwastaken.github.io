import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Gltf, Sparkles } from '@react-three/drei';

export function BlackHole() {
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.1; 
    }
  });

  return (
    <group position={[100, 100, -350]}> 
      
      <group ref={modelRef}>
        <Gltf 
          src="/models/gargantua.glb"
          scale={0.7}
        />
      </group>

      <Sparkles 
        count={300} 
        scale={40} 
        size={6} 
        speed={2} 
        opacity={0.5} 
        color="#ffaa00"
        noise={10} 
      />
      
    </group>
  );
}