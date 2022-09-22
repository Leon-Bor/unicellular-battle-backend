import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { QueueingPlayer } from '../../gateways/queue/queue.gateway';
import { RunningGame } from '../../models/runningGame';
import { Server } from 'socket.io';
import { ClientRoutes } from '../../gateways/connect/connect.gateway';
import { GameLoop } from '../../utils/gameLoop';

@Injectable()
export class GameService {
  @WebSocketServer() private socket: Server;

  private runningGames = new Map<string, RunningGame>();
  private gameLoop: GameLoop;

  constructor() {
    // setInterval(() => {
    //   this.runningGames.forEach((game, gameId) => {
    //     const snapshot = game.getSnapshot();
    //     this.socket
    //       .to(gameId)
    //       .emit(ClientRoutes.SR_GAME_SNAPSHOT_UPDATE, snapshot);
    //   });
    // }, 100);

    this.gameLoop = new GameLoop((deltaTime) => {
      this.runningGames.forEach((game, gameId) => {
        game.update(deltaTime);
        const snapshot = game.getSnapshot();
        this.socket
          .to(gameId)
          .emit(ClientRoutes.SR_GAME_SNAPSHOT_UPDATE, snapshot);
      });
    }, 15);

    this.gameLoop.start();
  }

  public createNewGame(
    player1: QueueingPlayer,
    player2: QueueingPlayer,
  ): RunningGame {
    return new RunningGame({
      playerIds: [player1.clientId, player2.clientId],
    });
  }

  playerJoinedGame({ gameId, clientId }): boolean {
    const game = this.runningGames.get(gameId);
    return game.playerJoinedGame(clientId);
  }

  get(gameId: string): RunningGame {
    return this.runningGames.get(gameId);
  }
}
