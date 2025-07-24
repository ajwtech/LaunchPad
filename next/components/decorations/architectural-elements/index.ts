// Main exports for the architectural CAD system
export { default as ArchitecturalCAD } from '../architectural-cad';
export { ArchitecturalFileLoader } from './loader';
export { ArchitecturalAnimator } from './animator';
export { 
  sceneConfigurations,
  cameraPresets,
  lightingPresets,
  drawingAnimations,
  createOfficeBuilding,
  createResidentialComplex,
  createIndustrialComplex
} from './scenes';

export * from './types';

// Usage instructions:
/*
1. To load your own architectural files, place them in the public/models directory
2. Update the scene configurations in scenes.ts to reference your files
3. Supported formats: GLTF, FBX, OBJ, STL
4. Example usage:

import { ArchitecturalCAD, sceneConfigurations } from '@/components/decorations/architectural-elements';

<ArchitecturalCAD 
  fileElements={[
    {
      type: 'gltf',
      path: '/models/your-building.gltf',
      scale: 1,
      position: new THREE.Vector3(0, 0, 0)
    }
  ]}
  enableControls={true}
  showGrid={true}
  animations={true}
/>

5. Animation types available:
   - 'draw': Line-by-line drawing effect
   - 'fade': Fade in/out
   - 'scale': Scale up from zero
   - 'slide': Slide in from position
   - 'rotate': Rotate into place

6. Camera presets available:
   - isometric, frontView, sideView, topDown, walkthrough

7. Lighting presets available:
   - daylight, sunset, night, interior
*/
