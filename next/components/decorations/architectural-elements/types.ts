// Architectural element types and interfaces
import * as THREE from 'three';

export interface ArchitecturalElement {
  id: string;
  name: string;
  type: ElementType;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
  metadata?: ElementMetadata;
}

export enum ElementType {
  BUILDING = 'building',
  WALL = 'wall',
  DOOR = 'door',
  WINDOW = 'window',
  COLUMN = 'column',
  BEAM = 'beam',
  STAIRS = 'stairs',
  ROOM = 'room',
  FOUNDATION = 'foundation',
  ROOF = 'roof',
  CUSTOM = 'custom'
}

export interface ElementMetadata {
  material?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  properties?: Record<string, any>;
  tags?: string[];
}

export interface AnimationConfig {
  type: 'draw' | 'fade' | 'slide' | 'rotate' | 'scale' | 'custom';
  duration: number;
  delay: number;
  easing?: string;
  loop?: boolean;
  direction?: 'forward' | 'reverse' | 'alternate';
  onStart?: () => void;
  onComplete?: () => void;
}

export interface ArchitecturalScene {
  elements: ArchitecturalElement[];
  camera: {
    position: THREE.Vector3;
    target: THREE.Vector3;
    type: 'perspective' | 'orthographic';
  };
  lighting: LightingConfig;
  environment: EnvironmentConfig;
}

export interface LightingConfig {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: THREE.Vector3;
    shadows: boolean;
  };
  additional?: Array<{
    type: 'point' | 'spot' | 'hemisphere';
    color: string;
    intensity: number;
    position: THREE.Vector3;
    shadows?: boolean;
  }>;
}

export interface EnvironmentConfig {
  background: string | THREE.Color;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  ground?: {
    visible: boolean;
    color: string;
    grid: boolean;
  };
}

export interface FileLoader {
  type: 'gltf' | 'fbx' | 'obj' | 'ifc' | 'step' | 'stl';
  path: string;
  scale?: number;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
}

export interface DrawingAnimation {
  element: ArchitecturalElement;
  config: AnimationConfig;
  onComplete?: () => void;
  onStart?: () => void;
}
