import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export function NovaPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);

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

  useMemo(() => {
    const noise3D = createNoise3D();
    const colors = new Float32Array(geometry.attributes.position.count * 3);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      const n1 = (noise3D(v.x*4, v.y*4, v.z*4) + 1) / 2;
      const n2 = (noise3D(v.x*9, v.y*9, v.z*9) + 1) / 2;
      const blend = n1 * 0.7 + n2 * 0.3;
      colors[i*3] = 0.4 + blend * 0.35;      // purple-cyan
      colors[i*3+1] = 0.08 + blend * 0.3;
      colors[i*3+2] = 0.65 + blend * 0.3;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [geometry]);

  const floatingParticles = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const pColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 2.5;
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      const t = Math.random();
      if (t < 0.5) {
        pColors[i*3] = 0.55; pColors[i*3+1] = 0.15; pColors[i*3+2] = 0.9;
      } else {
        pColors[i*3] = 0.05; pColors[i*3+1] = 0.7; pColors[i*3+2] = 0.85;
      }
    }
    return { positions, pColors };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * 0.07;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.08;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.05;
    if (ring3Ref.current) { ring3Ref.current.rotation.z = t * 0.035; ring3Ref.current.rotation.x = t * 0.02; }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.04;
      particlesRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (glowRef.current) {
      const pulse = 1.15 + Math.sin(t * 1.5) * 0.03;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.15}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.25}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.3} metalness={0.5} envMapIntensity={0.8} />
      </mesh>

      {/* Neon rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.75, 256]} />
        <meshBasicMaterial color="#8b5cf6" side={THREE.DoubleSide} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0.3, 0]}>
        <ringGeometry args={[3.1, 3.2, 256]} />
        <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 6, -0.5, 0.2]}>
        <ringGeometry args={[3.5, 3.55, 256]} />
        <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[floatingParticles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[floatingParticles.pColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <pointLight color="#8b5cf6" intensity={2.5} distance={12} />
      <pointLight color="#06b6d4" intensity={1.5} distance={8} position={[3, 2, 1]} />
    </group>
  );
}
