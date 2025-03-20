# Design Decisions

This document records key design decisions made during the development of VibeJam 2025, including the rationale behind each choice and alternatives considered.

## Architecture Decisions

### Client-Server Model

**Decision**: Implement a hybrid authoritative server model with client-side prediction.

**Rationale**: 
- Reduces perceived latency for players
- Prevents common cheating methods
- Provides a consistent experience across different network conditions
- Allows for smooth gameplay even with moderate latency

**Alternatives Considered**:
- Pure peer-to-peer: Rejected due to security concerns and complexity
- Pure authoritative server: Rejected due to excessive perceived latency
- WebRTC data channels: Being evaluated as a potential supplement for time-critical data

### Physics Engine

**Decision**: [TO BE DECIDED]

**Options Being Evaluated**:
- Cannon.js: Lightweight, JavaScript-native physics
- Ammo.js: Port of Bullet physics engine, more powerful but complex

**Evaluation Criteria**:
- Performance in browser environment
- Compatibility with Three.js
- Support for advanced movement mechanics
- Community support and documentation

### State Management

**Decision**: Custom entity component system (ECS) for game state with Redux for UI state.

**Rationale**:
- ECS provides efficient updates for game entities
- Clear separation between rendering and logic
- Redux offers predictable UI state management
- State can be easily serialized for network transmission

**Alternatives Considered**:
- MobX: Less suitable for network synchronization
- Pure OOP approach: Less efficient for large numbers of entities

## Technical Decisions

### Rendering Approach

**Decision**: Implement a hybrid rendering system with Three.js

**Details**:
- Use instanced mesh rendering for similar objects
- Implement frustum culling for improved performance
- Layer-based rendering pipeline for post-processing effects
- Dynamic level of detail based on distance and performance metrics

**Rationale**:
- Balances visual quality with performance
- Allows for scalability across different device capabilities
- Provides flexibility for artistic direction

### Asset Pipeline

**Decision**: [TO BE DECIDED]

**Options Being Evaluated**:
- GLTF format for 3D models
- Basis Universal for texture compression
- Custom shader approach vs. material-based approach

**Considerations**:
- Loading time vs. quality
- Bandwidth requirements
- Browser compatibility
- Tooling support

## Gameplay Decisions

### Movement System

**Decision**: Implement Quake-inspired movement physics with modern enhancements.

**Key Features**:
- Air control for mid-air directional adjustments
- Bunny hopping for skilled players to gain speed
- Rocket jumping as a movement technique
- Wall jumping for vertical traversal

**Rationale**:
- Creates a high skill ceiling
- Rewards player mastery
- Provides distinctive gameplay feel
- Aligns with expectations of FPS genre enthusiasts

### Weapon Design

**Decision**: Balance hitscan and projectile weapons with unique movement interactions.

**Principles**:
- Each weapon serves a specific purpose/range
- Weapons interact with movement mechanics (e.g., rocket jumping)
- Limited weapon slots force strategic choices
- Weapon pickups as map control points

**Alternatives Considered**:
- Loadout system: Rejected to encourage map exploration
- Unlock progression: May be added later for progression system

## Network Protocol Decisions

### Update Frequency

**Decision**: Variable tick rate based on connection quality, targeting 20-60 updates per second.

**Rationale**:
- Adapts to player connection capabilities
- Balances responsiveness with bandwidth usage
- Prevents overwhelming slow connections
- Prioritizes critical game state updates

### Data Compression

**Decision**: Implement custom delta compression with prioritized entity updates.

**Details**:
- Only send changes from previous state
- Prioritize updates based on relevance to player
- Use binary encoding for network packets
- Implement interest management based on player position

**Alternatives Considered**:
- JSON encoding: Too verbose for real-time updates
- Full state updates: Too bandwidth intensive

## UI/UX Decisions

**Decision**: Minimalist HUD with contextual information.

**Features**:
- Core information always visible (health, ammo)
- Contextual indicators for damage direction
- Subtle visual feedback for player status effects
- Customizable HUD elements and opacity

**Rationale**:
- Maximizes screen real estate for gameplay
- Reduces cognitive load during intense gameplay
- Provides necessary information without distraction

## Future Decision Points

- Monetization strategy
- Progression system design
- Community features and social integration
- Map creation and sharing tools
- Tournament and competitive play support 

## Code Architecture Refactoring (2023-03-21)

**Decision**: Refactor the game architecture to a component-based system with clear separation of concerns.

**Current State Analysis**:
- SimpleGame.tsx implements all game logic in a single monolithic file
- Multiple parallel implementations exist (Game.tsx and SimpleGame.tsx)
- Strong foundation with separation of client, server, and shared code
- Good directory structure exists but isn't fully utilized
- Input handling is inconsistent between components

**Refactoring Plan**:
1. Extract core systems from SimpleGame.tsx into dedicated classes:
   - Renderer class for Three.js management
   - Player class for player state and logic
   - World class for environment and colliders
   - InputManager for unified input handling

2. Implement a proper entity-component system:
   - Base Entity class for game objects
   - Component interface for behaviors
   - Composition over inheritance for flexibility

3. Establish a clear update flow:
   - Central game loop with fixed timestep
   - Predictable state updates
   - Event-based communication between systems

4. Integrate networking properly:
   - Dedicated NetworkManager class
   - Entity synchronization
   - Prediction and reconciliation

**Rationale**:
- Improves code maintainability and readability
- Makes extending functionality easier
- Reduces duplicate code
- Creates a more scalable architecture
- Facilitates team collaboration
- Enables better testing and debugging

**Alternatives Considered**:
- Continue with current approach: Rejected due to future maintenance challenges
- Full rewrite: Rejected in favor of incremental refactoring
- External game engine: Rejected to maintain full control over implementation

**Implementation Phases**:
1. Extraction of core systems while maintaining current functionality
2. Implementation of entity-component system
3. Refactor of network code and multiplayer
4. Integration of gameplay systems (weapons, health, etc.) 