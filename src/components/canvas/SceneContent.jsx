import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useScroll, Grid, Sparkles, Text } from '@react-three/drei';
import * as maath from 'maath';
import { PORTFOLIO_DATA } from '../../store/Assets';
import { SpaceShooter } from './SpaceShooter';
import { useGameStore } from '../../store/gameStore';
import { AdditiveBlending } from 'three';
import { Sun } from './Sun'; // <--- IMPORTANTE: Asegúrate de haber creado el archivo Sun.jsx

function ProjectCrystal({ data, scroll }) {
  const mesh = useRef();
  const initialZ = useRef(data.position[2]);
  
  // ESTADO DE INTERACCIÓN (HOVER)
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      // Rotación: Rápida si hay hover, lenta si no
      mesh.current.rotation.x += delta * (hovered ? 2 : 0.2);
      mesh.current.rotation.y += delta * (hovered ? 2 : 0.5);

      // Escala: Se hace más grande al pasar el ratón
      const targetScale = hovered ? 1.2 : 1;
      maath.easing.damp(mesh.current.scale, 'x', targetScale, 0.2, delta);
      maath.easing.damp(mesh.current.scale, 'y', targetScale, 0.2, delta);
      maath.easing.damp(mesh.current.scale, 'z', targetScale, 0.2, delta);

      // Lógica de Scroll: Se alejan cuando bajas
      const targetZ = initialZ.current - (scroll.offset * 50);
      maath.easing.damp(mesh.current.position, 'z', targetZ, 0.2, delta);
    }
  });

  return (
    <group position={[data.position[0], data.position[1], data.position[2]]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh 
          ref={mesh} 
          userData={{ isTarget: true, projectId: data.id }}
          // EVENTOS DE PUNTERO
          onPointerOver={() => { document.body.style.cursor = 'none'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'none'; setHovered(false); }}
        >
          {/* PLACEHOLDER DE GEOMETRÍA */}
          <icosahedronGeometry args={[2, 0]} /> 
          <meshStandardMaterial 
            color={hovered ? "#ffffff" : data.color} 
            emissive={data.color}
            emissiveIntensity={hovered ? 4 : 2} 
            roughness={0.1}
            metalness={0.8}
            wireframe={hovered} 
          />
        </mesh>

        {/* TEXTO DEL PROYECTO (Visible solo al hover para evitar lag) */}
        <Text
          visible={hovered} 
          position={[0, 3.5, 0]}
          fontSize={0.5}
          font="https://fonts.gstatic.com/s/orbitron/v25/yMJRMIlzdpvBhQQL_Qq7dys.woff"
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {data.title}
        </Text>
      </Float>
    </group>
  );
}

export function SceneContent() {
  const scroll = useScroll();
  const setScrolled = useGameStore((state) => state.setScrolled); 
  
  // LEEMOS LA CONFIGURACIÓN DEL STORE
  const settings = useGameStore((state) => state.settings);

  useFrame((state, delta) => {
    // Movimiento suave de cámara siguiendo al ratón
    maath.easing.damp3(state.camera.rotation, [(state.pointer.y * Math.PI) / 15, (-state.pointer.x * Math.PI) / 10, 0], 0.25, delta);
    
    // Movimiento de cámara al hacer scroll (bajar físicamente)
    maath.easing.damp3(state.camera.position, [0, -scroll.offset * 20, 10], 0.2, delta);
    
    // Detectar si el usuario ha hecho scroll para ocultar el HUD
    const isUserScrolling = scroll.offset > 0.01;
    setScrolled(isUserScrolling);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      
      {/* 1. SOL (CONDICIONAL: Solo si settings.sun es true) */}
      {settings.sun && <Sun />}

      {/* 2. SUELO DE RETÍCULA (CONDICIONAL) */}
      {settings.grid && (
        <Grid 
          position={[0, -4, 0]} 
          args={[100, 100]} 
          cellSize={1} 
          cellThickness={1} 
          cellColor={PORTFOLIO_DATA.colors.neon} 
          sectionSize={5} 
          sectionThickness={1.5} 
          sectionColor={PORTFOLIO_DATA.colors.grid} 
          fadeDistance={30} 
          fadeStrength={1}
        />
      )}

      {/* 3. PARTÍCULAS (CONDICIONAL) */}
      {settings.sparkles && (
        <Sparkles 
          count={200} 
          scale={20} 
          size={4} 
          speed={0.4} 
          opacity={0.5} 
          color="#ffffff" 
          transparent={true} 
          depthWrite={false} 
          toneMapped={false} 
          blending={AdditiveBlending} 
        />
      )}

      {/* Renderizamos los cristales desde los datos */}
      {PORTFOLIO_DATA.projects.map((proj) => (
        <ProjectCrystal key={proj.id} data={proj} scroll={scroll} />
      ))}
      
      {/* Mecánica de disparo */}
      <group position={[0, 0, 0]}> 
         <SpaceShooter />
      </group>
    </>
  );
}