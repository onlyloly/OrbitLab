import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export function SaturnPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, 64, 64);
    const noise3D = createNoise3D();
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const n = v.clone().normalize();
     const displacement =
      noise3D(n.x * 6, n.y * 6, n.z * 6) * 0.012 +
      noise3D(n.x * 18, n.y * 18, n.z * 18) * 0.004;
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
      const band = (Math.sin(v.y * 12) + 1) / 2;
      const n = (noise3D(v.x * 6, v.y * 6, v.z * 6) + 1) / 2;
      const warm = band * 0.3 + n * 0.1;
      colors[i*3] = 0.65 + warm * 0.25;
      colors[i*3+1] = 0.52 + warm * 0.2;
      colors[i*3+2] = 0.25 + warm * 0.05;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [geometry]);

  const ringGeometry = useMemo(() => {
    const geo = new THREE.RingGeometry(2.8, 5.2, 256, 4);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i);
      const band = Math.sin(u * 40) * 0.5 + 0.5;
      const opacity = 0.4 + band * 0.4;
      colors[i*3] = (0.7 + band * 0.2) * opacity;
      colors[i*3+1] = (0.6 + band * 0.15) * opacity;
      colors[i*3+2] = (0.35 + band * 0.05) * opacity;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * 0.12;
    if (ringsRef.current) ringsRef.current.rotation.z = t * 0.015;
    if (innerRingRef.current) innerRingRef.current.rotation.z = -t * 0.02;
  });

  return (
    <group rotation={[0.4, 0, 0.15]}>
      {/* Atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#e8c870" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Main rings */}
      <mesh ref={ringsRef} geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial vertexColors side={THREE.DoubleSide} transparent opacity={0.85} depthWrite={false} />
      </mesh>

      {/* Inner bright ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.65, 2.85, 256]} />
        <meshBasicMaterial color="#f0d890" side={THREE.DoubleSide} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      <pointLight color="#f0d080" intensity={1.4} distance={12} />
    </group>
  );
}
