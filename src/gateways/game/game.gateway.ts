import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from '../../services/game/game.service';
import { ClientRoutes, Socket, SocketRoutes } from '../connect/connect.gateway';
import { Server } from 'socket.io';
import { GameConfig } from '../../config';
import { Position } from '../../models/position';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer() private socket: Server;
  @Inject() private gameService: GameService;
  constructor() {}

  @SubscribeMessage(SocketRoutes.CS_GAME_CONNECT)
  handleConnect(client: Socket, gameId: string): void {
    client.join(gameId);
    client.gameId = gameId;
    const allPlayersConnected = this.gameService.playerJoinedGame({
      clientId: client.id,
      gameId,
    });

    if (allPlayersConnected) {
      this.socket
        .to(gameId)
        .emit(ClientRoutes.SR_GAME_CONNECT, this.gameService.get(gameId));

      setTimeout(() => {
        this.gameService.get(gameId).startGame();
      }, GameConfig.GAME_PRESTART_TIME);
    }
  }

  @SubscribeMessage(SocketRoutes.CS_GAME_FIRE)
  handleFire(
    client: any,
    payload: {
      from: Position;
      to: Position;
    },
  ): void {
    const { from, to } = payload;
    const game = this.gameService.get(client.gameId);
    game.actionFire(client.id, from, to);
  }

  @SubscribeMessage(SocketRoutes.CS_GAME_MOVE)
  handleMove(
    client: any,
    payload: {
      moveTo: Position;
    },
  ): void {
    const { moveTo } = payload;
    const game = this.gameService.get(client.gameId);
    game.actionMove(client.id, moveTo);
  }
}
