import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../styles/SimpleGame.css';

// Basic keyboard controls
interface KeyControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

const SimpleGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Controls state
    const keys: KeyControls = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    // Player state
    const player = {
      position: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      onGround: true,
      speed: 0.1,
      jumpForce: 0.15,
      direction: new THREE.Vector3(),
      radius: 0.5 // Player collision radius
    };
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Create a first-person camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(player.position.x, player.position.y, player.position.z);
    
    // Camera rotation values
    const cameraRotation = {
      x: 0,  // Pitch (up/down)
      y: 0   // Yaw (left/right)
    };
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
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
    scene.add(floor);
    
    // Add some objects to the scene
    const objects: THREE.Mesh[] = [];
    const colliders: THREE.Mesh[] = [];
    
    // Create 10 random cubes
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
      
      // Add collision data
      cube.userData = { 
        type: 'cube',
        width: size,
        depth: size,
        radius: Math.sqrt(2) * size / 2 // Rough approximation for cube collision
      };
      
      scene.add(cube);
      objects.push(cube);
      colliders.push(cube);
    }
    
    // Add 5 random cylinders
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
      
      // Add collision data
      cylinder.userData = { 
        type: 'cylinder',
        radius: radius 
      };
      
      scene.add(cylinder);
      objects.push(cylinder);
      colliders.push(cylinder);
    }
    
    // Input handling
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = true;
          break;
        case 'Space':
          keys.jump = true;
          break;
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = false;
          break;
        case 'Space':
          keys.jump = false;
          break;
      }
    };
    
    // Mouse movement handling for looking around
    const handleMouseMove = (event: MouseEvent) => {
      // Only handle mouse movement if pointer is locked
      if (document.pointerLockElement === mountRef.current) {
        // Update camera rotation values
        cameraRotation.y -= event.movementX * 0.002; // Left/right - reversed direction
        cameraRotation.x -= event.movementY * 0.002; // Up/down
        
        // Clamp vertical rotation to prevent flipping
        cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));
        
        // Apply rotation to camera
        camera.rotation.order = 'YXZ'; // Important for proper FPS controls
        camera.rotation.x = cameraRotation.x;
        camera.rotation.y = cameraRotation.y;
      }
    };
    
    // Handle click to request pointer lock
    const handleClick = () => {
      if (mountRef.current) {
        mountRef.current.requestPointerLock();
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleClick);

    // Create a raycaster for ground detection
    const raycaster = new THREE.Raycaster();
    
    // Check collision between player and object
    const checkCollision = (nextPosition: THREE.Vector3) => {
      for (const object of colliders) {
        const objectPosition = object.position.clone();
        
        // Calculate distance on XZ plane (horizontal)
        const dx = nextPosition.x - objectPosition.x;
        const dz = nextPosition.z - objectPosition.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Check collision based on object type
        if (object.userData.type === 'cylinder') {
          // Cylinder collision (just check radius)
          const minDistance = player.radius + object.userData.radius;
          if (distance < minDistance) {
            return true; // Collision detected
          }
        } else if (object.userData.type === 'cube') {
          // Simple approximation for cube collision
          const minDistance = player.radius + object.userData.radius;
          if (distance < minDistance) {
            return true; // Collision detected
          }
        }
      }
      
      // No collision
      return false;
    };
    
    // Update physics and movement
    const updateMovement = () => {
      // Apply gravity
      if (!player.onGround) {
        player.velocity.y -= 0.01; // Gravity
      }
      
      // Check if player is on ground
      raycaster.set(player.position, new THREE.Vector3(0, -1, 0));
      const intersects = raycaster.intersectObject(floor);
      player.onGround = intersects.length > 0 && intersects[0].distance < 1.1;
      
      // Apply jump if on ground
      if (keys.jump && player.onGround) {
        player.velocity.y = player.jumpForce;
        player.onGround = false;
      }
      
      // Calculate forward direction based on camera rotation
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0; // Keep movement horizontal
      direction.normalize();
      
      // Calculate right direction (reversed for correct orientation)
      const right = new THREE.Vector3();
      right.crossVectors(direction, camera.up).normalize(); // Changed order to fix direction
      
      // Reset movement direction
      player.direction.set(0, 0, 0);
      
      // Apply movement based on keys
      if (keys.forward) {
        player.direction.add(direction);
      }
      if (keys.backward) {
        player.direction.sub(direction);
      }
      if (keys.right) {
        player.direction.add(right);
      }
      if (keys.left) {
        player.direction.sub(right);
      }
      
      // Normalize movement vector and apply speed
      if (player.direction.length() > 0) {
        player.direction.normalize();
        player.direction.multiplyScalar(player.speed);
      }
      
      // Calculate next position
      const nextPosition = player.position.clone();
      nextPosition.x += player.direction.x;
      nextPosition.z += player.direction.z;
      
      // Check collision before moving
      if (!checkCollision(nextPosition)) {
        // No collision, apply movement
        player.position.x = nextPosition.x;
        player.position.z = nextPosition.z;
      } else {
        // Collision occurred, try to slide along objects
        // Try moving in X direction only
        const nextPositionX = player.position.clone();
        nextPositionX.x += player.direction.x;
        
        if (!checkCollision(nextPositionX)) {
          player.position.x = nextPositionX.x;
        }
        
        // Try moving in Z direction only
        const nextPositionZ = player.position.clone();
        nextPositionZ.z += player.direction.z;
        
        if (!checkCollision(nextPositionZ)) {
          player.position.z = nextPositionZ.z;
        }
      }
      
      // Apply vertical velocity
      player.position.y += player.velocity.y;
      
      // Stop falling if on ground
      if (player.position.y < 1 && player.velocity.y < 0) {
        player.position.y = 1;
        player.velocity.y = 0;
        player.onGround = true;
      }
      
      // Update camera position to follow player
      camera.position.copy(player.position);
    };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update player movement
      updateMovement();
      
      // Rotate objects for visual interest
      objects.forEach((object, index) => {
        object.rotation.y += 0.005 * (index % 3 + 1);
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('click', handleClick);
      
      // Dispose geometries and materials
      floorGeometry.dispose();
      floorMaterial.dispose();
      
      objects.forEach(object => {
        (object.geometry as THREE.BufferGeometry).dispose();
        (object.material as THREE.Material).dispose();
      });
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="simple-game-container">
      <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }} />
      <div className="game-instructions">
        Click to look around. WASD to move. Space to jump.
      </div>
    </div>
  );
};

export default SimpleGame; 