'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PHYSICS_CONSTANTS } from '@/lib/physics';

interface View2DProps {
  refs: {
    thetaRef: React.MutableRefObject<number>;
    velocityRef: React.MutableRefObject<number>;
    radiusRef: React.MutableRefObject<number>;
    isPlayingRef: React.MutableRefObject<boolean>;
  };
}

/**
 * Grid floor for 2D view
 */
function Grid2D() {
  return (
    <gridHelper args={[100, 50, '#666666', '#333333']} rotation={[0, 0, 0]} />
  );
}

/**
 * Angle arc showing θ from center to object
 */
function AngleArc({ theta, radius }: { theta: number; radius: number }) {
  const arcLine = useMemo(() => {
    const points = [];
    const arcRadius = Math.min(radius * 0.3, 3);
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * theta;
      points.push(new THREE.Vector3(arcRadius * Math.cos(angle), 0.1, arcRadius * Math.sin(angle)));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#ffaa00', linewidth: 2 }));
  }, [theta, radius]);

  const refLine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(radius, 0.1, 0),
    ]);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#666666', linewidth: 1, opacity: 0.5, transparent: true }));
  }, [radius]);

  const radialLine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(radius * Math.cos(theta), 0.1, radius * Math.sin(theta)),
    ]);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#ffaa00', linewidth: 2, opacity: 0.7, transparent: true }));
  }, [theta, radius]);

  return (
    <group>
      <primitive object={arcLine} />
      <primitive object={refLine} />
      <primitive object={radialLine} />
    </group>
  );
}

/**
 * Orbit path circle
 */
function OrbitCircle({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          0.05,
          radius * Math.sin(angle)
        )
      );
    }
    return pts;
  }, [radius]);

  const orbitLine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#00d9ff', transparent: true, opacity: 0.6, linewidth: 2 }));
  }, [points]);

  return <primitive object={orbitLine} />;
}

/**
 * Vector arrow for 2D view
 */
function VectorArrow2D({
  start,
  direction,
  color,
  length,
}: {
  start: THREE.Vector3;
  direction: THREE.Vector3;
  color: string;
  length: number;
}) {
  const end = useMemo(() => {
    const normalizedDir = direction.clone().normalize();
    return start.clone().add(normalizedDir.multiplyScalar(length));
  }, [start, direction, length]);

  const shaftLine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.x, 0.2, start.z),
      new THREE.Vector3(end.x, 0.2, end.z),
    ]);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, linewidth: 3 }));
  }, [start, end, color]);

  return (
    <group>
      <primitive object={shaftLine} />
      <mesh position={[end.x, 0.2, end.z]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * 2D top-down view visualization
 */
export function View2D({ refs }: View2DProps) {
  const orbitingObjectRef = useRef<THREE.Mesh>(null);

  // Animation loop
  useFrame((_state, delta) => {
    if (!refs.isPlayingRef.current) return;

    const omega = refs.velocityRef.current / refs.radiusRef.current;
    refs.thetaRef.current += omega * delta;

    if (refs.thetaRef.current > 2 * Math.PI) {
      refs.thetaRef.current -= 2 * Math.PI;
    }
  });

  // Update object position
  useFrame(() => {
    if (!orbitingObjectRef.current) return;

    const theta = refs.thetaRef.current;
    const radius = refs.radiusRef.current;

    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);

    orbitingObjectRef.current.position.set(x, 0.3, z);
  });

  // Calculate current vectors
  const currentPosition = useMemo(() => {
    const theta = refs.thetaRef.current;
    const radius = refs.radiusRef.current;
    return new THREE.Vector3(
      radius * Math.cos(theta),
      0.3,
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
    return new THREE.Vector3(-a * Math.cos(theta), 0, -a * Math.sin(theta));
  }, [refs.thetaRef.current, refs.velocityRef.current, refs.radiusRef.current]);

  return (
    <group>
      {/* Lighting for 2D view */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />

      {/* Grid */}
      <Grid2D />

      {/* Orbit circle */}
      <OrbitCircle radius={refs.radiusRef.current} />

      {/* Angle arc */}
      <AngleArc
        theta={refs.thetaRef.current}
        radius={refs.radiusRef.current}
      />

      {/* Central body */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#4a90e2"
          emissive="#1e3a5f"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Orbiting object */}
      <mesh ref={orbitingObjectRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Velocity vector (cyan) */}
      <VectorArrow2D
        start={currentPosition}
        direction={velocityVector}
        color="#00ffff"
        length={PHYSICS_CONSTANTS.ARROW_LENGTH_SCALE}
      />

      {/* Acceleration vector (magenta) */}
      <VectorArrow2D
        start={currentPosition}
        direction={accelerationVector}
        color="#ff00aa"
        length={PHYSICS_CONSTANTS.ARROW_LENGTH_SCALE}
      />

      {/* Axis labels (optional) */}
      <mesh position={[refs.radiusRef.current + 2, 0.1, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
