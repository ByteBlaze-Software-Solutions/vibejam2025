import * as THREE from 'three';

export class Renderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;

  constructor(container: HTMLElement, width?: number, height?: number) {
    this.container = container;
    const w = width || window.innerWidth;
    const h = height || window.innerHeight;

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.set(0, 1, 0);

    // Add basic lighting
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', this.handleResize);
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
  }

  private handleResize = (): void => {
    if (!this.container) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public setCameraPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  public setCameraRotation(x: number, y: number, z: number): void {
    this.camera.rotation.set(x, y, z);
  }

  public dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
    
    if (this.container) {
      try {
        this.container.removeChild(this.renderer.domElement);
      } catch (e) {
        console.warn('Error removing renderer from container', e);
      }
    }
  }
} 