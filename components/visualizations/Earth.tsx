'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

/**
 * Realistic Earth component with atmospheric glow
 */
export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Rotate Earth slowly
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1e4d8b"
          roughness={0.7}
          metalness={0.2}
          emissive="#0a1f3d"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Atmospheric glow (slightly larger sphere) */}
      <Sphere ref={atmosphereRef} args={[2.15, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Inner atmosphere glow */}
      <Sphere args={[2.08, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#00bcd4"
          transparent
          opacity={0.3}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
}

/**
 * Instructions for adding real Earth textures:
 *
 * 1. Download free Earth textures from:
 *    - NASA Visible Earth: https://visibleearth.nasa.gov/
 *    - Solar System Scope: https://www.solarsystemscope.com/textures/
 *
 * 2. Save textures to /public/textures/:
 *    - earth-day.jpg (main texture)
 *    - earth-night.jpg (city lights)
 *    - earth-clouds.png (cloud layer, optional)
 *
 * 3. Update the Earth component to use TextureLoader:
 *
 * const [dayMap, nightMap] = useLoader(THREE.TextureLoader, [
 *   '/textures/earth-day.jpg',
 *   '/textures/earth-night.jpg'
 * ]);
 *
 * Then use custom shader material for day/night blending
 */
