import * as THREE from 'three';

export interface WorldObject {
  mesh: THREE.Mesh;
  type: string;
  collider: boolean;
}

export class World {
  private scene: THREE.Scene;
  private objects: WorldObject[] = [];
  private colliders: THREE.Mesh[] = [];
  private floor: THREE.Mesh | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createBasicEnvironment(): void {
    this.createFloor();
    this.createRandomObjects();
  }

  private createFloor(): void {
    // Create a floor (ground)
    const floorGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3a7e4c,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = 0;
    floor.receiveShadow = true;
    
    this.scene.add(floor);
    this.floor = floor;
  }

  private createRandomObjects(): void {
    // Create random cubes
    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 2 + 0.5;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xff6b35,
        roughness: 0.7,
        metalness: 0.2
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // Random position
      cube.position.x = (Math.random() - 0.5) * 40;
      cube.position.y = size / 2; // Rest on the ground
      cube.position.z = (Math.random() - 0.5) * 40;
      
      // Random rotation
      cube.rotation.y = Math.random() * Math.PI * 2;
      
      // Shadow
      cube.castShadow = true;
      cube.receiveShadow = true;
      
      // Add collision data
      const userData = { 
        type: 'cube',
        width: size,
        depth: size,
        radius: Math.sqrt(2) * size / 2 // Rough approximation for cube collision
      };
      
      cube.userData = userData;
      
      this.scene.add(cube);
      this.objects.push({ mesh: cube, type: 'cube', collider: true });
      this.colliders.push(cube);
    }
    
    // Add random cylinders
    for (let i = 0; i < 5; i++) {
      const radius = Math.random() * 1 + 0.5;
      const height = Math.random() * 3 + 1;
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x1a2a6c,
        roughness: 0.7,
        metalness: 0.3
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      
      // Random position
      cylinder.position.x = (Math.random() - 0.5) * 40;
      cylinder.position.y = height / 2; // Rest on the ground
      cylinder.position.z = (Math.random() - 0.5) * 40;
      
      // Shadow
      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      
      // Add collision data
      const userData = { 
        type: 'cylinder',
        radius: radius 
      };
      
      cylinder.userData = userData;
      
      this.scene.add(cylinder);
      this.objects.push({ mesh: cylinder, type: 'cylinder', collider: true });
      this.colliders.push(cylinder);
    }
  }

  public update(delta: number): void {
    // Animate objects for visual interest
    this.objects.forEach((object, index) => {
      object.mesh.rotation.y += 0.005 * (index % 3 + 1) * delta;
    });
  }

  public getColliders(): THREE.Mesh[] {
    return this.colliders;
  }

  public getFloor(): THREE.Mesh | null {
    return this.floor;
  }

  public getObjects(): WorldObject[] {
    return this.objects;
  }

  public dispose(): void {
    // Clean up geometries and materials
    this.objects.forEach(object => {
      (object.mesh.geometry as THREE.BufferGeometry).dispose();
      if (Array.isArray(object.mesh.material)) {
        object.mesh.material.forEach(material => material.dispose());
      } else {
        (object.mesh.material as THREE.Material).dispose();
      }
      this.scene.remove(object.mesh);
    });
    
    if (this.floor) {
      (this.floor.geometry as THREE.BufferGeometry).dispose();
      (this.floor.material as THREE.Material).dispose();
      this.scene.remove(this.floor);
    }
    
    this.objects = [];
    this.colliders = [];
    this.floor = null;
  }
} 