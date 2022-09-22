import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket as SocketIoClient } from 'socket.io';

export class Socket extends SocketIoClient {
  gameId: string;
}

export enum SocketRoutes {
  CS_QUEUE_JOIN = 'CS_QUEUE_JOIN',
  CS_QUEUE_LEAVE = 'CS_QUEUE_LEAVE',

  CS_GAME_CONNECT = 'CS_GAME_CONNECT',
  CS_GAME_MOVE = 'CS_GAME_MOVE',
  CS_GAME_FIRE = 'CS_GAME_FIRE',

  CS_SETTINGS_UPDATE = 'CS_SETTINGS_UPDATE',

  CS_SKILLTREE_UPDATE = 'CS_SKILLTREE_UPDATE',

  CS_PING = 'CS_PING',
}

export enum ClientRoutes {
  SC_QUEUE_JOIN = 'SC_QUEUE_JOIN',
  SC_QUEUE_LEAVE = 'SC_QUEUE_LEAVE',
  SC_QUEUE_FOUND_ENEMY = 'SC_QUEUE_FOUND_ENEMY',

  SR_GAME_CONNECT = 'SR_GAME_CONNECT',
  SR_GAME_SNAPSHOT_UPDATE = 'SR_GAME_SNAPSHOT_UPDATE',

  SC_SETTINGS_UPDATE = 'SC_SETTINGS_UPDATE',

  SC_SKILLTREE_UPDATE = 'SC_SKILLTREE_UPDATE',

  SC_PING = 'SC_PING',
}

@WebSocketGateway()
export class ConnectGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket, ...args: any[]) {
    console.log('User connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected', client.id);
  }

  @SubscribeMessage(SocketRoutes.CS_PING)
  handleMessage(client: Socket, time: number): void {
    client.emit(ClientRoutes.SC_PING, time);
  }
}
