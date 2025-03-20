export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  shoot: boolean;
  mouseDeltaX: number;
  mouseDeltaY: number;
  pointerLocked: boolean;
}

export interface CameraRotation {
  x: number;
  y: number;
}

export class InputManager {
  private container: HTMLElement;
  private state: InputState;
  private cameraRotation: CameraRotation;
  private mouseSensitivity: number;

  constructor(container: HTMLElement, mouseSensitivity: number = 0.002) {
    this.container = container;
    this.mouseSensitivity = mouseSensitivity;
    
    this.cameraRotation = {
      x: 0,  // Pitch (up/down)
      y: 0   // Yaw (left/right)
    };

    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      shoot: false,
      mouseDeltaX: 0,
      mouseDeltaY: 0,
      pointerLocked: false
    };

    this.setupListeners();
  }

  private setupListeners(): void {
    // Keyboard input
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // Mouse input
    window.addEventListener('mousemove', this.handleMouseMove);
    this.container.addEventListener('click', this.handleContainerClick);
    
    // Pointer lock change
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.state.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.state.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.right = true;
        break;
      case 'Space':
        this.state.jump = true;
        break;
      case 'MouseLeft':
      case 'LeftMouse':
        this.state.shoot = true;
        break;
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.state.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.state.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.right = false;
        break;
      case 'Space':
        this.state.jump = false;
        break;
      case 'MouseLeft':
      case 'LeftMouse':
        this.state.shoot = false;
        break;
    }
  };

  private handleMouseMove = (event: MouseEvent): void => {
    // Only update if pointer is locked
    if (document.pointerLockElement === this.container) {
      // Store the mouse movement for this frame
      this.state.mouseDeltaX = event.movementX;
      this.state.mouseDeltaY = event.movementY;
      
      // Update camera rotation based on mouse movement
      this.cameraRotation.y -= event.movementX * this.mouseSensitivity;
      this.cameraRotation.x -= event.movementY * this.mouseSensitivity;
      
      // Clamp vertical rotation to prevent flipping
      this.cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraRotation.x));
    }
  };

  private handleContainerClick = (): void => {
    // Request pointer lock on click
    if (this.container && !this.state.pointerLocked) {
      this.container.requestPointerLock();
    }
  };

  private handlePointerLockChange = (): void => {
    this.state.pointerLocked = document.pointerLockElement === this.container;
  };

  public getState(): InputState {
    // Return a copy of the state to prevent external modification
    return { ...this.state };
  }

  public getCameraRotation(): CameraRotation {
    return { ...this.cameraRotation };
  }

  public resetMouseDeltas(): void {
    // Reset the mouse deltas after they've been consumed
    this.state.mouseDeltaX = 0;
    this.state.mouseDeltaY = 0;
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('click', this.handleContainerClick);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    
    // Exit pointer lock if active
    if (document.pointerLockElement === this.container) {
      document.exitPointerLock();
    }
  }
} 