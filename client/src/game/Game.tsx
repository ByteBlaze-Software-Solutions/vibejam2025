import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Renderer from './renderer/Renderer';
import Controls from './controls/Controls';
import '../styles/Game.css';

interface GameProps {
  onExit: () => void;
}

const Game: React.FC<GameProps> = ({ onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<GameInstance | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize the game
    gameInstanceRef.current = new GameInstance(containerRef.current);
    gameInstanceRef.current.init();
    
    // Start the game loop
    gameInstanceRef.current.start();
    
    // Cleanup on unmount
    return () => {
      gameInstanceRef.current?.dispose();
    };
  }, []);
  
  return (
    <div className="game-wrapper">
      <div className="game-container" ref={containerRef}></div>
      
      {/* In-game UI */}
      <div className="game-ui ui-layer">
        {/* Crosshair */}
        <div className="crosshair"></div>
        
        {/* Health and Ammo */}
        <div className="player-stats">
          <div className="health">Health: 100</div>
          <div className="ammo">Ammo: 50</div>
        </div>
        
        {/* FPS Counter */}
        <div className="fps-counter">60 FPS</div>
        
        {/* Pause Menu Button */}
        <button className="pause-button ui-control" onClick={onExit}>
          Exit
        </button>
      </div>
    </div>
  );
};

// Game instance class to handle Three.js setup
class GameInstance {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: Renderer;
  private controls: Controls | null = null;
  private clock: THREE.Clock;
  private running: boolean = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      90, // FOV
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new Renderer(container);
    this.clock = new THREE.Clock();
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  init(): void {
    // Set up scene background
    this.scene.background = new THREE.Color(0x111111);
    
    // Set up camera position
    this.camera.position.set(0, 1.7, 0); // Typical player height
    
    // Set up controls
    this.controls = new Controls(this.camera, this.container);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
    
    // Add a temporary floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = 0;
    this.scene.add(floor);
    
    // Add some test cubes
    this.addTestCubes();
  }
  
  addTestCubes(): void {
    // Add some cubes to the scene for testing
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 2 + 0.5;
      const geometry = new THREE.BoxGeometry(size, size, size);
      
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
      const material = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.7,
        metalness: 0.2
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // Random position
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 20 + 5;
      cube.position.x = Math.cos(angle) * distance;
      cube.position.z = Math.sin(angle) * distance;
      cube.position.y = size / 2; // Half height above ground
      
      this.scene.add(cube);
    }
  }
  
  start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this.animate();
  }
  
  stop(): void {
    this.running = false;
  }
  
  animate(): void {
    if (!this.running) return;
    
    requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // Update controls
    this.controls?.update(delta);
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  onWindowResize(): void {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  dispose(): void {
    this.stop();
    this.controls?.dispose();
    this.renderer.dispose();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}

export default Game; 