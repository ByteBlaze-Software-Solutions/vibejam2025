import * as THREE from 'three';

class Controls {
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private target: HTMLElement;
  
  private moveForward: boolean = false;
  private moveBackward: boolean = false;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private jump: boolean = false;
  
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private direction: THREE.Vector3 = new THREE.Vector3();
  
  private mouseSensitivity: number = 0.002;
  private moveSpeed: number = 5.0;
  private jumpForce: number = 10.0;
  
  private euler: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private isLocked: boolean = false;
  
  constructor(camera: THREE.PerspectiveCamera, container: HTMLElement) {
    this.camera = camera;
    this.container = container;
    this.target = document.body;
    
    this.setupPointerLock();
    this.setupEventListeners();
  }
  
  private setupPointerLock(): void {
    // Set up pointer lock controls for first-person camera
    this.target.requestPointerLock = this.target.requestPointerLock ||
      (this.target as any).mozRequestPointerLock ||
      (this.target as any).webkitRequestPointerLock;
    
    document.exitPointerLock = document.exitPointerLock ||
      (document as any).mozExitPointerLock ||
      (document as any).webkitExitPointerLock;
    
    // Lock pointer on click
    this.container.addEventListener('click', () => {
      this.target.requestPointerLock();
    });
    
    // Handle pointer lock change
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
    document.addEventListener('mozpointerlockchange', this.onPointerLockChange.bind(this));
    document.addEventListener('webkitpointerlockchange', this.onPointerLockChange.bind(this));
  }
  
  private onPointerLockChange(): void {
    if (document.pointerLockElement === this.target || 
        (document as any).mozPointerLockElement === this.target || 
        (document as any).webkitPointerLockElement === this.target) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
  }
  
  private setupEventListeners(): void {
    // Mouse movement for camera control
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Keyboard controls for movement
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }
  
  private onMouseMove(event: MouseEvent): void {
    if (!this.isLocked) return;
    
    const movementX = event.movementX || (event as any).mozMovementX || (event as any).webkitMovementX || 0;
    const movementY = event.movementY || (event as any).mozMovementY || (event as any).webkitMovementY || 0;
    
    this.euler.setFromQuaternion(this.camera.quaternion);
    
    this.euler.y -= movementX * this.mouseSensitivity;
    this.euler.x -= movementY * this.mouseSensitivity;
    
    // Limit vertical rotation
    this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
    
    this.camera.quaternion.setFromEuler(this.euler);
  }
  
  private onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'Space':
        this.jump = true;
        break;
    }
  }
  
  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'Space':
        this.jump = false;
        break;
    }
  }
  
  update(delta: number): void {
    if (!this.isLocked) return;
    
    // Calculate movement direction based on camera orientation
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();
    
    // Apply movement to velocity
    const moveSpeed = this.moveSpeed * delta;
    
    if (this.moveForward || this.moveBackward) {
      this.velocity.z = -this.direction.z * moveSpeed;
    }
    
    if (this.moveLeft || this.moveRight) {
      this.velocity.x = this.direction.x * moveSpeed;
    }
    
    // Apply jump force
    if (this.jump) {
      this.velocity.y = this.jumpForce * delta;
      this.jump = false; // Reset jump to prevent continuous jumping
    }
    
    // Apply velocity to camera position
    this.camera.position.x += this.velocity.x;
    this.camera.position.y += this.velocity.y;
    this.camera.position.z += this.velocity.z;
    
    // Apply gravity (simplified)
    if (this.camera.position.y > 1.7) {
      this.velocity.y -= 9.8 * delta; // Gravity force
    } else {
      this.velocity.y = 0;
      this.camera.position.y = 1.7; // Keep at eye height
    }
    
    // Dampen velocity for smooth movement
    this.velocity.x *= 0.9;
    this.velocity.z *= 0.9;
  }
  
  dispose(): void {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));
    document.removeEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
    document.removeEventListener('mozpointerlockchange', this.onPointerLockChange.bind(this));
    document.removeEventListener('webkitpointerlockchange', this.onPointerLockChange.bind(this));
  }
}

export default Controls; 