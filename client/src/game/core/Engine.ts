import * as THREE from 'three';
import { Renderer } from './Renderer';
import { World } from './World';
import { Player } from './Player';
import { InputManager } from './InputManager';

export class Engine {
  private renderer: Renderer;
  private world: World;
  private player: Player;
  private inputManager: InputManager;
  private clock: THREE.Clock;
  private isRunning: boolean = false;
  private lastTime: number = 0;

  constructor(container: HTMLElement) {
    // Create the renderer (which also sets up scene and camera)
    this.renderer = new Renderer(container);
    
    // Create the world and add objects to the scene
    this.world = new World(this.renderer.getScene());
    this.world.createBasicEnvironment();
    
    // Create the player and attach to the camera
    this.player = new Player(this.renderer.getCamera());
    
    // Create input manager
    this.inputManager = new InputManager(container);
    
    // Create clock for timing
    this.clock = new THREE.Clock();
  }

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.clock.start();
      this.lastTime = 0;
      this.update();
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.clock.stop();
  }

  private update = (): void => {
    if (!this.isRunning) return;
    
    requestAnimationFrame(this.update);
    
    // Calculate delta time (in seconds)
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = Math.min(0.1, elapsedTime - this.lastTime); // Cap at 0.1 to prevent large jumps
    this.lastTime = elapsedTime;
    
    // Apply camera rotation from input manager
    const cameraRotation = this.inputManager.getCameraRotation();
    this.renderer.getCamera().rotation.order = 'YXZ'; // Important for proper FPS controls
    this.renderer.getCamera().rotation.x = cameraRotation.x;
    this.renderer.getCamera().rotation.y = cameraRotation.y;
    
    // Update player based on input and collisions
    this.player.update(
      deltaTime * 60, // Normalize to 60fps for consistent movement speed
      this.inputManager.getState(),
      this.world.getColliders(),
      this.world.getFloor()
    );
    
    // Update the world
    this.world.update(deltaTime);
    
    // Render the scene
    this.renderer.render();
    
    // Reset input manager mouse deltas
    this.inputManager.resetMouseDeltas();
  }

  public resize(): void {
    // Handle resizing (called by parent component when container size changes)
    // Most resize handling is done internally by the Renderer
  }

  public dispose(): void {
    this.stop();
    this.inputManager.dispose();
    this.world.dispose();
    this.renderer.dispose();
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getWorld(): World {
    return this.world;
  }

  public getRenderer(): Renderer {
    return this.renderer;
  }
} 