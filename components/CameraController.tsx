'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  viewMode: '2D' | '3D';
}

/**
 * Smooth camera transitions between 2D and 3D views
 */
export function CameraController({ viewMode }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(new THREE.Euler());
  const isTransitioning = useRef(false);

  useEffect(() => {
    isTransitioning.current = true;

    if (viewMode === '2D') {
      // Top-down view position - directly above
      targetPosition.current.set(0, 35, 0);
      targetRotation.current.set(-Math.PI / 2, 0, 0);

      // Also update camera lookAt to ensure it's pointing down
      camera.lookAt(0, 0, 0);
    } else {
      // 3D perspective view position - angled view
      targetPosition.current.set(15, 10, 15);
      // Camera will naturally look at center due to OrbitControls
    }
  }, [viewMode, camera]);

  useFrame(() => {
    // In 2D mode, always control camera (locked top-down view)
    if (viewMode === '2D') {
      camera.position.lerp(targetPosition.current, 0.08);
      camera.lookAt(0, 0, 0);

      // Check if transition is complete
      if (isTransitioning.current) {
        const positionDistance = camera.position.distanceTo(
          targetPosition.current
        );
        if (positionDistance < 0.1) {
          isTransitioning.current = false;
        }
      }
    }
    // In 3D mode, only control camera during transition
    else if (isTransitioning.current) {
      camera.position.lerp(targetPosition.current, 0.08);

      const positionDistance = camera.position.distanceTo(
        targetPosition.current
      );
      if (positionDistance < 0.5) {
        isTransitioning.current = false;
        // Transition complete - OrbitControls takes over
      }
    }
    // In 3D mode after transition, do nothing - let OrbitControls handle it
  });

  return null;
}
