// Predefined architectural scenes and configurations
import * as THREE from 'three';
import { ArchitecturalScene, FileLoader, AnimationConfig } from './types';

export const createOfficeBuilding = (): FileLoader[] => [
  // If you had architectural files, they would be loaded like this:
  // {
  //   type: 'gltf',
  //   path: '/models/office-building.gltf',
  //   scale: 1,
  //   position: new THREE.Vector3(0, 0, 0)
  // }
];

export const createResidentialComplex = (): FileLoader[] => [
  // {
  //   type: 'fbx',
  //   path: '/models/house-1.fbx',
  //   scale: 0.1,
  //   position: new THREE.Vector3(-10, 0, 0)
  // },
  // {
  //   type: 'fbx', 
  //   path: '/models/house-2.fbx',
  //   scale: 0.1,
  //   position: new THREE.Vector3(10, 0, 0)
  // }
];

export const createIndustrialComplex = (): FileLoader[] => [
  // {
  //   type: 'obj',
  //   path: '/models/warehouse.obj',
  //   scale: 2,
  //   position: new THREE.Vector3(0, 0, -20)
  // }
];

// Animation configurations for different drawing styles
export const drawingAnimations = {
  sequential: {
    building: { type: 'draw' as const, duration: 3000, delay: 0 },
    windows: { type: 'fade' as const, duration: 1500, delay: 3500 },
    doors: { type: 'slide' as const, duration: 1200, delay: 5000 },
    details: { type: 'scale' as const, duration: 800, delay: 6200 }
  },
  
  parallel: {
    all: { type: 'fade' as const, duration: 2000, delay: 0 }
  },
  
  construction: {
    foundation: { type: 'slide' as const, duration: 1000, delay: 0 },
    structure: { type: 'draw' as const, duration: 4000, delay: 1000 },
    exterior: { type: 'fade' as const, duration: 2000, delay: 5000 },
    interior: { type: 'scale' as const, duration: 1500, delay: 7000 }
  }
};

// Camera positions for different views
export const cameraPresets = {
  isometric: {
    position: new THREE.Vector3(45, 35, 45),
    target: new THREE.Vector3(0, 0, 0)
  },
  
  frontView: {
    position: new THREE.Vector3(0, 10, 40),
    target: new THREE.Vector3(0, 5, 0)
  },
  
  sideView: {
    position: new THREE.Vector3(40, 10, 0),
    target: new THREE.Vector3(0, 5, 0)
  },
  
  topDown: {
    position: new THREE.Vector3(0, 50, 0),
    target: new THREE.Vector3(0, 0, 0)
  },
  
  walkthrough: {
    position: new THREE.Vector3(5, 2, 15),
    target: new THREE.Vector3(0, 2, 0)
  }
};

// Lighting configurations for different moods
export const lightingPresets = {
  daylight: {
    ambient: { color: '#ffffff', intensity: 0.6 },
    directional: { 
      color: '#ffffff', 
      intensity: 1.0, 
      position: new THREE.Vector3(10, 20, 5) 
    }
  },
  
  sunset: {
    ambient: { color: '#ffa500', intensity: 0.4 },
    directional: { 
      color: '#ff6347', 
      intensity: 0.8, 
      position: new THREE.Vector3(-10, 15, 5) 
    }
  },
  
  night: {
    ambient: { color: '#1e1e3f', intensity: 0.2 },
    directional: { 
      color: '#87ceeb', 
      intensity: 0.3, 
      position: new THREE.Vector3(0, 30, 0) 
    }
  },
  
  interior: {
    ambient: { color: '#ffffff', intensity: 0.8 },
    directional: { 
      color: '#ffffcc', 
      intensity: 0.6, 
      position: new THREE.Vector3(5, 10, 5) 
    }
  }
};

// Example usage configurations
export const sceneConfigurations = {
  heroSection: {
    fileElements: [], // Will use default procedural building
    enableControls: false,
    showGrid: false,
    showStats: false,
    animations: true,
    className: 'w-full h-full opacity-80'
  },
  
  interactiveViewer: {
    fileElements: createOfficeBuilding(),
    enableControls: true,
    showGrid: true,
    showStats: false,
    animations: true,
    className: 'w-full h-full border rounded-lg'
  },
  
  portfolioShowcase: {
    fileElements: createResidentialComplex(),
    enableControls: true,
    showGrid: false,
    showStats: false,
    animations: true,
    className: 'w-full h-96'
  }
};
