import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export function MoonPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

const geometry = useMemo(() => {
  const geo = new THREE.SphereGeometry(2, 128, 128);
  const noise3D = createNoise3D();
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const n = v.clone().normalize();

    const displacement =
      noise3D(n.x * 6, n.y * 6, n.z * 6) * 0.012 +
      noise3D(n.x * 18, n.y * 18, n.z * 18) * 0.004;

    v.addScaledVector(n, displacement);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}, []);
  const vertexColors = useMemo(() => {
    const noise3D = createNoise3D();
    const colors = new Float32Array(geometry.attributes.position.count * 3);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      const n = (noise3D(v.x * 4, v.y * 4, v.z * 4) + 1) / 2;
      const base = 0.5 + n * 0.25;
      colors[i*3] = base * 0.82;
      colors[i*3+1] = base * 0.82;
      colors[i*3+2] = base * 0.9;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return colors;
  }, [geometry]);

  const dustParticles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.3 + Math.random() * 0.6;
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  void vertexColors;

  return (
    <group>
      {/* Subtle atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#c0c0d8" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.95}
          metalness={0.0}
          envMapIntensity={0.3}
        />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#c8c8e0"
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <pointLight color="#c8d0e8" intensity={1.5} distance={8} />
    </group>
  );
}
