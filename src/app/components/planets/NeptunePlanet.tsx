import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export function NeptunePlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloud1Ref = useRef<THREE.Mesh>(null);
  const cloud2Ref = useRef<THREE.Mesh>(null);

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
      const n = (noise3D(v.x*5, v.y*5, v.z*5) + 1) / 2;
      const band = (Math.sin(v.y * 8 + n * 3) + 1) / 2;
      colors[i*3] = 0.05 + band * 0.08;
      colors[i*3+1] = 0.2 + n * 0.2 + band * 0.1;
      colors[i*3+2] = 0.65 + n * 0.25;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [geometry]);

  const cloudGeo1 = useMemo(() => {
    const geo = new THREE.SphereGeometry(2.06, 48, 48);
    const noise3D = createNoise3D();
    const colors = new Float32Array(geo.attributes.position.count * 3);
    const alphas = new Float32Array(geo.attributes.position.count);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      const n = (noise3D(v.x*6, v.y*6+1, v.z*6) + 1) / 2;
      colors[i*3] = 0.3; colors[i*3+1] = 0.5; colors[i*3+2] = 0.9;
      alphas[i] = n > 0.55 ? (n - 0.55) * 2.2 : 0;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * 0.1;
    if (cloud1Ref.current) cloud1Ref.current.rotation.y = t * 0.14;
    if (cloud2Ref.current) cloud2Ref.current.rotation.y = -t * 0.07;
  });

  void cloudGeo1;

  return (
    <group>
      {/* Deep glow */}
      <mesh scale={1.18}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#1040c0" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#2060e0" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Cloud layer 1 */}
      <mesh ref={cloud1Ref} scale={1.035}>
        <sphereGeometry args={[2, 48, 48]} />
        <meshBasicMaterial color="#4080f0" transparent opacity={0.07} side={THREE.FrontSide} depthWrite={false} />
      </mesh>

      {/* Cloud layer 2 */}
      <mesh ref={cloud2Ref} scale={1.055}>
        <sphereGeometry args={[2, 48, 48]} />
        <meshBasicMaterial color="#2050d0" transparent opacity={0.05} side={THREE.FrontSide} depthWrite={false} />
      </mesh>

      <pointLight color="#3070ff" intensity={1.6} distance={10} />
    </group>
  );
}
