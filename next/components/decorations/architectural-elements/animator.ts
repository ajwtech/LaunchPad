// Animation system for architectural elements
import * as THREE from 'three';
import { AnimationConfig, DrawingAnimation, ArchitecturalElement } from './types';
import { debugLog, debugTime } from './debug';

export class ArchitecturalAnimator {
  private animations: Map<string, THREE.AnimationMixer> = new Map();
  private clock = new THREE.Clock();
  private activeAnimations: Set<string> = new Set();

  constructor() {
    this.setupAnimationLoop();
  }

  private setupAnimationLoop() {
    const animate = () => {
      const delta = this.clock.getDelta();
      
      // Update all active animation mixers
      this.animations.forEach((mixer, id) => {
        if (this.activeAnimations.has(id)) {
          mixer.update(delta);
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  // Public method to reset all elements to their initial animation state
  resetElements(elements: THREE.Object3D[]) {
    // Clear any active animations
    this.activeAnimations.clear();
    
    elements.forEach(element => {
      this.resetElementMaterials(element);
    });
    debugLog.animation(`Reset ${elements.length} elements to initial state`);
  }

  // Animate drawing/construction of architectural elements
  async animateDrawing(
    object: THREE.Object3D, 
    config: AnimationConfig,
    elementId: string
  ): Promise<void> {
    return new Promise((resolve) => {
      config.onStart?.();
      
      switch (config.type) {
        case 'draw':
          this.animateLineDrawing(object, config, elementId, resolve);
          break;
        case 'fade':
          this.animateFadeIn(object, config, elementId, resolve);
          break;
        case 'scale':
          this.animateScale(object, config, elementId, resolve);
          break;
        case 'slide':
          this.animateSlide(object, config, elementId, resolve);
          break;
        case 'rotate':
          this.animateRotate(object, config, elementId, resolve);
          break;
        default:
          resolve();
      }
    });
  }

  // Reset all materials to their initial state for animation
  private resetElementMaterials(object: THREE.Object3D) {
    object.traverse((child) => {
      if (child instanceof THREE.LineSegments && child.userData.isArchitecturalWireframe) {
        const material = child.material as THREE.LineBasicMaterial;
        if (material) {
          material.opacity = 0; // Reset to invisible
          material.transparent = true;
          debugLog.opacity(`Reset wireframe opacity to 0 for animation`);
        }
      }
      // Also reset solid meshes to be invisible for sequential animation
      if (child instanceof THREE.Mesh && !child.userData.isArchitecturalWireframe) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material && material.transparent) {
          // Store original opacity if not already stored
          if (child.userData.originalOpacity === undefined) {
            child.userData.originalOpacity = material.opacity;
          }
          material.opacity = 0; // Start invisible
          material.transparent = true;
          debugLog.opacity(`Reset mesh opacity to 0 for sequential animation`);
        }
      }
    });
  }

  private animateLineDrawing(
    object: THREE.Object3D,
    config: AnimationConfig,
    elementId: string,
    onComplete: () => void
  ) {
    debugLog.animation(`Starting line drawing animation for:`, object.type, object.children.length);
    
    // Reset all wireframes to initial state before animating
    this.resetElementMaterials(object);
    
    // For wireframe/line drawing effect
    const lines: THREE.LineSegments[] = [];
    
    object.traverse((child) => {
      if (child instanceof THREE.LineSegments) {
        lines.push(child);
        debugLog.animation(`Found LineSegments:`, child);
      }
    });

    if (lines.length === 0) {
      debugLog.animation('No LineSegments found, completing immediately');
      onComplete();
      return;
    }

    let completedLines = 0;
    const totalLines = lines.length;

    lines.forEach((lineSegment, lineIndex) => {
      // Store original geometry and material
      const originalGeometry = lineSegment.geometry;
      const originalMaterial = lineSegment.material as THREE.LineBasicMaterial;
      const positions = originalGeometry.attributes.position.array as Float32Array;
      
      // Get target opacity from userData, fallback to current opacity
      const targetOpacity = lineSegment.userData.targetOpacity || originalMaterial.opacity || 0.9;
      
      // ALWAYS start from 0 for drawing effect
      originalMaterial.opacity = 0;
      originalMaterial.transparent = true;
      
      // Create dynamic geometry for line drawing
      const drawingGeometry = new THREE.BufferGeometry();
      const currentPositions = new Float32Array(positions.length);
      drawingGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
      
      // Store reference to original geometry for cleanup
      const originalGeometryRef = lineSegment.geometry;
      
      // Temporarily replace geometry
      lineSegment.geometry = drawingGeometry;
      
      // Animate line drawing
      let progress = 0;
      const animate = () => {
        progress += 1 / (config.duration * 60 / 1000); // 60fps assumption
        
        if (progress >= 1) {
          progress = 1;
          // Restore original geometry and make fully visible
          lineSegment.geometry = originalGeometryRef;
          originalMaterial.opacity = targetOpacity;
          
          // Debug final state
          debugLog.opacity(`Line ${lineIndex} completed - Final opacity: ${originalMaterial.opacity}, target was: ${targetOpacity}`);
          
          // Clean up the temporary geometry
          drawingGeometry.dispose();
          
          completedLines++;
          if (completedLines === totalLines) {
            debugLog.animation('All line animations completed - starting solid mesh fade-in');
            
            // Start fading in solid meshes after wireframes are complete
            setTimeout(() => {
              this.animateSolidMeshFadeIn(object, 1500);
            }, 200); // Small delay after wireframes complete
            
            config.onComplete?.();
            onComplete();
          }
          return;
        }
        
        // Update visible portion of the line
        const visiblePoints = Math.floor(progress * positions.length);
        for (let i = 0; i < visiblePoints; i++) {
          currentPositions[i] = positions[i];
        }
        
        // Make the drawing visible as it progresses
        const currentOpacity = progress * targetOpacity;
        originalMaterial.opacity = currentOpacity;
        drawingGeometry.attributes.position.needsUpdate = true;
        
        // Debug opacity changes
        if (lineIndex === 0 && Math.floor(progress * 10) !== Math.floor((progress - 0.1) * 10)) {
          debugLog.opacity(`Animation progress: ${(progress * 100).toFixed(1)}%, opacity: ${currentOpacity.toFixed(3)}, target: ${targetOpacity}`);
        }
        
        requestAnimationFrame(animate);
      };
      
      // Start animation with delay
      setTimeout(() => {
        debugLog.animation(`Starting animation for line ${lineIndex}`);
        requestAnimationFrame(animate);
      }, config.delay + lineIndex * 200); // Slight stagger between lines
    });
  }

  // Animate solid meshes fading in after wireframes are complete
  private animateSolidMeshFadeIn(object: THREE.Object3D, duration: number = 1500) {
    const meshes: THREE.Mesh[] = [];
    
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isArchitecturalWireframe) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material && material.transparent) {
          meshes.push(child);
        }
      }
    });

    if (meshes.length === 0) {
      debugLog.animation('No solid meshes found to fade in');
      return;
    }

    debugLog.animation(`Starting fade-in for ${meshes.length} solid meshes`);
    
    meshes.forEach((mesh, index) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const targetOpacity = mesh.userData.originalOpacity || 0.1;
      let progress = 0;
      
      const animate = () => {
        progress += 1 / (duration * 60 / 1000); // 60fps assumption
        
        if (progress >= 1) {
          progress = 1;
          material.opacity = targetOpacity;
          debugLog.opacity(`Mesh ${index} fade-in completed - Final opacity: ${material.opacity}`);
          return;
        }
        
        material.opacity = progress * targetOpacity;
        requestAnimationFrame(animate);
      };
      
      // Start fade-in with a slight delay between meshes for a nice effect
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, index * 100);
    });
  }

  private animateFadeIn(
    object: THREE.Object3D,
    config: AnimationConfig,
    elementId: string,
    onComplete: () => void
  ) {
    const materials: THREE.Material[] = [];
    
    // Collect all materials and set initial opacity
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.Material;
        materials.push(material);
        
        if ('opacity' in material) {
          material.transparent = true;
          (material as any).opacity = 0;
        }
      }
    });

    // Animate opacity
    let progress = 0;
    const animate = () => {
      progress += 1 / (config.duration * 60 / 1000);
      
      if (progress >= 1) {
        progress = 1;
        config.onComplete?.();
        onComplete();
      }
      
      const opacity = this.easeInOut(progress);
      
      materials.forEach(material => {
        if ('opacity' in material) {
          (material as any).opacity = opacity;
        }
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, config.delay);
  }

  private animateScale(
    object: THREE.Object3D,
    config: AnimationConfig,
    elementId: string,
    onComplete: () => void
  ) {
    const originalScale = object.scale.clone();
    object.scale.set(0, 0, 0);
    
    let progress = 0;
    const animate = () => {
      progress += 1 / (config.duration * 60 / 1000);
      
      if (progress >= 1) {
        progress = 1;
        config.onComplete?.();
        onComplete();
      }
      
      const scale = this.easeInOut(progress);
      object.scale.copy(originalScale).multiplyScalar(scale);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, config.delay);
  }

  private animateSlide(
    object: THREE.Object3D,
    config: AnimationConfig,
    elementId: string,
    onComplete: () => void
  ) {
    const originalPosition = object.position.clone();
    const startPosition = originalPosition.clone();
    startPosition.y -= 10; // Slide from below
    
    object.position.copy(startPosition);
    
    let progress = 0;
    const animate = () => {
      progress += 1 / (config.duration * 60 / 1000);
      
      if (progress >= 1) {
        progress = 1;
        config.onComplete?.();
        onComplete();
      }
      
      const eased = this.easeInOut(progress);
      object.position.lerpVectors(startPosition, originalPosition, eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, config.delay);
  }

  private animateRotate(
    object: THREE.Object3D,
    config: AnimationConfig,
    elementId: string,
    onComplete: () => void
  ) {
    const originalRotation = object.rotation.clone();
    const startRotation = originalRotation.clone();
    startRotation.y += Math.PI * 2; // Full rotation
    
    object.rotation.copy(startRotation);
    
    let progress = 0;
    const animate = () => {
      progress += 1 / (config.duration * 60 / 1000);
      
      if (progress >= 1) {
        progress = 1;
        config.onComplete?.();
        onComplete();
      }
      
      const eased = this.easeInOut(progress);
      object.rotation.y = THREE.MathUtils.lerp(startRotation.y, originalRotation.y, eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, config.delay);
  }

  // Easing function for smooth animations
  private easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Create sequential animation timeline
  async animateSequence(animations: DrawingAnimation[]): Promise<void> {
    for (const animation of animations) {
      await this.animateDrawing(
        animation.element as any, // Cast needed for object type
        animation.config,
        animation.element.id
      );
    }
  }

  // Animate multiple elements in parallel
  async animateParallel(animations: DrawingAnimation[]): Promise<void> {
    const promises = animations.map(animation =>
      this.animateDrawing(
        animation.element as any,
        animation.config,
        animation.element.id
      )
    );
    
    await Promise.all(promises);
  }

  stopAnimation(elementId: string) {
    this.activeAnimations.delete(elementId);
    const mixer = this.animations.get(elementId);
    if (mixer) {
      mixer.stopAllAction();
    }
  }

  pauseAnimation(elementId: string) {
    this.activeAnimations.delete(elementId);
  }

  resumeAnimation(elementId: string) {
    this.activeAnimations.add(elementId);
  }

  dispose() {
    this.animations.forEach(mixer => mixer.stopAllAction());
    this.animations.clear();
    this.activeAnimations.clear();
  }
}
