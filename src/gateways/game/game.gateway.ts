import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SocketRoutes } from '../connect/connect.gateway';

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage(SocketRoutes.CS_GAME_CONNECT)
  handleConnect(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage(SocketRoutes.CS_GAME_FIRE)
  handleFire(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage(SocketRoutes.CS_GAME_MOVE)
  handleMove(client: any, payload: any): string {
    return 'Hello world!';
  }
}
