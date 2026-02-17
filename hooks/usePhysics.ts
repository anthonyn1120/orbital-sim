'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  calculateOrbitalPhysics,
  PHYSICS_CONSTANTS,
  type PhysicsResult
} from '@/lib/physics';

/**
 * Physics state management hook
 *
 * Uses refs for animation values (60 FPS) and state for UI updates (10 FPS)
 * This pattern prevents React re-render performance issues
 */
export function usePhysics() {
  // Animation values (refs - no re-renders)
  const thetaRef = useRef(PHYSICS_CONSTANTS.DEFAULT_THETA);
  const velocityRef = useRef(PHYSICS_CONSTANTS.DEFAULT_VELOCITY);
  const radiusRef = useRef(PHYSICS_CONSTANTS.DEFAULT_RADIUS);
  const isPlayingRef = useRef(false);

  // UI display values (state - triggers re-renders at controlled rate)
  const [displayValues, setDisplayValues] = useState<PhysicsResult>(() =>
    calculateOrbitalPhysics(
      PHYSICS_CONSTANTS.DEFAULT_THETA,
      PHYSICS_CONSTANTS.DEFAULT_VELOCITY,
      PHYSICS_CONSTANTS.DEFAULT_RADIUS
    )
  );

  // Control values for sliders (state - user input)
  const [theta, setTheta] = useState<number>(PHYSICS_CONSTANTS.DEFAULT_THETA);
  const [velocity, setVelocity] = useState<number>(PHYSICS_CONSTANTS.DEFAULT_VELOCITY);
  const [radius, setRadius] = useState<number>(PHYSICS_CONSTANTS.DEFAULT_RADIUS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // View mode (2D or 3D)
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');

  // Sync refs when control values change
  useEffect(() => {
    thetaRef.current = theta;
  }, [theta]);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    radiusRef.current = radius;
  }, [radius]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Update display values (called periodically, not every frame)
  const updateDisplay = useCallback(() => {
    const physics = calculateOrbitalPhysics(
      thetaRef.current,
      velocityRef.current,
      radiusRef.current
    );
    setDisplayValues(physics);

    // Sync control theta with animation theta when playing
    if (isPlayingRef.current) {
      setTheta(thetaRef.current);
    }
  }, []);

  // Periodic UI update (10 FPS)
  useEffect(() => {
    const interval = setInterval(
      updateDisplay,
      PHYSICS_CONSTANTS.UI_UPDATE_INTERVAL
    );
    return () => clearInterval(interval);
  }, [updateDisplay]);

  // Properly typed setter functions
  const handleSetTheta = useCallback((value: number) => {
    setTheta(value);
  }, []);

  const handleSetVelocity = useCallback((value: number) => {
    setVelocity(value);
  }, []);

  const handleSetRadius = useCallback((value: number) => {
    setRadius(value);
  }, []);

  // Control functions
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setTheta(PHYSICS_CONSTANTS.DEFAULT_THETA);
    setVelocity(PHYSICS_CONSTANTS.DEFAULT_VELOCITY);
    setRadius(PHYSICS_CONSTANTS.DEFAULT_RADIUS);
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === '2D' ? '3D' : '2D');
  }, []);

  return {
    // Refs for animation loop (60 FPS)
    refs: {
      thetaRef,
      velocityRef,
      radiusRef,
      isPlayingRef
    },
    // State values for UI controls
    controls: {
      theta,
      velocity,
      radius,
      isPlaying,
      setTheta: handleSetTheta,
      setVelocity: handleSetVelocity,
      setRadius: handleSetRadius
    },
    // Calculated physics for display
    displayValues,
    // Control functions
    play,
    pause,
    reset,
    togglePlayPause,
    updateDisplay,
    // View mode
    viewMode,
    toggleViewMode
  };
}
