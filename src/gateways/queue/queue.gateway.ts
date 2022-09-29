import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameConfig } from '../../config';
import {
  ClientRoutes,
  Socket,
  SocketError,
  SocketErrorCode,
  SocketMessage,
  SocketRoutes,
  SocketSuccsess,
} from '../../models/socket';
import { GameService } from '../../services/game/game.service';
import { MathUtils } from '../../utils/mathUtils';

export type QueueingPlayer = {
  clientId: string;
  playerId: string;
  level: number;
  /* *
   * Each tick level varianz increases by 1.
   * This let's players with lower levels match with higher level players, slowly.
   * */
  levelVarianz: number;
  /** Value increases each tick by queue tick time */
  watingTime: number;
};

@WebSocketGateway()
export class QueueGateway {
  private queue: QueueingPlayer[] = [];

  @WebSocketServer() private socket: Server;
  @Inject() private gameService: GameService;

  constructor() {
    setInterval(() => {
      this.updateQueueingPlayers();
      this.matchPlayers();
      console.log(this.queue);
    }, GameConfig.QUEUE_TICK_RATE);
  }

  @SubscribeMessage(SocketRoutes.CS_QUEUE_JOIN)
  handleJoin(client: Socket, payload: any): SocketMessage<boolean> {
    const playerInQueue = this.queue.find((p) => p.clientId === client.id);
    if (!playerInQueue) {
      console.log(`Player ${client.playerId} joined queue.`);

      this.queue.push({
        clientId: client.id,
        playerId: client.playerId,
        level: 0,
        levelVarianz: 0,
        watingTime: 0,
      });
      return new SocketSuccsess({ payload: true });
    } else {
      console.log(`Player ${client.playerId} already in queue.`);
      return new SocketError({
        errorCode: SocketErrorCode.PLAYER_ALREADY_IN_QUEUE,
        errorMessage: 'Player is already in queue.',
      });
    }
  }

  @SubscribeMessage(SocketRoutes.CS_QUEUE_LEAVE)
  handleLeave(client: any, payload: any): SocketMessage<boolean> {
    const isRemoved = this.removePlayerFromQueue(client.id);
    if (isRemoved) {
      return new SocketMessage({ payload: true });
    } else {
      return new SocketError({
        payload: false,
        errorCode: SocketErrorCode.PLAYER_NOT_FOUND_IN_QUEUE,
        errorMessage: 'Could not find player in queue.',
      });
    }
  }

  removePlayerFromQueue(clientId: string): boolean {
    const index = this.queue.findIndex((q) => q.clientId === clientId);
    if (index > -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  updateQueueingPlayers(): void {
    // Increase wating time every round and sort them by waiting time.
    this.queue
      .map((p) => {
        // Increase waiting time.
        p.watingTime = p.watingTime + GameConfig.QUEUE_TICK_RATE;

        // Increase level varianz if players are in queue.
        if (this.queue.length > 1) {
          p.levelVarianz = p.levelVarianz + 1;
        } else {
          p.levelVarianz = 0;
        }
        return p;
      })
      .sort((a, b) => {
        return b.watingTime - a.watingTime;
      });
  }

  matchPlayers(): void {
    let enemy: QueueingPlayer;
    for (let i = 0; i < this.queue.length; i++) {
      const searchingPlayer = this.queue[i];
      enemy = this.findEnemy(searchingPlayer);
      if (enemy) {
        const game = this.gameService.createNewGame(searchingPlayer, enemy);

        this.socket
          .to(searchingPlayer.clientId)
          .emit(ClientRoutes.SC_QUEUE_FOUND_ENEMY, game);

        this.socket
          .to(enemy.clientId)
          .emit(ClientRoutes.SC_QUEUE_FOUND_ENEMY, game);

        this.removePlayerFromQueue(searchingPlayer.clientId);
        this.removePlayerFromQueue(enemy.clientId);
        break;
      }
    }

    // If an enemy was found, retry.
    if (enemy) {
      console.log('Found a match. Search for another one.');
      this.matchPlayers();
    }
  }

  findEnemy(player: QueueingPlayer): QueueingPlayer | undefined {
    return this.queue.find((enemy) => {
      // Filter out him self.
      if (player.clientId === enemy.clientId) {
        return false;
      }

      // Same level will match instant.
      if (player.level === enemy.level) {
        return true;
      }

      // Consider enemy with level varianz.
      if (MathUtils.within(player.level, enemy.level, player.levelVarianz)) {
        return true;
      }
    });
  }
}
