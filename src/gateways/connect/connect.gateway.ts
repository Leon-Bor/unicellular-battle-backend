import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Console } from 'console';

import { ClientRoutes, Socket, SocketRoutes } from '../../models/socket';

@WebSocketGateway({ cors: true })
export class ConnectGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket, ...args: any[]) {
    console.log('User connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected', client.id);
  }

  @SubscribeMessage(SocketRoutes.CS_CONNECTED)
  handleConnected(client: Socket, playerId: string): void {
    console.log(`Player ${playerId} connected`);

    client.playerId = playerId;
  }

  @SubscribeMessage(SocketRoutes.CS_PING)
  handlePing(client: Socket, time: number): void {
    console.log(`Client ${client.id} ping ${Date.now() - time}ms`);
    client.emit(ClientRoutes.SC_PING, time);
  }
}
