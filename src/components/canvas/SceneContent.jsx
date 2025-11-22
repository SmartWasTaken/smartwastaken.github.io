import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as drei from '@react-three/drei';
import * as maath from 'maath';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../store/Assets';
import { SpaceShooter } from './SpaceShooter';
import { useGameStore } from '../../store/gameStore';
import { AdditiveBlending } from 'three';
import { Sun } from './Sun';
import { BlackHole } from './BlackHole';

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
    <drei.Line
      ref={lineRef}
      points={[[0, 0, 0], endPos]} 
      color={color}
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  );
};

function ProjectCrystal({ data, scroll, isMobile }) {
  const group = useRef();
  const floatingGroup = useRef();
  
  const [hovered, setHovered] = useState(false);
  const setTarget = useGameStore((state) => state.setTarget);

  const ELBOW_POS = isMobile ? [1.2, 1.5, 0] : [1.8, 2, 0]; 
  const END_POS = isMobile ? [3.0, 1.5, 0] : [4.5, 2, 0];   

  useFrame((state, delta) => {
    if (floatingGroup.current) {
      floatingGroup.current.rotation.x += delta * (hovered ? 0.5 : 0.1);
      floatingGroup.current.rotation.y += delta * (hovered ? 0.5 : 0.2);
      
      const targetScale = hovered ? 1.2 : 1;
      maath.easing.damp(floatingGroup.current.scale, 'x', targetScale, 0.2, delta);
      maath.easing.damp(floatingGroup.current.scale, 'y', targetScale, 0.2, delta);
      maath.easing.damp(floatingGroup.current.scale, 'z', targetScale, 0.2, delta);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation(); 
    setTarget(data.id);
  };

  return (
    <group ref={group} position={[isMobile ? data.position[0] * 0.6 : data.position[0], data.position[1], data.position[2]]}>
      
      <drei.Float speed={2} rotationIntensity={1} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <group 
          ref={floatingGroup}
          onClick={handleClick}
          scale={isMobile ? 0.8 : 1}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        >
          <mesh>
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
        </group>
      </drei.Float>

      <DynamicCable startObjRef={floatingGroup} endPos={ELBOW_POS} color={data.color} />
      <drei.Line points={[ELBOW_POS, END_POS]} color={data.color} lineWidth={1} transparent opacity={0.6} />
      <mesh position={ELBOW_POS}><sphereGeometry args={[0.05]} /><meshBasicMaterial color={data.color} /></mesh>

      <drei.Html position={END_POS} style={{ transform: 'translate3d(10px, -50%, 0)', pointerEvents: 'none' }} zIndexRange={[100, 0]}>
        <div className={`flex flex-col items-start transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-70'} ${isMobile ? 'scale-75 origin-left' : ''}`}>
          <h1 className="text-2xl font-['Orbitron'] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: data.color, textShadow: `0 0 10px ${data.color}40` }}>
            {data.title}
          </h1>
          <div className={`mt-2 w-48 h-28 bg-black border border-cyan-500/50 rounded-sm overflow-hidden relative transition-all duration-300 origin-top-left transform ${hovered ? 'scale-100 opacity-100 h-28' : 'scale-0 opacity-0 h-0'}`} style={{ borderColor: data.color }}>
            <img src={data.image} alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/50 animate-[scan_2s_linear_infinite]" />
          </div>
        </div>
      </drei.Html>
    </group>
  );
}

function HobbyCategory({ position, title, id, color }) {
  const [hovered, setHovered] = useState(false);
  const setTarget = useGameStore((state) => state.setTarget);

  return (
    <group position={position}>
      <drei.Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <mesh 
          onClick={(e) => { e.stopPropagation(); setTarget(id); }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={hovered ? 5 : 2} />
        </mesh>
        <drei.Text position={[0, -2.5, 0]} fontSize={0.8} font="https://fonts.gstatic.com/s/orbitron/v25/yMJRMIlzdpvBhQQL_Qq7dys.woff" color="white" anchorX="center">
          {title}
        </drei.Text>
      </drei.Float>
    </group>
  );
}

export function SceneContent() {
  const scroll = drei.useScroll();
  const setScrolled = useGameStore((state) => state.setScrolled); 
  const settings = useGameStore((state) => state.settings);
  const section = useGameStore((state) => state.section);

  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 8; 

  useFrame((state, delta) => {
    maath.easing.damp3(state.camera.rotation, [(state.pointer.y * Math.PI) / 15, (-state.pointer.x * Math.PI) / 10, 0], 0.25, delta);
    maath.easing.damp3(state.camera.position, [state.camera.position.x, -scroll.offset * 30, 10], 0.2, delta);
    const targetX = section === 'main' ? 0 : -100;
    maath.easing.damp(state.camera.position, 'x', targetX, 0.5, delta);
    const isUserScrolling = scroll.offset > 0.01;
    setScrolled(isUserScrolling);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      
      <group position={[0, 0, 0]}>
        {settings.sun && <Sun />}
        {settings.grid && (
          <drei.Grid position={[0, -4, 0]} args={[100, 100]} cellSize={1} cellThickness={1} cellColor={PORTFOLIO_DATA.colors.neon} sectionSize={5} sectionThickness={1.5} sectionColor={PORTFOLIO_DATA.colors.grid} fadeDistance={30} fadeStrength={1} />
        )}
        {PORTFOLIO_DATA.projects.map((proj) => (
          <ProjectCrystal key={proj.id} data={proj} scroll={scroll} isMobile={isMobile} />
        ))}
        <SpaceShooter />
      </group>

      <group position={isMobile ? [-100, 0, -10] : [-100, 0, 0]}>
        <BlackHole />
        <drei.Text position={[0, 15, -20]} fontSize={5} font="https://fonts.gstatic.com/s/orbitron/v25/yMJRMIlzdpvBhQQL_Qq7dys.woff" color="#FF2A6D" anchorX="center">
          MIS AFICIONES
        </drei.Text>
        <HobbyCategory position={[-10, 5, -10]} title="JUEGOS" id="games" color="#FF2A6D" />
        <HobbyCategory position={[0, -5, -10]} title="PELÍCULAS" id="movies" color="#FF2A6D" />
        <HobbyCategory position={[10, 5, -10]} title="SERIES" id="series" color="#FF2A6D" />
      </group>

      {settings.sparkles && (
        <drei.Sparkles count={200} scale={200} size={4} speed={0.4} opacity={0.5} color="#ffffff" transparent depthWrite={false} toneMapped={false} blending={AdditiveBlending} />
      )}
    </>
  );
}