import { randomBytes } from 'crypto';

/**
 * Generates a random ID with the given length
 */
export function generateId(length: number = 12): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/**
 * Generates a game ID with the 'game_' prefix
 */
export function generateGameId(): string {
  return `game_${generateId(8)}`;
}

/**
 * Generates a player ID with the 'player_' prefix
 */
export function generatePlayerId(): string {
  return `player_${generateId(8)}`;
} 