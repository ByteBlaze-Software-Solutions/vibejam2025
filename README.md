# VibeJam 2025 - Browser FPS Game

A high-movement first-person shooter (FPS) game inspired by Quake, built to run in modern web browsers using Three.js and modern web technologies.

## Project Overview

VibeJam 2025 is a fast-paced multiplayer first-person shooter designed specifically for browser gameplay. Key features include:

- **Quake-inspired movement mechanics** (strafe jumping, rocket jumping, bunny hopping)
- **Real-time multiplayer** with client-side prediction and server reconciliation
- **Modern 3D graphics** using Three.js with optimized performance
- **Seamless matchmaking** that puts players into games immediately
- **AI opponents** that fill in when human players aren't available
- **Low-poly stylized visuals** with modern shader effects

## Project Status

This project is in the early planning and design phase. We are currently working on the core architecture and technical specifications.

## Documentation

The project documentation is organized as follows:

- [Architecture Overview](docs/architecture.md) - System architecture and component breakdown
- [Project Structure](docs/project_structure.md) - Directory and file organization
- [Technical Specifications](docs/technical_specs.md) - Detailed technical requirements and specifications
- [Todo List](docs/todo.md) - Task tracking and progress notes
- [Design Decisions](docs/design_decisions.md) - Record of key design decisions and their rationale

## Technology Stack

- **Frontend**: Three.js, TypeScript, React
- **Backend**: Node.js, Socket.IO, Express
- **Data Storage**: Redis, MongoDB/PostgreSQL
- **Infrastructure**: Docker, Kubernetes

## Getting Started

*Development setup instructions will be added as the project progresses.*

## Contributing

This project is in early development. Contribution guidelines will be established as the project matures.

## License

*License information to be determined*

---

*VibeJam 2025 - My submission to Pieter Levels' 2025 Vibe Code Game Jam*

# VibeJam 2025 - Simple Setup Guide

## Current Features

- Basic Socket.IO connection between client and server
- Server sends a welcome message to connected clients
- Simple UI with connection status indicator
- First-person 3D game with movement and jumping
- Collision detection with objects in the world
- Dynamic objects that respond to player movement

## Project Architecture

VibeJam 2025 follows a component-based architecture with clear separation between client, server, and shared code.

### Directory Structure
```
vibejam2025/
├── client/ - Frontend game client
├── server/ - Backend game server
├── shared/ - Code shared between client and server
└── docs/ - Project documentation
```

### Code Organization

- **Entity-Component System**: Game objects are built using composable components
- **Three.js Rendering**: 3D graphics using optimized WebGL rendering
- **Socket.IO Networking**: Real-time communication between client and server
- **React UI**: Menu and HUD components using React

### Documentation

For more details on the architecture and development plan:

- [Architecture Overview](docs/architecture.md) - Detailed system architecture
- [Design Decisions](docs/design_decisions.md) - Key design choices and rationale
- [Todo List](docs/todo.md) - Current development progress and planned tasks

## Next Steps

We are currently refactoring the codebase to:
1. Extract core systems from monolithic components
2. Implement a proper entity-component system
3. Improve networking with prediction and reconciliation
4. Add gameplay systems like weapons and health
