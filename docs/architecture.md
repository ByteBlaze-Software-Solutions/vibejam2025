# VibeJam 2025 Architecture Overview

This document provides a comprehensive overview of the VibeJam 2025 game architecture, serving as a guide for development and maintenance.

## High-Level Architecture

VibeJam 2025 is structured with a clear separation between client, server, and shared code:

```
vibejam2025/
├── client/ - Frontend game client
├── server/ - Backend game server
└── shared/ - Code shared between client and server
```

### Client Architecture

The client is built using React for UI and Three.js for 3D rendering, following a component-based architecture:

```
client/src/
├── game/ - Game engine and systems
│   ├── core/ - Core engine components
│   ├── entities/ - Game objects
│   ├── components/ - Entity behaviors
│   ├── controls/ - Input handling
│   ├── rendering/ - Graphics and rendering
│   ├── ui/ - In-game UI elements
│   ├── audio/ - Sound system
│   ├── networking/ - Client-side networking
│   └── utils/ - Utility functions
├── ui/ - React UI components
├── styles/ - CSS styles
└── assets/ - Game assets
```

### Server Architecture

The server uses Node.js with Express and Socket.IO for real-time communication:

```
server/src/
├── game/ - Game logic
│   ├── world/ - World management
│   ├── entities/ - Server-side entities
│   └── physics/ - Physics simulation
├── networking/ - Socket handling
├── matchmaking/ - Player matching
├── auth/ - Authentication (future)
├── database/ - Data persistence (future)
└── utils/ - Utility functions
```

### Shared Code

Code shared between client and server to ensure consistency:

```
shared/
├── types/ - TypeScript interfaces
├── utils/ - Shared utilities
└── constants/ - Game constants
```

## Core Systems

### Entity Component System (ECS)

The game uses a component-based architecture where:

1. **Entities** are containers for components (players, weapons, etc.)
2. **Components** define specific behaviors or data
3. **Systems** process entities with specific components

This approach provides:
- Flexibility to compose game objects from reusable parts
- Better organization of code by responsibility
- Improved performance through specialized processing

### Example Entity Structure

```typescript
// Base Entity class
class Entity {
  id: string;
  components: Map<string, Component>;
  
  addComponent(component: Component): void;
  getComponent<T extends Component>(type: string): T;
  removeComponent(type: string): void;
  update(delta: number): void;
}

// Player entity example
class Player extends Entity {
  constructor() {
    super();
    this.addComponent(new TransformComponent());
    this.addComponent(new InputComponent());
    this.addComponent(new CameraComponent());
    this.addComponent(new PhysicsComponent());
    this.addComponent(new HealthComponent(100));
  }
}
```

### Game Loop and Update Flow

The game uses a fixed timestep update loop:

1. Process inputs
2. Update game state
3. Apply physics
4. Update networking
5. Render frame

This ensures consistent simulation regardless of frame rate.

## Networking Architecture

### Client-Server Communication

The game uses Socket.IO for real-time communication with:

1. **Server Authority**: Server maintains the authoritative game state
2. **Client Prediction**: Clients predict movement locally
3. **Server Reconciliation**: Server corrects client predictions when needed
4. **Entity Interpolation**: Smooth movement for network entities

### Network Protocol

```
Client to Server:
- Player inputs (movement, actions)
- Connection management
- Matchmaking requests

Server to Client:
- Game state updates
- Entity positions
- Game events
- Matchmaking responses
```

## Rendering Pipeline

Three.js is used for 3D rendering with a pipeline that includes:

1. Scene management
2. Material and shader control
3. Camera handling
4. Post-processing effects
5. Optimization techniques (frustum culling, instancing, LOD)

## Current Implementation Status

As of March 2023, the project includes:

- Basic Three.js rendering with a simple 3D environment
- First-person camera and controls
- Simple collision detection
- Basic server with Socket.IO communication
- Initial matchmaking system

## Future Architecture Plans

The refactoring plan involves:

1. **Phase 1**: Extract core systems from monolithic files
2. **Phase 2**: Implement entity-component system
3. **Phase 3**: Improve networking with prediction/reconciliation
4. **Phase 4**: Add gameplay systems (weapons, health, etc.)

## Best Practices

When contributing to the project, follow these architectural principles:

1. **Separation of Concerns**: Each class should have a single responsibility
2. **Composition over Inheritance**: Favor component composition
3. **Type Safety**: Use TypeScript interfaces and types properly
4. **Testability**: Design systems to be testable in isolation
5. **Performance Awareness**: Consider performance implications
6. **Code Documentation**: Document public APIs and complex logic

## Diagrams

(Future: Add system interaction diagrams, data flow diagrams, and state diagrams) 