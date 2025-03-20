import { Player } from '../entities/Player';
import { GameState, GameStatus } from '../../../shared/types/GameState';
import { Vector3 } from '../../../shared/types/Vector3';

export class Game {
  private id: string;
  private maxPlayers: number;
  private players: Map<string, Player> = new Map();
  private status: GameStatus = GameStatus.PENDING;
  private startTime: number = 0;
  private timeLimit: number = 10 * 60; // 10 minutes in seconds
  private tickCount: number = 0;
  
  constructor(id: string, maxPlayers: number = 16) {
    this.id = id;
    this.maxPlayers = maxPlayers;
  }
  
  getId(): string {
    return this.id;
  }
  
  getMaxPlayers(): number {
    return this.maxPlayers;
  }
  
  getPlayerCount(): number {
    return this.players.size;
  }
  
  getPlayers(): Player[] {
    return Array.from(this.players.values());
  }
  
  getPlayerById(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }
  
  addPlayer(player: Player): boolean {
    if (this.players.size >= this.maxPlayers) {
      return false;
    }
    
    // Set initial player position
    player.setPosition(this.getRandomSpawnPosition());
    
    this.players.set(player.getId(), player);
    
    // Start the game if we have enough players and the game is pending
    if (this.status === GameStatus.PENDING && this.shouldStartGame()) {
      this.start();
    }
    
    return true;
  }
  
  removePlayer(playerId: string): void {
    this.players.delete(playerId);
    
    // End the game if there are not enough players
    if (this.status === GameStatus.IN_PROGRESS && this.players.size < 2) {
      this.end();
    }
  }
  
  start(): void {
    this.status = GameStatus.IN_PROGRESS;
    this.startTime = Date.now();
    
    // Notify all players that the game has started
    this.broadcastGameStart();
  }
  
  end(): void {
    this.status = GameStatus.ENDED;
    
    // Calculate final scores and determine winner
    this.calculateResults();
    
    // Notify all players that the game has ended
    this.broadcastGameEnd();
  }
  
  isPending(): boolean {
    return this.status === GameStatus.PENDING;
  }
  
  isInProgress(): boolean {
    return this.status === GameStatus.IN_PROGRESS;
  }
  
  isEnded(): boolean {
    return this.status === GameStatus.ENDED;
  }
  
  getStatus(): GameStatus {
    return this.status;
  }
  
  getElapsedTime(): number {
    if (this.status === GameStatus.PENDING) {
      return 0;
    }
    
    const now = Date.now();
    return (now - this.startTime) / 1000; // in seconds
  }
  
  getRemainingTime(): number {
    if (this.status === GameStatus.PENDING) {
      return this.timeLimit;
    }
    
    if (this.status === GameStatus.ENDED) {
      return 0;
    }
    
    const elapsed = this.getElapsedTime();
    return Math.max(0, this.timeLimit - elapsed);
  }
  
  update(deltaTime: number): void {
    if (this.status !== GameStatus.IN_PROGRESS) {
      return;
    }
    
    this.tickCount++;
    
    // Update all players
    for (const player of this.players.values()) {
      player.update(deltaTime);
    }
    
    // Check for collisions, hits, etc.
    this.processCollisions();
    
    // Check if the game should end (time limit reached)
    if (this.getRemainingTime() <= 0) {
      this.end();
      return;
    }
    
    // Broadcast game state to all players
    if (this.tickCount % 2 === 0) { // Only send updates every other tick to reduce bandwidth
      this.broadcastGameState();
    }
  }
  
  getState(): GameState {
    return {
      id: this.id,
      status: this.status,
      players: Array.from(this.players.values()).map(player => player.getState()),
      elapsedTime: this.getElapsedTime(),
      remainingTime: this.getRemainingTime()
    };
  }
  
  private shouldStartGame(): boolean {
    // Start the game if we have at least 2 players or if we have 1 player and they're not a bot
    const minPlayers = parseInt(process.env.MIN_PLAYERS_TO_START || '2', 10);
    
    if (this.players.size >= minPlayers) {
      return true;
    }
    
    // If we have 1 player and bot fill is enabled, start the game
    if (this.players.size === 1 && process.env.BOT_FILL_ENABLED === 'true') {
      return true;
    }
    
    return false;
  }
  
  private broadcastGameStart(): void {
    // In a real implementation, this would send a message to all connected clients
    console.log(`Game ${this.id} started with ${this.players.size} players`);
  }
  
  private broadcastGameEnd(): void {
    // In a real implementation, this would send a message to all connected clients
    console.log(`Game ${this.id} ended`);
  }
  
  private broadcastGameState(): void {
    // In a real implementation, this would send the current game state to all connected clients
    // console.log(`Broadcasting game state for ${this.id}`);
  }
  
  private processCollisions(): void {
    // In a real implementation, this would check for collisions between players, projectiles, etc.
  }
  
  private calculateResults(): void {
    // In a real implementation, this would calculate final scores and determine the winner
  }
  
  private getRandomSpawnPosition(): Vector3 {
    // In a real implementation, this would select from predefined spawn points
    return {
      x: (Math.random() - 0.5) * 20,
      y: 1.7, // Player height
      z: (Math.random() - 0.5) * 20
    };
  }
} 