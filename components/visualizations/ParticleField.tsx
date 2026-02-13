'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PHYSICS_CONSTANTS } from '@/lib/physics';
import { Earth } from './Earth';
import { SpaceEnvironment, SpaceDust } from './SpaceEnvironment';

interface ParticleFieldProps {
  refs: {
    thetaRef: React.MutableRefObject<number>;
    velocityRef: React.MutableRefObject<number>;
    radiusRef: React.MutableRefObject<number>;
    isPlayingRef: React.MutableRefObject<boolean>;
  };
  viewMode: '2D' | '3D';
}

/**
 * Subtle orbit path - thin glowing line
 */
function OrbitPath({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          radius * Math.cos(theta),
          0,
          radius * Math.sin(theta)
        )
      );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: '#00d9ff',
      transparent: true,
      opacity: 0.25,
    });

    return new THREE.Line(geometry, material);
  }, [radius]);

  return <primitive object={line} />;
}

/**
 * Vector arrow component
 */
function VectorArrow({
  start,
  direction,
  color,
  length
}: {
  start: THREE.Vector3;
  direction: THREE.Vector3;
  color: string;
  length: number;
}) {
  const arrowRef = useRef<THREE.Group>(null);

  useMemo(() => {
    if (arrowRef.current) {
      const normalizedDir = direction.clone().normalize();
      const end = start.clone().add(normalizedDir.multiplyScalar(length));

      // Position arrow
      arrowRef.current.position.copy(start);

      // Orient arrow to point in direction
      arrowRef.current.lookAt(end);
    }
  }, [start, direction, length]);

  return (
    <group ref={arrowRef}>
      {/* Arrow shaft */}
      <mesh position={[0, 0, length / 2]}>
        <cylinderGeometry args={[0.05, 0.05, length, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, 0, length]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Main Particle Field visualization component
 */
export function ParticleField({ refs, viewMode }: ParticleFieldProps) {
  // Same visuals for both 2D and 3D - only camera changes
  const orbitingObjectRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Animation loop (60 FPS)
  useFrame((state, delta) => {
    if (!refs.isPlayingRef.current) return;

    // Update theta based on angular velocity
    // ω = v / R (radians per second)
    const omega = refs.velocityRef.current / refs.radiusRef.current;
    refs.thetaRef.current += omega * delta;

    // Keep theta in range [0, 2π]
    if (refs.thetaRef.current > 2 * Math.PI) {
      refs.thetaRef.current -= 2 * Math.PI;
    }
  });

  // Update object position every frame (uses current ref values)
  useFrame(() => {
    if (!orbitingObjectRef.current) return;

    const theta = refs.thetaRef.current;
    const radius = refs.radiusRef.current;

    // Calculate position
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);

    orbitingObjectRef.current.position.set(x, 0, z);
  });

  // Calculate current physics for vectors
  const currentPosition = useMemo(() => {
    const theta = refs.thetaRef.current;
    const radius = refs.radiusRef.current;
    return new THREE.Vector3(
      radius * Math.cos(theta),
      0,
      radius * Math.sin(theta)
    );
  }, [refs.thetaRef.current, refs.radiusRef.current]);

  const velocityVector = useMemo(() => {
    const theta = refs.thetaRef.current;
    const velocity = refs.velocityRef.current;
    return new THREE.Vector3(
      -velocity * Math.sin(theta),
      0,
      velocity * Math.cos(theta)
    );
  }, [refs.thetaRef.current, refs.velocityRef.current]);

  const accelerationVector = useMemo(() => {
    const theta = refs.thetaRef.current;
    const velocity = refs.velocityRef.current;
    const radius = refs.radiusRef.current;
    const a = (velocity * velocity) / radius;
    return new THREE.Vector3(
      -a * Math.cos(theta),
      0,
      -a * Math.sin(theta)
    );
  }, [refs.thetaRef.current, refs.velocityRef.current, refs.radiusRef.current]);

  return (
    <group ref={groupRef}>
      {/* Space environment - only in 3D mode */}
      {viewMode === '3D' && (
        <>
          <SpaceEnvironment />
          <SpaceDust count={500} />
        </>
      )}

      {/* Lighting - Sun simulation */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[30, 0, 0]}
        intensity={2}
        color="#fff5e6"
        castShadow
      />
      {/* Fill light from opposite side */}
      <directionalLight position={[-10, 5, -5]} intensity={0.3} color="#4fc3f7" />

      {/* Orbit path - subtle glow */}
      <OrbitPath radius={refs.radiusRef.current} />

      {/* Central body - Realistic Earth */}
      <Earth />

      {/* Orbiting satellite */}
      <mesh ref={orbitingObjectRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Velocity vector (cyan) */}
      <VectorArrow
        start={currentPosition}
        direction={velocityVector}
        color="#00ffff"
        length={PHYSICS_CONSTANTS.ARROW_LENGTH_SCALE}
      />

      {/* Acceleration vector (magenta) */}
      <VectorArrow
        start={currentPosition}
        direction={accelerationVector}
        color="#ff00aa"
        length={PHYSICS_CONSTANTS.ARROW_LENGTH_SCALE}
      />
    </group>
  );
}
