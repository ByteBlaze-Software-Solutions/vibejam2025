import * as THREE from 'three';
import { InputState } from './InputManager';

export interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  direction: THREE.Vector3;
  onGround: boolean;
  radius: number;
  speed: number;
  jumpForce: number;
}

export class Player {
  private state: PlayerState;
  private camera: THREE.PerspectiveCamera;
  private raycaster: THREE.Raycaster;
  
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    
    this.state = {
      position: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      direction: new THREE.Vector3(0, 0, 0),
      onGround: true,
      radius: 0.5, // Collision radius
      speed: 0.1,
      jumpForce: 0.15
    };
    
    // Set initial camera position
    this.camera.position.copy(this.state.position);
  }
  
  public update(
    deltaTime: number, 
    input: InputState, 
    colliders: THREE.Mesh[], 
    floor: THREE.Mesh | null
  ): void {
    // Apply gravity if not on ground
    if (!this.state.onGround) {
      this.state.velocity.y -= 0.01 * deltaTime;
    }
    
    // Check if player is on ground
    if (floor) {
      this.raycaster.set(this.state.position, new THREE.Vector3(0, -1, 0));
      const intersects = this.raycaster.intersectObject(floor);
      this.state.onGround = intersects.length > 0 && intersects[0].distance < 1.1;
    }
    
    // Apply jump if on ground and jump key pressed
    if (input.jump && this.state.onGround) {
      this.state.velocity.y = this.state.jumpForce;
      this.state.onGround = false;
    }
    
    // Calculate movement direction from camera
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0; // Keep movement horizontal
    direction.normalize();
    
    // Calculate right direction
    const right = new THREE.Vector3();
    right.crossVectors(direction, this.camera.up).normalize();
    
    // Reset movement direction
    this.state.direction.set(0, 0, 0);
    
    // Apply movement based on input
    if (input.forward) {
      this.state.direction.add(direction);
    }
    if (input.backward) {
      this.state.direction.sub(direction);
    }
    if (input.right) {
      this.state.direction.add(right);
    }
    if (input.left) {
      this.state.direction.sub(right);
    }
    
    // Normalize movement vector and apply speed
    if (this.state.direction.length() > 0) {
      this.state.direction.normalize();
      this.state.direction.multiplyScalar(this.state.speed * deltaTime);
    }
    
    // Calculate next position
    const nextPosition = this.state.position.clone();
    nextPosition.x += this.state.direction.x;
    nextPosition.z += this.state.direction.z;
    
    // Check collision before moving
    if (!this.checkCollision(nextPosition, colliders)) {
      // No collision, apply movement
      this.state.position.x = nextPosition.x;
      this.state.position.z = nextPosition.z;
    } else {
      // Collision occurred, try to slide along objects
      // Try moving in X direction only
      const nextPositionX = this.state.position.clone();
      nextPositionX.x += this.state.direction.x;
      
      if (!this.checkCollision(nextPositionX, colliders)) {
        this.state.position.x = nextPositionX.x;
      }
      
      // Try moving in Z direction only
      const nextPositionZ = this.state.position.clone();
      nextPositionZ.z += this.state.direction.z;
      
      if (!this.checkCollision(nextPositionZ, colliders)) {
        this.state.position.z = nextPositionZ.z;
      }
    }
    
    // Apply vertical velocity
    this.state.position.y += this.state.velocity.y * deltaTime;
    
    // Stop falling if on ground
    if (this.state.position.y < 1 && this.state.velocity.y < 0) {
      this.state.position.y = 1;
      this.state.velocity.y = 0;
      this.state.onGround = true;
    }
    
    // Update camera position to follow player
    this.camera.position.copy(this.state.position);
  }
  
  private checkCollision(position: THREE.Vector3, colliders: THREE.Mesh[]): boolean {
    for (const object of colliders) {
      const objectPosition = object.position.clone();
      
      // Calculate distance on XZ plane (horizontal)
      const dx = position.x - objectPosition.x;
      const dz = position.z - objectPosition.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Check collision based on object type
      if (object.userData.type === 'cylinder') {
        // Cylinder collision (just check radius)
        const minDistance = this.state.radius + object.userData.radius;
        if (distance < minDistance) {
          return true; // Collision detected
        }
      } else if (object.userData.type === 'cube') {
        // Simple approximation for cube collision
        const minDistance = this.state.radius + object.userData.radius;
        if (distance < minDistance) {
          return true; // Collision detected
        }
      }
    }
    
    // No collision
    return false;
  }
  
  public getPosition(): THREE.Vector3 {
    return this.state.position.clone();
  }
  
  public getVelocity(): THREE.Vector3 {
    return this.state.velocity.clone();
  }
  
  public getState(): PlayerState {
    return {
      position: this.state.position.clone(),
      velocity: this.state.velocity.clone(),
      direction: this.state.direction.clone(),
      onGround: this.state.onGround,
      radius: this.state.radius,
      speed: this.state.speed,
      jumpForce: this.state.jumpForce
    };
  }
  
  public setPosition(position: THREE.Vector3): void {
    this.state.position.copy(position);
    this.camera.position.copy(position);
  }
} 