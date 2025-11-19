import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Planet = ({ radius, speed, size, color, offset = 0 }) => {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (mesh.current) {
      const time = clock.getElapsedTime() * speed + offset;
      mesh.current.position.x = Math.cos(time) * radius;
      mesh.current.position.z = Math.sin(time) * radius;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
};

export function Sun() {
  const atmosphereRef = useRef();

  useFrame((state, delta) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.z -= delta * 0.1;
    }
  });

  return (
    <group position={[0, 100, -500]}>
      
      <mesh>
        <sphereGeometry args={[12, 64, 64]} />
        <MeshDistortMaterial 
          color="#FDB813"       // Amarillo "Sol" estándar
          emissive="#FF8C00"    // Naranja oscuro para las zonas profundas
          emissiveIntensity={4} // MUCHA intensidad para activar el Bloom fuerte
          distort={0.2}         // Un poco más de movimiento
          speed={2}             // Movimiento rápido (es plasma hirviendo)
          roughness={0}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700"       // Color Oro
          transparent={true}
          opacity={0.2}         // Muy sutil
          side={THREE.BackSide} // Se renderiza por dentro para suavizar bordes
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight intensity={3} distance={1000} decay={1} color="#ffcc00" />

      <Planet radius={30} speed={0.8} size={1.5} color="#FF0000" offset={0} />   {/* Mercurio-ish */}
      <Planet radius={50} speed={0.5} size={2.5} color="#00F0FF" offset={2} />   {/* Tierra Cyber */}
      <Planet radius={80} speed={0.2} size={4}   color="#8A2BE2" offset={4} />   {/* Gigante Gas */}

    </group>
  );
}