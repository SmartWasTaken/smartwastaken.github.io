import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useScroll, Grid, Sparkles, Html, Line } from '@react-three/drei';
import * as maath from 'maath';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../store/Assets';
import { SpaceShooter } from './SpaceShooter';
import { useGameStore } from '../../store/gameStore';
import { AdditiveBlending } from 'three';
import { Sun } from './Sun';

// CABLE DINÁMICO (Sin cambios, funciona bien)
const DynamicCable = ({ startObjRef, endPos, color }) => {
  const lineRef = useRef();
  const tempVec = new THREE.Vector3();

  useFrame(() => {
    if (startObjRef.current && lineRef.current) {
      startObjRef.current.getWorldPosition(tempVec);
      lineRef.current.parent.worldToLocal(tempVec);
      lineRef.current.geometry.setPositions([
        tempVec.x, tempVec.y, tempVec.z,
        endPos[0], endPos[1], endPos[2]
      ]);
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[[0, 0, 0], endPos]} 
      color={color}
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  );
};

function ProjectCrystal({ data, scroll }) {
  const mesh = useRef();
  const group = useRef();
  
  const [hovered, setHovered] = useState(false);
  const setTarget = useGameStore((state) => state.setTarget);

  // POSICIONES FIJAS DE LA INTERFAZ
  const ELBOW_POS = [1.8, 2, 0]; 
  const END_POS = [4.5, 2, 0];   

  useFrame((state, delta) => {
    if (mesh.current) {
      // Rotación visual del cristal
      mesh.current.rotation.x += delta * (hovered ? 2 : 0.2);
      mesh.current.rotation.y += delta * (hovered ? 2 : 0.5);

      // Escala al hover
      const targetScale = hovered ? 1.2 : 1;
      maath.easing.damp(mesh.current.scale, 'x', targetScale, 0.2, delta);
      maath.easing.damp(mesh.current.scale, 'y', targetScale, 0.2, delta);
      maath.easing.damp(mesh.current.scale, 'z', targetScale, 0.2, delta);
    }
    
    // --- CAMBIO IMPORTANTE ---
    // He eliminado la lógica que movía 'group.current.position.z'.
    // Ahora el grupo se queda quieto en su sitio.
    // Como la cámara baja, el objeto subirá visualmente.
  });

  const handleClick = (e) => {
    e.stopPropagation(); 
    setTarget(data.id);
  };

  return (
    <group ref={group} position={[data.position[0], data.position[1], data.position[2]]}>
      
      {/* CRISTAL FLOTANTE */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <mesh 
          ref={mesh} 
          userData={{ isTarget: true, projectId: data.id }}
          onClick={handleClick}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        >
          <icosahedronGeometry args={[1.5, 0]} /> 
          <meshStandardMaterial 
            color={hovered ? "#ffffff" : data.color} 
            emissive={data.color}
            emissiveIntensity={hovered ? 4 : 2} 
            roughness={0.1}
            metalness={0.8}
            wireframe={hovered} 
          />
        </mesh>
      </Float>

      {/* CABLE Y LÍNEAS */}
      <DynamicCable startObjRef={mesh} endPos={ELBOW_POS} color={data.color} />

      <Line 
        points={[ELBOW_POS, END_POS]} 
        color={data.color}
        lineWidth={1}
        transparent
        opacity={0.6}
      />
      
      <mesh position={ELBOW_POS}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={data.color} />
      </mesh>

      {/* ETIQUETA HTML */}
      <Html
        position={END_POS}
        style={{ 
          transform: 'translate3d(10px, -50%, 0)', 
          pointerEvents: 'none' 
        }}
        zIndexRange={[100, 0]}
      >
        <div className={`flex flex-col items-start transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-70'}`}>
          
          <h1 
            className="text-2xl font-['Orbitron'] font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ 
              color: data.color,
              textShadow: `0 0 10px ${data.color}40`
            }}
          >
            {data.title}
          </h1>

          <div 
            className={`
              mt-2 w-48 h-28 bg-black border border-cyan-500/50 rounded-sm overflow-hidden relative
              transition-all duration-300 origin-top-left transform
              ${hovered ? 'scale-100 opacity-100 h-28' : 'scale-0 opacity-0 h-0'}
            `}
            style={{ borderColor: data.color }}
          >
            <img src={data.image} alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/50 animate-[scan_2s_linear_infinite]" />
          </div>
        </div>
      </Html>

    </group>
  );
}

export function SceneContent() {
  const scroll = useScroll();
  const setScrolled = useGameStore((state) => state.setScrolled); 
  const settings = useGameStore((state) => state.settings);

  useFrame((state, delta) => {
    // 1. ROTACIÓN DE CÁMARA (Mouse Look)
    maath.easing.damp3(state.camera.rotation, [(state.pointer.y * Math.PI) / 15, (-state.pointer.x * Math.PI) / 10, 0], 0.25, delta);
    
    // 2. POSICIÓN DE CÁMARA (Scroll Vertical)
    // He aumentado el multiplicador a 30 para que baje más y recorra mejor los objetos
    maath.easing.damp3(state.camera.position, [0, -scroll.offset * 30, 10], 0.2, delta);
    
    const isUserScrolling = scroll.offset > 0.01;
    setScrolled(isUserScrolling);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      
      {settings.sun && <Sun />}

      {settings.grid && (
        <Grid 
          position={[0, -4, 0]} args={[100, 100]} cellSize={1} cellThickness={1} 
          cellColor={PORTFOLIO_DATA.colors.neon} sectionSize={5} sectionThickness={1.5} 
          sectionColor={PORTFOLIO_DATA.colors.grid} fadeDistance={30} fadeStrength={1}
        />
      )}

      {settings.sparkles && (
        <Sparkles 
          count={200} scale={20} size={4} speed={0.4} opacity={0.5} color="#ffffff" 
          transparent={true} depthWrite={false} toneMapped={false} blending={AdditiveBlending} 
        />
      )}

      {PORTFOLIO_DATA.projects.map((proj) => (
        <ProjectCrystal key={proj.id} data={proj} scroll={scroll} />
      ))}
      
      <group position={[0, 0, 0]}> 
         <SpaceShooter />
      </group>
    </>
  );
}