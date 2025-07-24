# Architectural CAD System

A comprehensive 3D architectural visualization system built with Three.js and React Three Fiber.

## Features

- **File-based Model Loading**: Support for GLTF, FBX, OBJ, STL files
- **Animated Drawing**: CAD-style drawing animations with line-by-line construction
- **Multiple View Modes**: Isometric, front, side, top-down, walkthrough cameras
- **Theme Integration**: Automatic dark/light mode support
- **Interactive Controls**: Optional orbit controls for 3D navigation
- **Procedural Elements**: Built-in building, window, door generators

## Quick Start

```tsx
import ArchitecturalCAD from '@/components/decorations/architectural-cad';

// Basic usage with default procedural building
<ArchitecturalCAD 
  animations={true}
  enableControls={false}
  showGrid={false}
/>
```

## Loading Your Own Models

1. **Place files in `/public/models/` directory**
2. **Configure file loading:**

```tsx
const fileElements = [
  {
    type: 'gltf',
    path: '/models/office-building.gltf',
    scale: 1,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0)
  },
  {
    type: 'fbx',
    path: '/models/house.fbx', 
    scale: 0.1,
    position: new THREE.Vector3(10, 0, 0)
  }
];

<ArchitecturalCAD fileElements={fileElements} />
```

## Supported File Formats

- **GLTF/GLB**: Recommended for web, supports animations, materials, textures
- **FBX**: Good for complex models from 3D software
- **OBJ**: Simple geometry, widely supported
- **STL**: 3D printing format, good for solid models

## Animation System

### Animation Types

```tsx
const animations = {
  draw: { type: 'draw', duration: 3000, delay: 0 },      // Line drawing
  fade: { type: 'fade', duration: 1500, delay: 500 },    // Fade in
  scale: { type: 'scale', duration: 1200, delay: 1000 }, // Scale up
  slide: { type: 'slide', duration: 1000, delay: 1500 }, // Slide in
  rotate: { type: 'rotate', duration: 800, delay: 2000 } // Rotate in
};
```

### Sequential vs Parallel Animation

```tsx
// Sequential (one after another)
await animator.animateSequence(animations);

// Parallel (all at once)
await animator.animateParallel(animations);
```

## Camera Presets

```tsx
import { cameraPresets } from '@/components/decorations/architectural-elements';

// Available presets:
// - isometric: 3D architectural view
// - frontView: Direct front view  
// - sideView: Profile view
// - topDown: Plan view
// - walkthrough: First-person perspective
```

## Lighting Presets

```tsx
import { lightingPresets } from '@/components/decorations/architectural-elements';

// Available presets:
// - daylight: Bright natural lighting
// - sunset: Warm orange lighting
// - night: Cool blue lighting  
// - interior: Soft indoor lighting
```

## Scene Configurations

Pre-configured setups for common use cases:

```tsx
import { sceneConfigurations } from '@/components/decorations/architectural-elements';

// Hero section (no controls, animated)
<ArchitecturalCAD {...sceneConfigurations.heroSection} />

// Interactive viewer (with controls, grid)
<ArchitecturalCAD {...sceneConfigurations.interactiveViewer} />

// Portfolio showcase
<ArchitecturalCAD {...sceneConfigurations.portfolioShowcase} />
```

## Advanced Usage

### Custom Scene Builder

```tsx
import { ArchitecturalFileLoader } from '@/components/decorations/architectural-elements';

const loader = new ArchitecturalFileLoader();

// Create custom elements
const building = loader.createBuilding(20, 15, 12);
const window = loader.createWindow(3, 4);
const door = loader.createDoor(2.5, 5);
```

### Animation Control

```tsx
import { ArchitecturalAnimator } from '@/components/decorations/architectural-elements';

const animator = new ArchitecturalAnimator();

// Control animations
animator.pauseAnimation('element-1');
animator.resumeAnimation('element-1');
animator.stopAnimation('element-1');
```

## Best Practices

1. **File Optimization**: 
   - Keep models under 10MB for web performance
   - Use compressed textures (WebP, KTX2)
   - Optimize geometry (reduce polygon count)

2. **Performance**:
   - Limit concurrent animations
   - Use LOD (Level of Detail) for complex scenes
   - Consider instancing for repeated elements

3. **Mobile Support**:
   - Test on mobile devices
   - Reduce quality settings for mobile
   - Consider simplified models for mobile

## Folder Structure

```
architectural-elements/
├── index.ts          # Main exports
├── types.ts          # TypeScript interfaces
├── loader.ts         # File loading system
├── animator.ts       # Animation system
└── scenes.ts         # Pre-configured scenes
```

## Integration Examples

### Hero Section
```tsx
<ArchitecturalCAD 
  animations={true}
  enableControls={false}
  showGrid={false}
  className="absolute inset-0"
/>
```

### Portfolio Gallery
```tsx
<ArchitecturalCAD
  fileElements={portfolioModels}
  enableControls={true}
  showGrid={true}
  showStats={true}
  className="w-full h-96 border rounded-lg"
/>
```

### Interactive Showcase
```tsx
<ArchitecturalCAD
  fileElements={buildingModels}
  enableControls={true}
  showGrid={false}
  animations={false}
  className="w-full h-screen"
/>
```

## Troubleshooting

1. **Models not loading**: Check file paths and CORS settings
2. **Poor performance**: Reduce model complexity or disable animations
3. **Dark/light theme issues**: Ensure theme provider is properly configured
4. **Animation glitches**: Check for conflicting animations or timing issues

## Future Enhancements

- IFC file support for BIM models
- VR/AR capabilities
- Real-time collaboration
- Measurement tools
- Section cutting
- Explosion views
