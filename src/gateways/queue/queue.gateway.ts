import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
  SocketError,
  SocketErrorCode,
  SocketMessage,
  SocketStatus,
  SocketSuccsess,
} from '../../models/socketMessage';
import { SocketRoutes } from '../connect/connect.gateway';
import { Math } from 'phaser';

export const QUEUE_TICK_RATE = 2000;

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
  private queue: QueueingPlayer[];

  constructor() {
    setInterval(() => {
      this.updateQueueingPlayers();
      this.matchPlayers();
    }, QUEUE_TICK_RATE);
  }

  @SubscribeMessage(SocketRoutes.CS_QUEUE_JOIN)
  handleJoin(client: any, payload: any): SocketMessage<boolean> {
    this.queue.push({
      clientId: client.id,
      playerId: 'todo',
      level: 0,
      levelVarianz: 0,
      watingTime: 0,
    });

    return new SocketSuccsess({ payload: true });
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
        p.watingTime = p.watingTime + QUEUE_TICK_RATE;

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
    const enemey = this.queue.find((enemy) => {
      // Filter out him self.
      if (player.clientId === enemy.clientId) {
        return false;
      }

      // Same level will match instant.
      if (player.level === enemy.level) {
        return true;
      }

      // Consider enemy with level varianz.
      if (Math.Within(player.level, enemy.level, player.levelVarianz)) {
        return true;
      }
    });

    if (enemey) {
      return enemey;
    } else {
      return undefined;
    }
  }
}
