/**
 * Core Physics Module
 * Implements centripetal acceleration calculations for circular orbital motion
 */

export interface PhysicsState {
  theta: number;      // angle in radians
  velocity: number;   // tangential velocity in m/s
  radius: number;     // orbital radius in meters
  isPlaying: boolean; // animation state
}

export interface PhysicsResult {
  position: { x: number; y: number; z: number };
  velocityVector: { x: number; y: number; z: number };
  acceleration: number;
  accelerationVector: { x: number; y: number; z: number };
  period: number;
  angularVelocity: number;
}

/**
 * Calculate all orbital physics for a given state
 *
 * Core equation: a = v² / R (centripetal acceleration)
 *
 * Coordinate system: Orbit in XZ plane, Y axis points up
 * Angle θ measured from +X axis, counterclockwise when viewed from +Y
 */
export function calculateOrbitalPhysics(
  theta: number,
  velocity: number,
  radius: number
): PhysicsResult {
  // Position: Convert polar (r, θ) to cartesian (x, y, z)
  // Orbit is in XZ plane (y = 0)
  const position = {
    x: radius * Math.cos(theta),
    y: 0,
    z: radius * Math.sin(theta)
  };

  // Velocity vector: Tangent to circle (perpendicular to radius)
  // Magnitude = velocity, direction = perpendicular to position vector
  const velocityVector = {
    x: -velocity * Math.sin(theta),
    y: 0,
    z: velocity * Math.cos(theta)
  };

  // Centripetal acceleration magnitude: a = v² / R
  const acceleration = (velocity * velocity) / radius;

  // Acceleration vector: Points toward center (opposite to position)
  // Magnitude = acceleration, direction = -r̂ (toward origin)
  const accelerationVector = {
    x: -acceleration * Math.cos(theta),
    y: 0,
    z: -acceleration * Math.sin(theta)
  };

  // Orbital period: T = 2πR / v
  const period = (2 * Math.PI * radius) / velocity;

  // Angular velocity: ω = v / R (radians per second)
  const angularVelocity = velocity / radius;

  return {
    position,
    velocityVector,
    acceleration,
    accelerationVector,
    period,
    angularVelocity
  };
}

/**
 * Constants for physics simulation
 */
export const PHYSICS_CONSTANTS = {
  MIN_VELOCITY: 1,
  MAX_VELOCITY: 15,
  DEFAULT_VELOCITY: 5,

  MIN_RADIUS: 5,
  MAX_RADIUS: 30,
  DEFAULT_RADIUS: 10,

  MIN_THETA: 0,
  MAX_THETA: 2 * Math.PI,
  DEFAULT_THETA: 0,

  UI_UPDATE_INTERVAL: 100, // milliseconds (10 FPS for UI updates)
  PARTICLE_COUNT: 2000,     // background particles
  ARROW_LENGTH_SCALE: 2,    // visual scaling for vector arrows
} as const;
