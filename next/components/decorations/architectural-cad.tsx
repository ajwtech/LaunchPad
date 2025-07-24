"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

import { ArchitecturalFileLoader } from './architectural-elements/loader';
import { ArchitecturalAnimator } from './architectural-elements/animator';
import { debugLog, debugTime } from './architectural-elements/debug';
import { 
  ArchitecturalScene, 
  ArchitecturalElement, 
  ElementType, 
  AnimationConfig,
  FileLoader 
} from './architectural-elements/types';

interface ArchitecturalCADProps {
  scene?: ArchitecturalScene;
  fileElements?: FileLoader[];
  enableControls?: boolean;
  showGrid?: boolean;
  showStats?: boolean;
  animations?: boolean;
  className?: string;
}

// Scene builder component
const ArchitecturalSceneBuilder: React.FC<{
  fileElements?: FileLoader[];
  animations: boolean;
}> = ({ fileElements, animations }) => {
  const { scene } = useThree();
  const [isLoading, setIsLoading] = useState(true);
  const [loadedElements, setLoadedElements] = useState<THREE.Object3D[]>([]);
  const [mountId] = useState(() => Math.random()); // Unique ID per component mount
  const elementsRef = useRef<THREE.Object3D[]>([]); // Track elements for cleanup
  
  // Create fresh instances each time to avoid reusing modified Three.js objects
  const [loader] = useState(() => new ArchitecturalFileLoader());
  const [animator] = useState(() => new ArchitecturalAnimator());

  useEffect(() => {
    debugLog.mounting(`ArchitecturalSceneBuilder useEffect running, mountId: ${mountId}, animations: ${animations}`);
    
    const loadElements = async () => {
      debugTime.start('Element Loading');
      setIsLoading(true);
      const elements: THREE.Object3D[] = [];

      try {
        // Load file-based elements if provided
        if (fileElements) {
          for (const fileConfig of fileElements) {
            try {
              const element = await loader.loadArchitecturalFile(fileConfig);
              elements.push(element);
              scene.add(element);
            } catch (error) {
              console.warn(`Failed to load ${fileConfig.path}:`, error);
            }
          }
        }

        // Create default architectural scene if no files provided
        if (!fileElements || fileElements.length === 0) {
          // Main building - larger and more prominent
          const building = loader.createBuilding(30, 20, 18);
          building.position.set(0, 0, 0);
          
          // Secondary building for depth
          const building2 = loader.createBuilding(20, 15, 12);
          building2.position.set(35, 0, -10);
          
          // Windows on main building - front face
          const window1 = loader.createWindow(4, 5);
          window1.position.set(-8, 6, 9.1);
          
          const window2 = loader.createWindow(4, 5);
          window2.position.set(0, 6, 9.1);
          
          const window3 = loader.createWindow(4, 5);
          window3.position.set(8, 6, 9.1);
          
          // Upper floor windows
          const window4 = loader.createWindow(3, 4);
          window4.position.set(-8, 14, 9.1);
          
          const window5 = loader.createWindow(3, 4);
          window5.position.set(0, 14, 9.1);
          
          const window6 = loader.createWindow(3, 4);
          window6.position.set(8, 14, 9.1);
          
          // Main entrance - positioned on right wall
          const door = loader.createDoor(3.5, 6);
          door.position.set(15.1, 3, 0); // Right wall position
          door.rotation.y = -Math.PI / 2; // Rotate 90 degrees to face left
          
          // Right wall windows
          const rightWindow1 = loader.createWindow(3, 4);
          rightWindow1.position.set(15.1, 6, -6);
          rightWindow1.rotation.y = -Math.PI / 2; // Face left
          
          const rightWindow2 = loader.createWindow(3, 4);
          rightWindow2.position.set(15.1, 6, 6);
          rightWindow2.rotation.y = -Math.PI / 2; // Face left
          
          const rightWindow3 = loader.createWindow(2.5, 3.5);
          rightWindow3.position.set(15.1, 14, -3);
          rightWindow3.rotation.y = -Math.PI / 2; // Face left
          
          const rightWindow4 = loader.createWindow(2.5, 3.5);
          rightWindow4.position.set(15.1, 14, 3);
          rightWindow4.rotation.y = -Math.PI / 2; // Face left
          
          elements.push(building, building2, window1, window2, window3, window4, window5, window6, door, rightWindow1, rightWindow2, rightWindow3, rightWindow4);
          
          scene.add(building);
          scene.add(building2);
          scene.add(window1);
          scene.add(window2);
          scene.add(window3);
          scene.add(window4);
          scene.add(window5);
          scene.add(window6);
          scene.add(door);
          scene.add(rightWindow1);
          scene.add(rightWindow2);
          scene.add(rightWindow3);
          scene.add(rightWindow4);
        }

        setLoadedElements(elements);
        debugTime.end('Element Loading');

        // For debugging - make sure elements are visible first
        debugLog.rendering(`Loaded ${elements.length} architectural elements`);
        elements.forEach((el, i) => {
          debugLog.rendering(`Element ${i}:`, el.type, el.children.length, 'children');
          // Check visibility of each child
          el.children.forEach((child, j) => {
            const mesh = child as any;
            debugLog.rendering(`  Child ${j}:`, child.type, 'visible:', child.visible, 'material:', mesh.material?.type);
          });
        });

        // Start animations if enabled
        if (animations) {
          debugLog.animation(`Starting animations for ${elements.length} elements, mountId: ${mountId}`);
          // Reset all elements to initial state before animating
          animator.resetElements(elements);
          // Add a small delay to ensure elements are rendered first
          setTimeout(() => {
            animateElementsSequentially(elements, animator);
          }, 100);
        }

      } catch (error) {
        console.error('Error loading architectural scene:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadElements();

    return () => {
      debugLog.lifecycle(`ArchitecturalSceneBuilder cleanup, mountId: ${mountId}`);
      // Cleanup - remove elements from scene
      loadedElements.forEach(element => {
        scene.remove(element);
      });
      // Dispose resources
      loader.dispose();
      animator.dispose();
    };
    // Include mountId to ensure fresh animations on each mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileElements, scene, animations, mountId]);

  return null;
};

// Animation sequence for loaded elements
const animateElementsSequentially = async (
  elements: THREE.Object3D[], 
  animator: ArchitecturalAnimator
) => {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const config: AnimationConfig = {
      type: 'draw', // All elements use draw animation for CAD-like effect
      duration: 3000 + i * 500, // Slower drawing so you can see it  
      delay: i * 800, // Longer delays to see each element clearly
      onStart: () => debugLog.animation(`Drawing element ${i} - ${element.userData.type || 'architectural'}`),
      onComplete: () => debugLog.animation(`Completed drawing element ${i}`)
    };

    // Don't await - let them overlap for dynamic drawing effect
    animator.animateDrawing(element, config, `element-${i}`);
  }
};

// Lighting setup component
const ArchitecturalLighting: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const effectiveTheme = resolvedTheme || theme || 'dark';
  
  const ambientIntensity = effectiveTheme === 'dark' ? 0.3 : 0.6;
  const directionalIntensity = effectiveTheme === 'dark' ? 0.8 : 1.0;

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />
      <hemisphereLight args={['#ffffff', '#60666C']} intensity={0.2} />
    </>
  );
};

// Camera controls component
const CameraController: React.FC<{ enableControls: boolean }> = ({ enableControls }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set up isometric-like view
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(45, 35, 45);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  return enableControls ? (
    <OrbitControls
      target={[0, 0, 0]}
      maxPolarAngle={Math.PI / 2}
      minDistance={10}
      maxDistance={100}
      enableDamping
      dampingFactor={0.05}
    />
  ) : null;
};

// Main Architectural CAD Component
const ArchitecturalCAD: React.FC<ArchitecturalCADProps> = ({
  scene,
  fileElements,
  enableControls = true,
  showGrid = false,
  showStats = false,
  animations = true,
  className = ""
}) => {
  debugLog.mounting(`🏗️ ArchitecturalCAD component mounting with animations: ${animations}`);
  const { theme, resolvedTheme } = useTheme();
  const effectiveTheme = resolvedTheme || theme || 'dark';
  
  const backgroundColor = effectiveTheme === 'dark' ? '#0a0a0a' : '#f5f5f5';

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ 
          position: [45, 35, 45],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ background: backgroundColor }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        onCreated={(state) => {
          state.gl.shadowMap.enabled = true;
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <ArchitecturalLighting />
        
        <CameraController enableControls={enableControls} />
        
        <ArchitecturalSceneBuilder 
          fileElements={fileElements}
          animations={animations}
        />
        
        {showGrid && (
          <Grid
            position={[0, -0.01, 0]}
            args={[100, 100]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#333333"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#555555"
            fadeDistance={50}
            fadeStrength={1}
            infiniteGrid
          />
        )}
        
        <Environment preset="city" />
        
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
};

export default ArchitecturalCAD;
