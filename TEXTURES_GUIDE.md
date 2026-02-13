# Adding Realistic Earth Textures

## Current Status
The visualization now includes:
- ✅ Deep space environment with stars
- ✅ Blue nebula glow effect
- ✅ Realistic Earth with atmospheric glow
- ✅ Sun-like directional lighting
- ✅ Bloom/glow post-processing
- ✅ Subtle orbit path
- ✅ Floating space dust particles

## Optional: Add Real Earth Textures

For maximum realism, you can add actual NASA Earth textures.

### Step 1: Download Free Textures

**Option A: Solar System Scope (Easiest)**
1. Visit: https://www.solarsystemscope.com/textures/
2. Download these textures (2K resolution is fine):
   - `2k_earth_daymap.jpg` - Earth surface with continents
   - `2k_earth_nightmap.jpg` - City lights on night side
   - `2k_earth_clouds.jpg` - Cloud layer (optional)

**Option B: NASA Visible Earth**
1. Visit: https://visibleearth.nasa.gov/
2. Search for "Earth" and download Blue Marble images
3. Look for day/night composite images

### Step 2: Add Textures to Project

Create a textures folder and add the images:
```bash
mkdir -p public/textures
# Copy downloaded images to public/textures/
```

Your structure should look like:
```
public/
└── textures/
    ├── earth-day.jpg
    ├── earth-night.jpg
    └── earth-clouds.png (optional)
```

### Step 3: Update Earth Component

Replace the content of `components/visualizations/Earth.tsx` with:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load textures
  const [dayMap, nightMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth-day.jpg',
    '/textures/earth-night.jpg',
  ]);

  // Rotate Earth
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06; // Clouds rotate slightly faster
    }
  });

  return (
    <group>
      {/* Main Earth with texture */}
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={dayMap}
          emissiveMap={nightMap}
          emissive="#ffff88"
          emissiveIntensity={0.5}
          roughness={0.9}
          metalness={0.1}
        />
      </Sphere>

      {/* Atmospheric glow */}
      <Sphere args={[2.15, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Inner atmosphere */}
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
```

### Step 4: Test

Refresh http://localhost:3000 and you should see realistic Earth textures with city lights visible on the night side!

## Troubleshooting

**Images not loading?**
- Check file paths match exactly (case-sensitive)
- Ensure files are in `public/textures/` not `textures/`
- Check browser console for 404 errors

**Performance issues?**
- Use 2K textures instead of 4K/8K
- Reduce texture quality in an image editor
- Lower particle count in SpaceEnvironment.tsx

**Want more realism?**
- Add a cloud layer with transparency
- Add bump/normal maps for surface detail
- Animate cloud movement separately from Earth rotation
