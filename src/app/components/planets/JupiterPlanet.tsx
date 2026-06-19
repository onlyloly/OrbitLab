import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

export function JupiterPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const stormRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, 160, 160);
    const noise3D = createNoise3D();

    const colors = new Float32Array(geo.attributes.position.count * 3);
    const pos = geo.attributes.position as THREE.BufferAttribute;

    const palette = [
      new THREE.Color("#f3c78a"),
      new THREE.Color("#d9914f"),
      new THREE.Color("#b86a32"),
      new THREE.Color("#f0dfc1"),
      new THREE.Color("#7b3f22"),
    ];

    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();

      const latitude = v.y;
      const wave =
        Math.sin(latitude * 24) * 0.5 +
        Math.sin(latitude * 42 + noise3D(v.x * 2, v.y * 2, v.z * 2) * 1.2) * 0.25;

      const softNoise = (noise3D(v.x * 7, v.y * 7, v.z * 7) + 1) / 2;

      let color: THREE.Color;

      if (wave > 0.35) {
        color = palette[0].clone();
      } else if (wave > 0.05) {
        color = palette[1].clone();
      } else if (wave > -0.25) {
        color = palette[3].clone();
      } else {
        color = palette[2].clone();
      }

      color.lerp(palette[4], softNoise * 0.12);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    return geo;
  }, []);

  const stormGeometry = useMemo(() => {
    return new THREE.SphereGeometry(2.035, 96, 96);
  }, []);

  const stormTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    const gradient = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      10,
      size * 0.5,
      size * 0.5,
      size * 0.28
    );

    gradient.addColorStop(0, "rgba(255, 170, 105, 0.95)");
    gradient.addColorStop(0.35, "rgba(208, 78, 42, 0.75)");
    gradient.addColorStop(0.7, "rgba(150, 52, 35, 0.35)");
    gradient.addColorStop(1, "rgba(150, 52, 35, 0)");

    ctx.fillStyle = gradient;

    ctx.save();
    ctx.translate(size * 0.5, size * 0.5);
    ctx.scale(1.75, 0.65);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const cloudGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2.025, 160, 160);
    const noise3D = createNoise3D();

    const colors = new Float32Array(geo.attributes.position.count * 3);
    const alphas = new Float32Array(geo.attributes.position.count);
    const pos = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();

      const band = Math.sin(v.y * 30 + noise3D(v.x * 4, v.y * 4, v.z * 4) * 0.8);
      const alpha = band > 0.35 ? 0.22 : 0.04;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.86;
      colors[i * 3 + 2] = 0.62;
      alphas[i] = alpha;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.16;
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.22;
    }

    if (stormRef.current) {
      stormRef.current.rotation.y = t * 0.16;
    }
  });

  return (
    <group>
      <mesh scale={1.16}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#f4a35f"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.72}
          metalness={0.02}
        />
      </mesh>

      <mesh ref={cloudRef} geometry={cloudGeometry}>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={0.18}
          roughness={0.9}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={stormRef} position={[0.72, -0.22, 1.9]} rotation={[0, 0, -0.08]}>
        <circleGeometry args={[0.38, 96]} />
        <meshBasicMaterial
          map={stormTexture}
          transparent
          opacity={0.9}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#ffb56b" intensity={1.5} distance={10} />
    </group>
  );
}