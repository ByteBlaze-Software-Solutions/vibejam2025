import { Vector3 } from './Vector3';

export enum GameStatus { PENDING = "pending", IN_PROGRESS = "in_progress", ENDED = "ended" };

export interface PlayerState {
  id: string;
  isBot: boolean;
  health: number;
  position: Vector3;
  rotation: Vector3;
  velocity: Vector3;
  score: number;
  kills: number;
  deaths: number;
  isDead: boolean;
  currentWeapon: string;
  weapons: string[];
  ammo: Record<string, number>;
}

export interface GameState {
  id: string;
  status: GameStatus;
  players: PlayerState[];
  elapsedTime: number;
  remainingTime: number;
}

export interface GameInfoDto {
  id: string;
  status: GameStatus;
  playerCount: number;
}

export interface MatchmakingRequest {
  playerId: string;
  preferredRegion?: string;
  preferredGameMode?: string;
  timestamp?: number;
}

export interface MatchmakingResponse {
  success: boolean;
  error?: string;
  gameId?: string;
  waitingInQueue?: boolean;
}
