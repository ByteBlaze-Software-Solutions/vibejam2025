# VibeJam 2025 Core Game Engine

This directory contains the core components of the VibeJam 2025 game engine. The architecture follows a component-based design with clear separation of concerns.

## Architecture Overview

The engine is built around several key components:

- **Engine**: The main entry point that coordinates all other systems
- **Renderer**: Handles Three.js scene, camera, and rendering
- **World**: Manages the game environment and objects within it
- **InputManager**: Processes keyboard and mouse input
- **Player**: Handles player state, movement, and physics

## Component Relationships

```
Engine
  ├── Renderer (scene, camera, lighting)
  ├── World (environment, objects, colliders)
  ├── Player (movement, collision, state)
  └── InputManager (keyboard, mouse, pointer lock)
```

## Usage

To use the engine in a React component:

```tsx
import { Engine } from './core/Engine';

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create and initialize the game engine
    const engine = new Engine(mountRef.current);
    engineRef.current = engine;
    
    // Start the game loop
    engine.start();
    
    // Cleanup
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);
  
  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};
```

## Next Steps

Future development will introduce an Entity-Component System (ECS) to make the engine more flexible and extendable.

Planned components:
- Entity class as a container for components
- Component interface for entity behaviors
- Transform, Physics, Collider components
- Entity management system 