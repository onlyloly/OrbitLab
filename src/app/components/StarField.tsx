import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  mouseX: number;
  mouseY: number;
}

export function StarField({ mouseX, mouseY }: StarFieldProps) {
  const starsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);

  const { starPositions, starColors } = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 80 + Math.random() * 120;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      if (t < 0.1) { colors[i*3]=0.5; colors[i*3+1]=0.6; colors[i*3+2]=1.0; }
      else if (t < 0.15) { colors[i*3]=1.0; colors[i*3+1]=0.8; colors[i*3+2]=0.6; }
      else { colors[i*3]=0.9; colors[i*3+1]=0.9; colors[i*3+2]=1.0; }
    }
    return { starPositions: positions, starColors: colors };
  }, []);

  const nebulaData = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const cluster = Math.floor(Math.random() * 3);
      const cx = [-60, 50, 20][cluster];
      const cy = [30, -20, -40][cluster];
      const cz = [-80, -60, -100][cluster];
      positions[i*3] = cx + (Math.random() - 0.5) * 50;
      positions[i*3+1] = cy + (Math.random() - 0.5) * 30;
      positions[i*3+2] = cz + (Math.random() - 0.5) * 20;
      const palettes = [[0.35, 0.18, 0.6], [0.1, 0.5, 0.7], [0.6, 0.2, 0.5]];
      const p = palettes[cluster];
      colors[i*3] = p[0] + Math.random() * 0.15;
      colors[i*3+1] = p[1] + Math.random() * 0.15;
      colors[i*3+2] = p[2] + Math.random() * 0.2;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.008 + mouseX * 0.02;
      starsRef.current.rotation.x = mouseY * 0.01;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = t * 0.004 + mouseX * 0.015;
      nebulaRef.current.rotation.x = mouseY * 0.008;
    }
  });

  return (
    <group>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.8}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nebulaData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nebulaData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={2.5}
          sizeAttenuation
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
