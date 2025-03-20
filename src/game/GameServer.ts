import { Game } from './world/Game';
import { generateGameId } from '../utils/idGenerator';

export interface GameServerInterface {
  createGame(maxPlayers: number): Game;
  getGame(gameId: string): Game | undefined;
  joinGame(gameId: string, playerId: string, isBot: boolean): boolean;
  leaveGame(gameId: string, playerId: string): void;
  getActiveGameCount(): number;
  getActivePlayerCount(): number;
}

class GameServer implements GameServerInterface {
  private games: Map<string, Game> = new Map();
  
  createGame(maxPlayers: number = 16): Game {
    const gameId = generateGameId();
    const game = new Game(gameId, maxPlayers);
    this.games.set(gameId, game);
    return game;
  }
  
  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }
  
  joinGame(gameId: string, playerId: string, isBot: boolean): boolean {
    const game = this.getGame(gameId);
    if (!game) {
      return false;
    }
    
    const player = new (require('./entities/Player').Player)(playerId, isBot);
    return game.addPlayer(player);
  }
  
  leaveGame(gameId: string, playerId: string): void {
    const game = this.getGame(gameId);
    if (!game) {
      return;
    }
    
    game.removePlayer(playerId);
    
    // Clean up empty games
    if (game.getPlayerCount() === 0) {
      this.games.delete(gameId);
    }
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
}

// Singleton instance
let gameServerInstance: GameServerInterface | null = null;

export function initGameServer(): GameServerInterface {
  if (gameServerInstance) {
    return gameServerInstance;
  }
  
  gameServerInstance = new GameServer();
  return gameServerInstance;
} 