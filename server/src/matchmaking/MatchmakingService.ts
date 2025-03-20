import { GameServerInterface } from '../game/GameServer';
import { MatchmakingRequest, MatchmakingResponse } from '../../shared/types/GameState';

export interface MatchmakingServiceInterface {
  addPlayerToQueue: (request: MatchmakingRequest) => Promise<MatchmakingResponse>;
  removePlayerFromQueue: (playerId: string) => void;
  getQueueLength: () => number;
}

class MatchmakingService implements MatchmakingServiceInterface {
  private gameServer: GameServerInterface;
  private playerQueue: MatchmakingRequest[] = [];
  private matchmakingInterval: NodeJS.Timeout | null = null;
  private matchmakingTimeout: number = 30000; // 30 seconds
  private minPlayersToStart: number = 2;
  private isBotFillEnabled: boolean = true;
  
  constructor(gameServer: GameServerInterface) {
    this.gameServer = gameServer;
    
    // Load configuration from environment
    this.matchmakingTimeout = parseInt(process.env.MATCHMAKING_TIMEOUT || '30000', 10);
    this.minPlayersToStart = parseInt(process.env.MIN_PLAYERS_TO_START || '2', 10);
    this.isBotFillEnabled = process.env.BOT_FILL_ENABLED === 'true';
    
    // Start matchmaking process
    this.startMatchmakingProcess();
  }
  
  /**
   * Adds a player to the matchmaking queue
   */
  async addPlayerToQueue(request: MatchmakingRequest): Promise<MatchmakingResponse> {
    // Check if player is already in queue
    if (this.playerQueue.some(queuedPlayer => queuedPlayer.playerId === request.playerId)) {
      return {
        success: false,
        error: 'Player already in queue'
      };
    }
    
    // If queue is empty and bot fill is enabled, create a new game immediately
    if (this.playerQueue.length === 0 && this.isBotFillEnabled) {
      return this.createGameWithBots(request);
    }
    
    // Add player to queue
    request.timestamp = Date.now();
    this.playerQueue.push(request);
    
    // If we have enough players to start a game, do it immediately
    if (this.playerQueue.length >= this.minPlayersToStart) {
      return this.matchPlayers(this.minPlayersToStart);
    }
    
    // Otherwise, player needs to wait
    return {
      success: true,
      waitingInQueue: true
    };
  }
  
  /**
   * Removes a player from the matchmaking queue
   */
  removePlayerFromQueue(playerId: string): void {
    this.playerQueue = this.playerQueue.filter(player => player.playerId !== playerId);
  }
  
  /**
   * Returns the number of players in the queue
   */
  getQueueLength(): number {
    return this.playerQueue.length;
  }
  
  /**
   * Starts the matchmaking process
   */
  private startMatchmakingProcess(): void {
    // Check for matches every second
    this.matchmakingInterval = setInterval(() => {
      this.processQueue();
    }, 1000);
  }
  
  /**
   * Processes the matchmaking queue
   */
  private processQueue(): void {
    // If there are no players in queue, nothing to do
    if (this.playerQueue.length === 0) {
      return;
    }
    
    // Process players who have been waiting too long
    const now = Date.now();
    const longWaitingPlayers = this.playerQueue.filter(
      player => now - (player.timestamp || 0) > this.matchmakingTimeout
    );
    
    if (longWaitingPlayers.length > 0) {
      if (this.isBotFillEnabled) {
        // Create games with bots for players who have been waiting too long
        for (const player of longWaitingPlayers) {
          this.createGameWithBots(player);
          this.removePlayerFromQueue(player.playerId);
        }
      } else if (longWaitingPlayers.length >= 2) {
        // Create a game with just the waiting players if we have at least 2
        this.matchPlayers(longWaitingPlayers.length);
      }
    }
    
    // If we have enough players, create a game
    if (this.playerQueue.length >= this.minPlayersToStart) {
      this.matchPlayers(this.minPlayersToStart);
    }
  }
  
  /**
   * Matches players and creates a game
   */
  private matchPlayers(count: number): MatchmakingResponse {
    // Create a new game
    const game = this.gameServer.createGame();
    const gameId = game.getId();
    
    // Add players to the game (up to count)
    const playersToAdd = this.playerQueue.slice(0, count);
    
    // Remove these players from the queue
    for (const player of playersToAdd) {
      this.gameServer.joinGame(gameId, player.playerId, false);
      this.removePlayerFromQueue(player.playerId);
    }
    
    return {
      success: true,
      gameId
    };
  }
  
  /**
   * Creates a game with bots for a player
   */
  private createGameWithBots(request: MatchmakingRequest): MatchmakingResponse {
    // Create a new game
    const game = this.gameServer.createGame();
    const gameId = game.getId();
    
    // Add the player to the game
    this.gameServer.joinGame(gameId, request.playerId, false);
    
    // Add bots to fill the game
    const botCount = this.minPlayersToStart - 1;
    for (let i = 0; i < botCount; i++) {
      const botId = `bot_${i}_${Date.now()}`;
      this.gameServer.joinGame(gameId, botId, true);
    }
    
    return {
      success: true,
      gameId
    };
  }
  
  /**
   * Cleans up the matchmaking service
   */
  dispose(): void {
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
    }
  }
}

// Singleton instance
let matchmakingServiceInstance: MatchmakingServiceInterface | null = null;

/**
 * Initializes the matchmaking service
 */
export function initMatchmaking(gameServer: GameServerInterface): MatchmakingServiceInterface {
  if (matchmakingServiceInstance) {
    return matchmakingServiceInstance;
  }
  
  matchmakingServiceInstance = new MatchmakingService(gameServer);
  return matchmakingServiceInstance;
} 