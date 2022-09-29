import { Socket as SocketIoClient } from 'socket.io';

export class Socket extends SocketIoClient {
  gameId: string;
  playerId: string;
}

export enum SocketRoutes {
  CS_CONNECTED = 'CS_CONNECTED',

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
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',

  SC_QUEUE_JOIN = 'SC_QUEUE_JOIN',
  SC_QUEUE_LEAVE = 'SC_QUEUE_LEAVE',
  SC_QUEUE_FOUND_ENEMY = 'SC_QUEUE_FOUND_ENEMY',

  SR_GAME_CONNECT = 'SR_GAME_CONNECT',
  SR_GAME_SNAPSHOT_UPDATE = 'SR_GAME_SNAPSHOT_UPDATE',

  SC_SETTINGS_UPDATE = 'SC_SETTINGS_UPDATE',

  SC_SKILLTREE_UPDATE = 'SC_SKILLTREE_UPDATE',

  SC_PING = 'SC_PING',
}

export enum SocketStatus {
  Success = 200,
  Error = 400,
}

export enum SocketErrorCode {
  PLAYER_NOT_FOUND_IN_QUEUE = 'PLAYER_NOT_FOUND_IN_QUEUE',
  PLAYER_ALREADY_IN_QUEUE = 'PLAYER_ALREADY_IN_QUEUE',
}
export class SocketMessage<T> {
  payload: T | undefined;
  errorMessage?: string;
  errorCode?: SocketErrorCode;
  status?: SocketStatus;

  constructor({ payload, errorMessage, errorCode, status }: SocketMessage<T>) {
    this.payload = payload;
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
    this.status = status;
  }
}

export class SocketSuccsess<T> extends SocketMessage<T> {
  constructor({ payload }: { payload: T }) {
    super({
      payload,
      status: SocketStatus.Success,
    });
  }
}

export class SocketError<T> extends SocketMessage<T> {
  constructor({
    payload,
    errorCode,
    errorMessage,
  }: {
    payload?: T;
    errorCode: SocketErrorCode;
    errorMessage: string;
  }) {
    super({
      payload,
      errorCode,
      errorMessage,
      status: SocketStatus.Error,
    });
  }
}
