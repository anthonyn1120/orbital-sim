'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

/**
 * Distant planets in background
 */
function DistantPlanets() {
  const mars = useRef<THREE.Mesh>(null);
  const saturn = useRef<THREE.Mesh>(null);
  const neptune = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (mars.current) mars.current.rotation.y += delta * 0.1;
    if (saturn.current) saturn.current.rotation.y += delta * 0.08;
    if (neptune.current) neptune.current.rotation.y += delta * 0.06;
  });

  return (
    <group>
      {/* Mars-like planet */}
      <mesh ref={mars} position={[-60, 20, -80]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#cd5c5c"
          emissive="#8b4513"
          emissiveIntensity={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Saturn-like planet */}
      <mesh ref={saturn} position={[70, -15, -90]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#f4e7c3"
          emissive="#daa520"
          emissiveIntensity={0.15}
          roughness={0.7}
        />
      </mesh>

      {/* Neptune-like planet */}
      <mesh ref={neptune} position={[-50, -30, -100]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#4169e1"
          emissive="#1e3a8a"
          emissiveIntensity={0.3}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * Distant sun with glow
 */
function DistantSun() {
  return (
    <group position={[100, 30, -120]}>
      {/* Core sun */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#fff5e6" />
      </mesh>

      {/* Glow layers */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#ffeb99"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color="#ffd966"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * Floating asteroids/debris
 */
function SpaceDebris({ count = 50 }: { count?: number }) {
  const debris = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 80 + 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      items.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ] as [number, number, number],
        size: Math.random() * 0.2 + 0.1,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
      });
    }
    return items;
  }, [count]);

  return (
    <group>
      {debris.map((item, i) => (
        <mesh key={i} position={item.position}>
          <dodecahedronGeometry args={[item.size, 0]} />
          <meshStandardMaterial
            color="#696969"
            emissive="#2f2f2f"
            emissiveIntensity={0.1}
            roughness={0.9}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Deep space background with stars and nebula
 */
export function SpaceEnvironment() {
  return (
    <>
      {/* Dense star field - multiple layers */}
      <Stars
        radius={100}
        depth={50}
        count={8000}
        factor={5}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Additional smaller, brighter stars */}
      <Stars
        radius={80}
        depth={40}
        count={2000}
        factor={2}
        saturation={0.2}
        fade
        speed={0.1}
      />

      {/* Nebula cloud effect */}
      <NebulaCloud />

      {/* Distant planets */}
      <DistantPlanets />

      {/* Distant sun */}
      <DistantSun />

      {/* Space debris */}
      <SpaceDebris count={50} />
    </>
  );
}

/**
 * Subtle blue nebula glow in background
 */
function NebulaCloud() {
  const nebulaRef = useRef<THREE.Mesh>(null);

  // Subtle rotation for dynamic feel
  useFrame((state, delta) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += delta * 0.01;
    }
  });

  const nebulaGeometry = useMemo(() => {
    return new THREE.SphereGeometry(80, 32, 32);
  }, []);

  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#0d1b2a') },
        color2: { value: new THREE.Color('#1e3a5f') },
        color3: { value: new THREE.Color('#00b4d8') },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec3 vPosition;

        // Simple noise function
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
        }

        void main() {
          vec3 pos = vPosition * 0.1;

          // Create nebula-like patterns
          float n1 = noise(pos * 2.0);
          float n2 = noise(pos * 4.0 + vec3(100.0));
          float n3 = noise(pos * 8.0 + vec3(200.0));

          float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

          // Mix colors based on noise
          vec3 color = mix(color1, color2, nebula);
          color = mix(color, color3, n2 * 0.3);

          // Fade based on position
          float alpha = nebula * 0.15;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, []);

  return (
    <mesh
      ref={nebulaRef}
      geometry={nebulaGeometry}
      material={nebulaMaterial}
    />
  );
}

/**
 * Floating space dust particles
 */
export function SpaceDust({ count = 1000 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random positions in a large sphere
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Random velocities
      vel[i3] = (Math.random() - 0.5) * 0.1;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.1;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    return [pos, vel];
  }, [count]);

  // Animate dust particles slowly
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] += velocities[i3] * delta;
        pos[i3 + 1] += velocities[i3 + 1] * delta;
        pos[i3 + 2] += velocities[i3 + 2] * delta;

        // Wrap around if too far
        const dist = Math.sqrt(
          pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2
        );
        if (dist > 60) {
          pos[i3] *= 0.5;
          pos[i3 + 1] *= 0.5;
          pos[i3 + 2] *= 0.5;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
