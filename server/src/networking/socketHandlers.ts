import { Server, Socket } from 'socket.io';
import { GameServerInterface } from '../game/GameServer';
import { MatchmakingServiceInterface } from '../matchmaking/MatchmakingService';
import { generatePlayerId } from '../utils/idGenerator';
import { Vector3 } from '../../shared/types/Vector3';

/**
 * Sets up Socket.IO event handlers
 */
export function setupSocketHandlers(
  io: Server,
  gameServer: GameServerInterface,
  matchmakingService: MatchmakingServiceInterface
): void {
  // Handle new connections
  io.on('connection', (socket: Socket) => {
    // Generate a player ID for the connection
    const playerId = generatePlayerId();
    
    console.log(`Player connected: ${playerId}`);
    
    // Set up player data in the socket
    socket.data.playerId = playerId;
    socket.data.gameId = null;
    
    // Send player ID to the client
    socket.emit('player-id', playerId);
    
    // Handle player joining matchmaking
    socket.on('matchmaking-join', (request: any) => {
      const matchmakingRequest = {
        playerId: socket.data.playerId,
        preferredRegion: request.preferredRegion,
        preferredGameMode: request.preferredGameMode
      };
      
      matchmakingService.addPlayerToQueue(matchmakingRequest)
        .then(response => {
          if (response.success && response.gameId) {
            // Store game ID in socket data
            socket.data.gameId = response.gameId;
            
            // Join the game's room
            socket.join(response.gameId);
            
            // Notify client
            socket.emit('matchmaking-success', response);
          } else {
            socket.emit('matchmaking-error', response);
          }
        });
    });
    
    // Handle player movement
    socket.on('player-movement', (data: { position: Vector3, rotation: Vector3, velocity: Vector3 }) => {
      const { gameId, playerId } = socket.data;
      
      if (!gameId || !playerId) {
        return;
      }
      
      const game = gameServer.getGame(gameId);
      if (!game) {
        return;
      }
      
      const player = game.getPlayerById(playerId);
      if (!player) {
        return;
      }
      
      // Update player position, rotation, and velocity
      player.setPosition(data.position);
      player.setRotation(data.rotation);
      player.setVelocity(data.velocity);
    });
    
    // Handle player actions (shooting, jumping, etc.)
    socket.on('player-action', (data: { action: string, target?: string, position?: Vector3 }) => {
      const { gameId, playerId } = socket.data;
      
      if (!gameId || !playerId) {
        return;
      }
      
      const game = gameServer.getGame(gameId);
      if (!game) {
        return;
      }
      
      // Process player action based on action type
      // This would be implemented based on the specific game mechanics
      console.log(`Player ${playerId} performed action: ${data.action}`);
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      const { gameId, playerId } = socket.data;
      
      if (gameId && playerId) {
        gameServer.leaveGame(gameId, playerId);
      }
      
      console.log(`Player disconnected: ${playerId}`);
    });
  });
} 