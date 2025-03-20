# Project Structure

This document outlines the planned directory and file structure for the VibeJam 2025 FPS game project.

```
vibejam2025/
├── client/                  # Frontend code
│   ├── src/
│   │   ├── game/            # Game engine code
│   │   │   ├── renderer/    # Three.js rendering
│   │   │   ├── physics/     # Physics engine integration
│   │   │   ├── controls/    # Player controls
│   │   │   ├── entities/    # Game objects (players, weapons)
│   │   │   ├── ai/          # AI opponent logic
│   │   │   └── networking/  # Client-side network code
│   │   ├── ui/              # React components for UI
│   │   └── assets/          # Models, textures, sounds
│   └── public/              # Static files
│
├── server/                  # Backend code
│   ├── src/
│   │   ├── game/            # Game logic
│   │   │   ├── physics/     # Server-side physics validation
│   │   │   ├── ai/          # AI behavior
│   │   │   └── world/       # World state management
│   │   ├── matchmaking/     # Player matching logic
│   │   ├── networking/      # Socket.IO implementation
│   │   ├── auth/            # Authentication (optional)
│   │   └── database/        # Database interactions
│   └── config/              # Server configuration
│
├── shared/                  # Code shared between client and server
│   ├── constants/           # Game constants
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Utility functions
│
├── docs/                    # Project documentation
│   ├── architecture.md      # System architecture
│   ├── project_structure.md # This file
│   ├── technical_specs.md   # Technical specifications
│   ├── todo.md              # Todo list and tracker
│   └── design_decisions.md  # Record of key design decisions
│
├── scripts/                 # Build and deployment scripts
│   ├── build.js             # Build script
│   ├── deploy.js            # Deployment script
│   └── test.js              # Test runner
│
└── tests/                   # Test files
    ├── client/              # Client tests
    ├── server/              # Server tests
    └── integration/         # Integration tests
```

## Key Files

### Client
- `client/src/index.ts` - Entry point for the client application
- `client/src/game/Game.ts` - Main game controller
- `client/src/game/renderer/Renderer.ts` - Three.js rendering setup
- `client/src/game/entities/Player.ts` - Player entity definition
- `client/src/game/networking/NetworkManager.ts` - Client networking

### Server
- `server/src/index.ts` - Entry point for the server
- `server/src/game/GameServer.ts` - Game server implementation
- `server/src/matchmaking/MatchmakingService.ts` - Matchmaking logic
- `server/src/game/world/World.ts` - World state container

### Shared
- `shared/types/GameState.ts` - Shared game state interfaces
- `shared/constants/Physics.ts` - Physics constants
- `shared/utils/Vector.ts` - Vector math utilities 