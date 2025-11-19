import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // Importamos useThree
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../store/Assets';

const BULLET_COUNT = 100;
const BULLET_SPEED = 3; // Subimos un poco la velocidad para que se sienta mejor

export function SpaceShooter() {
  // Obtenemos el puntero (mouse) y la cámara directamente del estado de Three
  const { camera, raycaster, pointer, scene } = useThree();
  
  const [bullets] = useState(() => new Array(BULLET_COUNT).fill({ life: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3() }));
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const handleClick = () => {
      raycaster.setFromCamera(pointer, camera);
      
      // 2. SPAWN DE BALA
      const bullet = bullets.find(b => b.life <= 0);
      if (bullet) {
        bullet.life = 100;
        bullet.pos.copy(camera.position);
        bullet.pos.y -= 0.2; 
        
        // En lugar de usar la dirección de la cámara, usamos la dirección del Rayo del mouse.
        bullet.vel.copy(raycaster.ray.direction);
      }

      // 3. DETECCION DE IMPACTO (Usando el mismo rayo preciso)
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find(i => i.object.userData.isTarget);
      
      if (hit) {
        useGameStore.getState().setTarget(hit.object.userData.projectId);
        useGameStore.getState().addScore();
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [camera, bullets, raycaster, scene, pointer]);

  useFrame(() => {
    bullets.forEach((bullet, i) => {
      if (bullet.life > 0) {
        bullet.pos.addScaledVector(bullet.vel, BULLET_SPEED);
        bullet.life--;

        dummy.position.copy(bullet.pos);
        dummy.scale.setScalar(0.2);
        dummy.lookAt(bullet.pos.clone().add(bullet.vel));
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, BULLET_COUNT]}>
      <boxGeometry args={[0.1, 0.1, 1.5]} /> {/* Balas más finas y largas (láser) */}
      <meshBasicMaterial color={PORTFOLIO_DATA.colors.neon} toneMapped={false} />
    </instancedMesh>
  );
}