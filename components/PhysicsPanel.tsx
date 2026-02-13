'use client';

import type { PhysicsResult } from '@/lib/physics';

interface PhysicsPanelProps {
  displayValues: PhysicsResult;
  viewMode: '2D' | '3D';
  currentTheta: number; // For showing angle in degrees in 2D mode
}

export function PhysicsPanel({ displayValues, viewMode, currentTheta }: PhysicsPanelProps) {
  const {
    position,
    velocityVector,
    acceleration,
    accelerationVector,
    period,
    angularVelocity
  } = displayValues;

  // 2D Mode - Simplified physics readout
  if (viewMode === '2D') {
    return (
      <div className="w-full md:w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">
          Physics (2D View)
        </h2>

        <div className="space-y-6 text-sm">
          {/* Core Equation */}
          <div className="bg-gradient-to-br from-cyan-900/30 to-pink-900/30 p-4 rounded-lg border border-cyan-500/30">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">Centripetal Acceleration</div>
              <div className="text-2xl font-bold text-white font-mono">
                a = v² / R
              </div>
              <div className="text-lg text-pink-300 font-mono mt-2">
                = {acceleration.toFixed(3)} m/s²
              </div>
            </div>
          </div>

          {/* Angle */}
          <div>
            <h3 className="text-gray-400 font-medium mb-2">Angle</h3>
            <div className="font-mono text-lg">
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-gray-500">θ:</span>
                <span className="text-yellow-400">{((currentTheta * 180) / Math.PI).toFixed(1)}°</span>
              </div>
            </div>
          </div>

          {/* Position (2D only: x, z) */}
          <div>
            <h3 className="text-gray-400 font-medium mb-2">Position (XZ Plane)</h3>
            <div className="font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">x:</span>
                <span className="text-white">{position.x.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">z:</span>
                <span className="text-white">{position.z.toFixed(3)} m</span>
              </div>
            </div>
          </div>

          {/* Velocity Components */}
          <div>
            <h3 className="text-cyan-400 font-medium mb-2">Velocity (Tangent)</h3>
            <div className="font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">vₓ:</span>
                <span className="text-cyan-300">{velocityVector.x.toFixed(3)} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">vᵤ:</span>
                <span className="text-cyan-300">{velocityVector.z.toFixed(3)} m/s</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
                <span className="text-gray-500">|v|:</span>
                <span className="text-cyan-300">
                  {Math.sqrt(velocityVector.x ** 2 + velocityVector.z ** 2).toFixed(3)} m/s
                </span>
              </div>
            </div>
          </div>

          {/* Acceleration Components */}
          <div>
            <h3 className="text-pink-400 font-medium mb-2">Acceleration (Radial)</h3>
            <div className="font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">aₓ:</span>
                <span className="text-pink-300">{accelerationVector.x.toFixed(3)} m/s²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">aᵤ:</span>
                <span className="text-pink-300">{accelerationVector.z.toFixed(3)} m/s²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3D Mode - Full detailed readout
  return (
    <div className="w-full md:w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold text-white mb-4">
        Physics Readout
      </h2>

      <div className="space-y-6 text-sm">
        {/* Position */}
        <div>
          <h3 className="text-gray-400 font-medium mb-2">Position</h3>
          <div className="font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">x:</span>
              <span className="text-white">{position.x.toFixed(3)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">y:</span>
              <span className="text-white">{position.y.toFixed(3)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">z:</span>
              <span className="text-white">{position.z.toFixed(3)} m</span>
            </div>
          </div>
        </div>

        {/* Velocity */}
        <div>
          <h3 className="text-cyan-400 font-medium mb-2">
            Velocity Vector (Tangent)
          </h3>
          <div className="font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">vₓ:</span>
              <span className="text-cyan-300">
                {velocityVector.x.toFixed(3)} m/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">vᵧ:</span>
              <span className="text-cyan-300">
                {velocityVector.y.toFixed(3)} m/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">vᵤ:</span>
              <span className="text-cyan-300">
                {velocityVector.z.toFixed(3)} m/s
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-500">|v|:</span>
              <span className="text-cyan-300">
                {Math.sqrt(
                  velocityVector.x ** 2 +
                    velocityVector.y ** 2 +
                    velocityVector.z ** 2
                ).toFixed(3)}{' '}
                m/s
              </span>
            </div>
          </div>
        </div>

        {/* Centripetal Acceleration */}
        <div>
          <h3 className="text-pink-400 font-medium mb-2">
            Centripetal Acceleration
          </h3>
          <div className="bg-gray-800 p-3 rounded mb-2">
            <div className="text-center font-mono">
              <div className="text-gray-400 text-xs mb-1">a = v² / R</div>
              <div className="text-pink-300 text-lg">
                {acceleration.toFixed(3)} m/s²
              </div>
            </div>
          </div>
          <div className="font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">aₓ:</span>
              <span className="text-pink-300">
                {accelerationVector.x.toFixed(3)} m/s²
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">aᵧ:</span>
              <span className="text-pink-300">
                {accelerationVector.y.toFixed(3)} m/s²
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">aᵤ:</span>
              <span className="text-pink-300">
                {accelerationVector.z.toFixed(3)} m/s²
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400 italic">
            Direction: Toward center
          </div>
        </div>

        {/* Orbital Properties */}
        <div>
          <h3 className="text-gray-400 font-medium mb-2">Orbital Properties</h3>
          <div className="font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Period (T):</span>
              <span className="text-white">{period.toFixed(3)} s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Angular Velocity (ω):</span>
              <span className="text-white">
                {angularVelocity.toFixed(3)} rad/s
              </span>
            </div>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-gray-400 font-medium mb-2 text-xs">
            Key Equations
          </h3>
          <div className="space-y-1 text-xs font-mono text-gray-500">
            <div>a = v² / R</div>
            <div>T = 2πR / v</div>
            <div>ω = v / R</div>
          </div>
        </div>
      </div>
    </div>
  );
}
