export enum SocketStatus {
  Success = 200,
  Error = 400,
}

export enum SocketErrorCode {
  PLAYER_NOT_FOUND_IN_QUEUE = 'PLAYER_NOT_FOUND_IN_QUEUE',
}

export class SocketMessage<T> {
  payload: T;
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
    payload: T;
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
