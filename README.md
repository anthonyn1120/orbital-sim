# Orbital Physics Simulator

An interactive 3D visualization demonstrating **centripetal acceleration** in circular orbital motion.

**Physics 201 Final Project - Highline College**

## Core Physics

This simulator demonstrates the fundamental equation:

```
a = v² / R
```

Where:
- **a** = centripetal acceleration (m/s²)
- **v** = tangential velocity (m/s)
- **R** = orbital radius (m)

## Features

### Interactive Controls
- **Angle (θ):** Adjust orbital position (0 to 2π radians)
- **Velocity (v):** Control tangential velocity (1-15 m/s)
- **Radius (R):** Modify orbital radius (5-30 m)
- **Play/Pause:** Animate continuous orbital motion
- **Reset:** Return to default values

### Real-Time Physics Display
- Position coordinates (x, y, z)
- Velocity vector components
- Centripetal acceleration magnitude
- Acceleration vector components
- Orbital period (T)
- Angular velocity (ω)

### 3D Visualization
- **Particle Field Mode:** Stunning particle-based visualization
- Glowing orbiting object (cyan)
- Velocity vector arrow (cyan) - tangent to orbit
- Acceleration vector arrow (magenta) - pointing to center
- Background particle field for depth
- Orbit path visualization

### Camera Controls
- Left-click + drag: Orbit camera
- Right-click + drag: Pan view
- Scroll: Zoom in/out
- FPS counter for performance monitoring

## Tech Stack

- **Framework:** Next.js 14+ (React App Router)
- **3D Engine:** Three.js with React Three Fiber
- **3D Helpers:** @react-three/drei
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
orbital-sim/
├── app/
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
├── components/
│   ├── Controls.tsx          # Interactive control panel
│   ├── PhysicsPanel.tsx      # Real-time physics display
│   └── visualizations/
│       └── ParticleField.tsx # 3D visualization
├── hooks/
│   └── usePhysics.ts         # Physics state management
└── lib/
    └── physics.ts            # Core physics calculations
```

## Physics Implementation

### Centripetal Acceleration
```typescript
a = v² / R
```

### Position (Polar to Cartesian)
```typescript
x = R × cos(θ)
z = R × sin(θ)
```

### Velocity Vector (Tangent to orbit)
```typescript
vₓ = -v × sin(θ)
vᵤ = v × cos(θ)
```

### Orbital Period
```typescript
T = 2πR / v
```

## Performance

- **Target:** 60 FPS
- **Optimization:** Uses refs for animation (60 FPS), state for UI updates (10 FPS)
- **Particle Count:** 2000 background particles

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

## Author

Anthony - Physics 201, Highline College
