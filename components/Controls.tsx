'use client';

import { PHYSICS_CONSTANTS } from '@/lib/physics';

interface ControlsProps {
  theta: number;
  velocity: number;
  radius: number;
  isPlaying: boolean;
  setTheta: (value: number) => void;
  setVelocity: (value: number) => void;
  setRadius: (value: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  togglePlayPause: () => void;
}

export function Controls({
  theta,
  velocity,
  radius,
  isPlaying,
  setTheta,
  setVelocity,
  setRadius,
  play,
  pause,
  reset,
  togglePlayPause
}: ControlsProps) {
  return (
    <div className="w-full bg-gray-900 border-t border-gray-700 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Theta (Angle) Control */}
          <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-gray-300">
              <span>Angle (θ)</span>
              <span className="font-mono text-cyan-400">
                {((theta * 180) / Math.PI).toFixed(1)}°
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={(theta * 180) / Math.PI}
              onChange={(e) => {
                const degrees = parseFloat(e.target.value);
                setTheta((degrees * Math.PI) / 180);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              disabled={isPlaying}
            />
            <input
              type="number"
              min={0}
              max={360}
              step={1}
              value={((theta * 180) / Math.PI).toFixed(1)}
              onChange={(e) => {
                const degrees = parseFloat(e.target.value);
                if (!isNaN(degrees)) {
                  const clampedDegrees = Math.max(0, Math.min(360, degrees));
                  setTheta((clampedDegrees * Math.PI) / 180);
                }
              }}
              className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white font-mono text-sm"
              disabled={isPlaying}
            />
          </div>

          {/* Velocity Control */}
          <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-gray-300">
              <span>Velocity (v)</span>
              <span className="font-mono text-cyan-400">
                {velocity.toFixed(2)} m/s
              </span>
            </label>
            <input
              type="range"
              min={PHYSICS_CONSTANTS.MIN_VELOCITY}
              max={PHYSICS_CONSTANTS.MAX_VELOCITY}
              step={0.1}
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <input
              type="number"
              min={PHYSICS_CONSTANTS.MIN_VELOCITY}
              max={PHYSICS_CONSTANTS.MAX_VELOCITY}
              step={0.1}
              value={velocity.toFixed(2)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setVelocity(
                    Math.max(
                      PHYSICS_CONSTANTS.MIN_VELOCITY,
                      Math.min(PHYSICS_CONSTANTS.MAX_VELOCITY, val)
                    )
                  );
                }
              }}
              className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white font-mono text-sm"
            />
          </div>

          {/* Radius Control */}
          <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-gray-300">
              <span>Radius (R)</span>
              <span className="font-mono text-cyan-400">
                {radius.toFixed(2)} m
              </span>
            </label>
            <input
              type="range"
              min={PHYSICS_CONSTANTS.MIN_RADIUS}
              max={PHYSICS_CONSTANTS.MAX_RADIUS}
              step={0.5}
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <input
              type="number"
              min={PHYSICS_CONSTANTS.MIN_RADIUS}
              max={PHYSICS_CONSTANTS.MAX_RADIUS}
              step={0.5}
              value={radius.toFixed(2)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setRadius(
                    Math.max(
                      PHYSICS_CONSTANTS.MIN_RADIUS,
                      Math.min(PHYSICS_CONSTANTS.MAX_RADIUS, val)
                    )
                  );
                }
              }}
              className="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white font-mono text-sm"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={togglePlayPause}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              isPlaying
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}
