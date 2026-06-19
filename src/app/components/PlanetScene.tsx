import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField } from './StarField';
import { MoonPlanet } from './planets/MoonPlanet';
import { MarsPlanet } from './planets/MarsPlanet';
import { SaturnPlanet } from './planets/SaturnPlanet';
import { NeptunePlanet } from './planets/NeptunePlanet';
import { JupiterPlanet } from './planets/JupiterPlanet';
import { NovaPlanet } from './planets/NovaPlanet';
import type { PlanetId } from './planetData';

interface PlanetSceneProps {
  activePlanet: PlanetId;
  mouseX: number;
  mouseY: number;
  transitioning: boolean;
}

const PLANET_COMPONENTS: Record<PlanetId, React.ComponentType> = {
  moon: MoonPlanet,
  mars: MarsPlanet,
  saturn: SaturnPlanet,
  neptune: NeptunePlanet,
  jupiter: JupiterPlanet,
  nova: NovaPlanet,
};

function PlanetMesh({
  activePlanet,
  transitioning,
  mouseX,
  mouseY,
}: {
  activePlanet: PlanetId;
  transitioning: boolean;
  mouseX: number;
  mouseY: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const rotRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const targetScale = useRef(1);
  const posZ = useRef(0);
  const targetPosZ = useRef(0);
  const opacityRef = useRef(1);
  const targetOpacity = useRef(1);
  const { gl } = useThree();

  useEffect(() => {
    if (transitioning) {
      targetPosZ.current = -8;
      targetOpacity.current = 0;
      targetScale.current = 0.6;
    } else {
      posZ.current = 6;
      scaleRef.current = 0.6;
      opacityRef.current = 0;
      targetPosZ.current = 0;
      targetOpacity.current = 1;
      targetScale.current = 1;
    }
  }, [transitioning, activePlanet]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      velRef.current.x = dy * 0.005;
      velRef.current.y = dx * 0.005;
      rotRef.current.x += dy * 0.005;
      rotRef.current.y += dx * 0.005;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging.current = false; };

    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      velRef.current.x = dy * 0.005;
      velRef.current.y = dx * 0.005;
      rotRef.current.x += dy * 0.005;
      rotRef.current.y += dx * 0.005;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging.current = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      velRef.current.x *= 0.95;
      velRef.current.y *= 0.95;
      rotRef.current.x += velRef.current.x;
      rotRef.current.y += velRef.current.y;
    }

    const floatY = Math.sin(Date.now() * 0.0008) * 0.06;
    const floatX = Math.sin(Date.now() * 0.0005) * 0.03;

    groupRef.current.rotation.x = rotRef.current.x + floatX + mouseY * 0.08;
    groupRef.current.rotation.y = rotRef.current.y + mouseX * 0.08;

    posZ.current += (targetPosZ.current - posZ.current) * 0.08;
    scaleRef.current += (targetScale.current - scaleRef.current) * 0.08;
    opacityRef.current += (targetOpacity.current - opacityRef.current) * 0.08;

    groupRef.current.position.z = posZ.current;
    groupRef.current.position.y = floatY;
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  const PlanetComponent = PLANET_COMPONENTS[activePlanet];

  return (
    <group ref={groupRef}>
      <PlanetComponent />
    </group>
  );
}

function CameraRig({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera, gl } = useThree();
  const targetZ = useRef(6);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZ.current = Math.max(3.5, Math.min(10, targetZ.current + e.deltaY * 0.005));
    };
    gl.domElement.addEventListener('wheel', onWheel, { passive: false });
    return () => gl.domElement.removeEventListener('wheel', onWheel);
  }, [gl]);

  useFrame(() => {
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.04;
    camera.position.z += (targetZ.current - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Lighting({ activePlanet }: { activePlanet: PlanetId }) {
  const colors: Record<PlanetId, string> = {
    moon: '#e8eaf6',
    mars: '#ff6030',
    saturn: '#f0d080',
    neptune: '#4080ff',
    jupiter: '#e09040',
    nova: '#8b5cf6',
  };

  return (
    <>
      <ambientLight color="#1a1a3a" intensity={0.6} />
      <directionalLight
        color={colors[activePlanet]}
        intensity={2.5}
        position={[5, 3, 5]}
        castShadow
      />
      <pointLight color="#ffffff" intensity={0.5} position={[-4, 2, -3]} />
    </>
  );
}

export function PlanetScene({ activePlanet, mouseX, mouseY, transitioning }: PlanetSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Lighting activePlanet={activePlanet} />
      <CameraRig mouseX={mouseX} mouseY={mouseY} />
      <StarField mouseX={mouseX} mouseY={mouseY} />
      <PlanetMesh
        activePlanet={activePlanet}
        transitioning={transitioning}
        mouseX={mouseX}
        mouseY={mouseY}
      />
    </Canvas>
  );
}
