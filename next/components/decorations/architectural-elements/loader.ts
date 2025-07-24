// File loader for various architectural file formats
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { FileLoader, ArchitecturalElement, ElementType } from './types';

export class ArchitecturalFileLoader {
  private gltfLoader = new GLTFLoader();
  private fbxLoader = new FBXLoader();
  private objLoader = new OBJLoader();
  private stlLoader = new STLLoader();
  private loadingManager = new THREE.LoadingManager();

  constructor() {
    this.setupLoadingManager();
  }

  private setupLoadingManager() {
    this.loadingManager.onLoad = () => {
      console.log('All architectural files loaded');
    };

    this.loadingManager.onProgress = (url, loaded, total) => {
      console.log(`Loading progress: ${loaded}/${total} - ${url}`);
    };

    this.loadingManager.onError = (url) => {
      console.error(`Failed to load: ${url}`);
    };
  }

  async loadArchitecturalFile(fileConfig: FileLoader): Promise<THREE.Object3D> {
    try {
      switch (fileConfig.type) {
        case 'gltf':
          return await this.loadGLTF(fileConfig);
        case 'fbx':
          return await this.loadFBX(fileConfig);
        case 'obj':
          return await this.loadOBJ(fileConfig);
        case 'stl':
          return await this.loadSTL(fileConfig);
        default:
          throw new Error(`Unsupported file type: ${fileConfig.type}`);
      }
    } catch (error) {
      console.error(`Error loading architectural file: ${fileConfig.path}`, error);
      throw error;
    }
  }

  private async loadGLTF(fileConfig: FileLoader): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        fileConfig.path,
        (gltf) => {
          const model = gltf.scene;
          this.applyTransforms(model, fileConfig);
          resolve(model);
        },
        (progress) => {
          // Loading progress
        },
        reject
      );
    });
  }

  private async loadFBX(fileConfig: FileLoader): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(
        fileConfig.path,
        (fbx) => {
          this.applyTransforms(fbx, fileConfig);
          resolve(fbx);
        },
        (progress) => {
          // Loading progress
        },
        reject
      );
    });
  }

  private async loadOBJ(fileConfig: FileLoader): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.objLoader.load(
        fileConfig.path,
        (obj) => {
          this.applyTransforms(obj, fileConfig);
          resolve(obj);
        },
        (progress) => {
          // Loading progress
        },
        reject
      );
    });
  }

  private async loadSTL(fileConfig: FileLoader): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.stlLoader.load(
        fileConfig.path,
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.1,
            roughness: 0.7
          });
          const mesh = new THREE.Mesh(geometry, material);
          this.applyTransforms(mesh, fileConfig);
          resolve(mesh);
        },
        (progress) => {
          // Loading progress
        },
        reject
      );
    });
  }

  private applyTransforms(object: THREE.Object3D, fileConfig: FileLoader) {
    if (fileConfig.scale) {
      object.scale.setScalar(fileConfig.scale);
    }
    
    if (fileConfig.position) {
      object.position.copy(fileConfig.position);
    }
    
    if (fileConfig.rotation) {
      object.rotation.copy(fileConfig.rotation);
    }

    // Ensure proper material setup for architectural visualization
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.1,
            roughness: 0.7
          });
        }
        
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  // Create basic architectural elements programmatically
  createBuilding(width: number, height: number, depth: number): THREE.Group {
    const building = new THREE.Group();
    
    // Main structure
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0, // Start invisible - will fade in after wireframes
      wireframe: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.originalOpacity = 0.1; // Store target opacity for animation
    
    building.add(mesh);
    
    // Add wireframe outline - start invisible for animation, can be made visible
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x0099ff,
      linewidth: 3,
      transparent: true,
      opacity: 0 // Start invisible for line drawing animation
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    wireframe.position.copy(mesh.position);
    wireframe.userData.isArchitecturalWireframe = true; // Mark for animation
    wireframe.userData.targetOpacity = 0.9; // Store target opacity for animation
    
    building.add(wireframe);
    
    return building;
  }

  createWindow(width: number, height: number): THREE.Group {
    const window = new THREE.Group();
    
    // Frame
    const frameGeometry = new THREE.PlaneGeometry(width, height);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0 // Start invisible - will fade in after wireframes
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.userData.originalOpacity = 0.2; // Store target opacity for animation
    
    // Frame outline
    const frameEdges = new THREE.EdgesGeometry(frameGeometry);
    const frameOutline = new THREE.LineSegments(
      frameEdges, 
      new THREE.LineBasicMaterial({ 
        color: 0x0099ff, 
        linewidth: 2,
        transparent: true,
        opacity: 0 // Start invisible for animation
      })
    );
    frameOutline.userData.targetOpacity = 0.8;
    
    // Glass
    const glassGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0, // Start invisible - will fade in after wireframes
      side: THREE.DoubleSide
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.z = 0.01;
    glass.userData.originalOpacity = 0.1; // Store target opacity for animation
    
    // Glass outline
    const glassEdges = new THREE.EdgesGeometry(glassGeometry);
    const glassOutline = new THREE.LineSegments(
      glassEdges, 
      new THREE.LineBasicMaterial({ 
        color: 0x00ccff, 
        linewidth: 1,
        transparent: true,
        opacity: 0 // Start invisible for animation
      })
    );
    glassOutline.userData.targetOpacity = 0.6;
    glassOutline.position.z = 0.01;
    
    window.add(frame, frameOutline, glass, glassOutline);
    return window;
  }

  createDoor(width: number, height: number): THREE.Group {
    const door = new THREE.Group();
    
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({
      color: 0x654321,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0 // Start invisible - will fade in after wireframes
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.originalOpacity = 0.3; // Store target opacity for animation
    
    // Door outline
    const doorEdges = new THREE.EdgesGeometry(geometry);
    const doorOutline = new THREE.LineSegments(
      doorEdges, 
      new THREE.LineBasicMaterial({ 
        color: 0x0099ff, 
        linewidth: 2,
        transparent: true,
        opacity: 0 // Start invisible for animation
      })
    );
    doorOutline.userData.targetOpacity = 0.8;
    
    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.15);
    const handleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd700,
      transparent: true,
      opacity: 0 // Start invisible - will fade in after wireframes
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(width * 0.3, 0, 0.2);
    handle.userData.originalOpacity = 0.8; // Store target opacity for animation
    
    door.add(mesh, doorOutline, handle);
    return door;
  }

  dispose() {
    // Clean up resources
    this.loadingManager.onLoad = () => {};
    this.loadingManager.onProgress = () => {};
    this.loadingManager.onError = () => {};
  }
}
