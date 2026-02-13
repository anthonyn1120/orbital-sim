'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { usePhysics } from '@/hooks/usePhysics';
import { ParticleField } from '@/components/visualizations/ParticleField';
import { Controls } from '@/components/Controls';
import { PhysicsPanel } from '@/components/PhysicsPanel';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { CameraController } from '@/components/CameraController';

export default function Home() {
  const {
    refs,
    controls,
    displayValues,
    play,
    pause,
    reset,
    togglePlayPause,
    viewMode,
    toggleViewMode
  } = usePhysics();

  return (
    <main className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">
            Orbital Physics Simulator
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Centripetal Acceleration Visualization (a = v² / R)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          {/* View Mode Toggle */}
          <ViewModeToggle viewMode={viewMode} onToggle={toggleViewMode} />

          <Canvas
            camera={{ position: [15, 10, 15], fov: 50 }}
            className="bg-black"
            gl={{ antialias: true }}
          >
            {/* Camera controller for smooth transitions */}
            <CameraController viewMode={viewMode} />

            {/* Camera controls - only enabled in 3D mode */}
            {viewMode === '3D' && (
              <OrbitControls
                enabled={true}
                enableDamping
                dampingFactor={0.05}
                minDistance={10}
                maxDistance={50}
                makeDefault
              />
            )}

            {/* Main visualization - same for both modes */}
            <ParticleField refs={refs} viewMode={viewMode} />

            {/* Post-processing effects - bloom for both modes */}
            <EffectComposer>
              <Bloom
                intensity={0.8}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                height={300}
              />
            </EffectComposer>
          </Canvas>

          {/* Camera control hint - only show in 3D mode */}
          {viewMode === '3D' && (
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs p-3 rounded">
              <div className="font-semibold mb-1">Camera Controls:</div>
              <div>Left-click + drag: Orbit</div>
              <div>Right-click + drag: Pan</div>
              <div>Scroll: Zoom</div>
            </div>
          )}
        </div>

        {/* Physics Readout Panel */}
        <PhysicsPanel
          displayValues={displayValues}
          viewMode={viewMode}
          currentTheta={controls.theta}
        />
      </div>

      {/* Controls */}
      <Controls
        theta={controls.theta}
        velocity={controls.velocity}
        radius={controls.radius}
        isPlaying={controls.isPlaying}
        setTheta={controls.setTheta}
        setVelocity={controls.setVelocity}
        setRadius={controls.setRadius}
        play={play}
        pause={pause}
        reset={reset}
        togglePlayPause={togglePlayPause}
      />
    </main>
  );
}
