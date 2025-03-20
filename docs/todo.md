# VibeJam 2025 - Todo List

This document tracks planned tasks, progress, and decision notes for the VibeJam 2025 FPS game project.

## Project Setup Phase

### Environment & Tooling
- [x] Initialize Git repository
- [x] Set up project structure
- [x] Configure TypeScript
- [x] Set up bundler (Webpack/Vite)
- [x] Create initial package.json with dependencies
- [x] Configure linting and formatting (ESLint, Prettier)
- [ ] Set up test environment (Jest)

### Core Technology Evaluation
- [ ] Evaluate physics engines (Cannon.js vs Ammo.js)
- [ ] Evaluate rendering optimization approaches
- [ ] Research netcode best practices for browser FPS
- [ ] Decide on state management approach

## Prototype Phase

### Basic Rendering
- [x] Set up Three.js scene
- [x] Implement first-person camera
- [x] Create basic level geometry
- [x] Implement lighting system
- [ ] Add material and shader system

### Player Movement
- [x] Implement keyboard/mouse input handling
- [x] Create basic player controller
- [x] Implement collision detection
- [x] Add basic movement physics
- [x] Implement jumping and gravity

### Weapons & Combat
- [ ] Design weapon system architecture
- [ ] Implement projectile system
- [ ] Create hitscan weapon
- [ ] Add projectile weapon
- [ ] Implement player health and damage

## Networking Phase

### Backend Setup
- [x] Initialize Node.js server
- [x] Set up Socket.IO
- [x] Create basic game state management
- [x] Implement player connection/disconnection handling
- [x] Design serialization format

### Multiplayer Fundamentals
- [ ] Implement client-side prediction
- [ ] Add server reconciliation
- [ ] Create entity interpolation system
- [ ] Test with multiple clients
- [ ] Optimize network traffic

## Advanced Gameplay Phase

### Movement Mechanics
- [ ] Implement strafe jumping
- [ ] Add rocket jumping
- [ ] Create bunny hopping
- [ ] Fine-tune air control
- [ ] Polish movement feel

### Weapons & Balance
- [ ] Create multiple weapon types
- [ ] Implement weapon switching
- [ ] Add weapon pickup system
- [ ] Balance weapon damage and fire rates
- [ ] Implement ammo system

### Maps & Environment
- [ ] Design first playable map
- [ ] Add environmental hazards
- [ ] Create spawn points system
- [ ] Implement item pickup locations
- [ ] Add jump pads and teleporters

## Game Systems Phase

### Matchmaking
- [x] Design matchmaking system
- [x] Implement lobbies
- [x] Add AI bot support
- [ ] Create skill-based matching
- [ ] Implement regional server selection

### User Interface
- [x] Design and implement HUD
- [x] Create main menu
- [x] Add settings menu
- [ ] Implement scoreboard
- [ ] Create post-match summary screen

### Audio
- [ ] Implement 3D positional audio
- [ ] Add weapon sound effects
- [ ] Create player movement sounds
- [ ] Add ambient environment sounds
- [ ] Implement music system

## Polish Phase

### Performance Optimization
- [ ] Implement level of detail system
- [ ] Optimize render pipeline
- [ ] Add graphics quality settings
- [ ] Optimize network bandwidth
- [ ] Implement asset streaming

### Visual Effects
- [ ] Add weapon effects (muzzle flash, impacts)
- [ ] Implement particle systems
- [ ] Add screen shake and feedback
- [ ] Create explosion effects
- [ ] Polish animation transitions

### User Experience
- [ ] Add onboarding experience
- [ ] Implement control customization
- [ ] Create performance monitoring
- [ ] Add accessibility options
- [ ] Implement latency display and network stats

---

# Notes & Decisions

## 2023-03-19: Initial Planning
- Decided to use Three.js as main rendering engine
- Planning to implement a Quake-like movement system
- Considering either Cannon.js or Ammo.js for physics
- Multiplayer implementation will use Socket.IO with a custom reconciliation system
- Plan to use a hybrid authoritative server model with client prediction

## 2023-03-20: Project Setup
- Set up basic project structure with client, server, and shared directories
- Configured TypeScript, ESLint, and Prettier for consistent code style
- Created initial React-based UI components (main menu, loading screen)
- Implemented basic Three.js scene with first-person controls
- Set up the server with Express and Socket.IO
- Created initial game state management on the server
- Implemented basic matchmaking system with bot support

## 2023-03-21: Simple Game Implementation
- Created SimpleGame component with functional first-person controls
- Implemented basic collision detection with objects
- Added pointer lock for mouse look controls
- Created random 3D objects (cubes and cylinders) in the game world
- Integrated "Play Now" button functionality to launch the game
- Added game instructions and exit button
- Updated documentation with how to play guide

## Tech Decisions
- **Physics Engine**: [Decision Pending]
- **Asset Format**: [Decision Pending]
- **Database Choice**: [Decision Pending]
- **Deployment Strategy**: [Decision Pending]

## Game Design Decisions
- **Player Movement Speed**: Currently set to 5 units/second with an additional jump force of 10
- **Weapon Balance**: [Decision Pending]
- **Map Size Guidelines**: [Decision Pending]
- **Game Modes**: Initial focus on deathmatch mode

## Implementation Notes
- Client uses React for UI and Three.js for rendering
- Server uses Express, Socket.IO, and a custom game loop
- Shared types ensure consistency between client and server
- Currently experiencing TypeScript linter errors due to missing packages; need to install dependencies

## Performance Optimization Notes
- [Add performance findings and optimization notes here]

## Testing & Feedback
- [Add testing results and user feedback here] 