import { Game } from './world/Game';
import { Player } from './entities/Player';
import { generateId } from '../utils/idGenerator';

export interface GameServerInterface {
  createGame: (maxPlayers: number) => Game;
  joinGame: (gameId: string, playerId: string, isBot: boolean) => Player | null;
  leaveGame: (gameId: string, playerId: string) => void;
  getGame: (gameId: string) => Game | null;
  getAllGames: () => Game[];
  getActivePlayerCount: () => number;
  getActiveGameCount: () => number;
  update: (deltaTime: number) => void;
}

class GameServer implements GameServerInterface {
  private games: Map<string, Game> = new Map();
  private tickRate: number;
  private tickInterval: NodeJS.Timeout | null = null;
  
  constructor(tickRate: number = 60) {
    this.tickRate = tickRate;
    this.startGameLoop();
  }
  
  private startGameLoop(): void {
    const tickInterval = 1000 / this.tickRate;
    let lastTime = Date.now();
    
    this.tickInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      this.update(deltaTime);
    }, tickInterval);
  }
  
  update(deltaTime: number): void {
    // Update all active games
    for (const [gameId, game] of this.games.entries()) {
      game.update(deltaTime);
      
      // Remove empty games
      if (game.getPlayerCount() === 0 && !game.isPending()) {
        this.games.delete(gameId);
      }
    }
  }
  
  createGame(maxPlayers: number = 16): Game {
    const gameId = generateId();
    const game = new Game(gameId, maxPlayers);
    this.games.set(gameId, game);
    return game;
  }
  
  joinGame(gameId: string, playerId: string, isBot: boolean = false): Player | null {
    const game = this.getGame(gameId);
    if (!game) return null;
    
    // Check if the game is full
    if (game.getPlayerCount() >= game.getMaxPlayers()) {
      return null;
    }
    
    // Create and add player to the game
    const player = new Player(playerId, isBot);
    game.addPlayer(player);
    
    return player;
  }
  
  leaveGame(gameId: string, playerId: string): void {
    const game = this.getGame(gameId);
    if (!game) return;
    
    game.removePlayer(playerId);
  }
  
  getGame(gameId: string): Game | null {
    return this.games.get(gameId) || null;
  }
  
  getAllGames(): Game[] {
    return Array.from(this.games.values());
  }
  
  getActiveGameCount(): number {
    return this.games.size;
  }
  
  getActivePlayerCount(): number {
    let count = 0;
    for (const game of this.games.values()) {
      count += game.getPlayerCount();
    }
    return count;
  }
  
  dispose(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}

let gameServerInstance: GameServerInterface | null = null;

export function initGameServer(): GameServerInterface {
  if (gameServerInstance) return gameServerInstance;
  
  const tickRate = parseInt(process.env.TICK_RATE || '60', 10);
  gameServerInstance = new GameServer(tickRate);
  return gameServerInstance;
}

export function getGameServer(): GameServerInterface {
  if (!gameServerInstance) {
    return initGameServer();
  }
  return gameServerInstance;
} 