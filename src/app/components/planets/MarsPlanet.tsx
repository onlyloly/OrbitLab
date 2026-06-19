import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export function MarsPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const fogRef = useRef<THREE.Mesh>(null);

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
      const n = (noise3D(v.x * 4, v.y * 4, v.z * 4) + 1) / 2;
      const n2 = (noise3D(v.x * 10, v.y * 10, v.z * 10) + 1) / 2;
      colors[i*3] = 0.65 + n * 0.2 + n2 * 0.05;
      colors[i*3+1] = 0.22 + n * 0.08;
      colors[i*3+2] = 0.05 + n * 0.03;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [geometry]);

  const dustParticles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.1 + Math.random() * 1.2;
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      velocities[i*3] = (Math.random() - 0.5) * 0.01;
      velocities[i*3+1] = (Math.random() - 0.5) * 0.005;
      velocities[i*3+2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions, velocities };
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    if (dustRef.current) {
      dustRef.current.rotation.y = clock.getElapsedTime() * 0.12;
      dustRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
    if (fogRef.current) {
      fogRef.current.rotation.y = -clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group>
      {/* Atmosphere */}
      <mesh scale={1.12}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#c04010" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.06}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#e86030" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Dust storm particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustParticles.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e87040"
          size={0.022}
          sizeAttenuation
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Fog ring */}
      <mesh ref={fogRef} scale={1.18}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#d05020" transparent opacity={0.03} side={THREE.FrontSide} />
      </mesh>

      <pointLight color="#ff6030" intensity={1.2} distance={10} />
    </group>
  );
}
