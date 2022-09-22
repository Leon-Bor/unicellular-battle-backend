import uuid from 'uuid';
import { Player } from './player';

export type IRunningGame = {
  playerIds: string[];
};

export enum ActionType {
  Move = 'move',
  Fire = 'fire',
  StartGame = 'startGame',
  EndGame = 'endGame',
}

export type ActionMove = {
  type: ActionType.Move;
  playerId: string;
  moveTo: Position;
};

export type ActionFire = {
  type: ActionType.Fire;
  playerId: string;
  from: Position;
  to: Position;
};

export type ActionStartGame = {
  type: ActionType.StartGame;
};

export type Position = {
  x: number;
  y: number;
};

export type GameAction = ActionMove | ActionFire | ActionStartGame;

export class RunningGame {
  id: string;
  isStarted: boolean;
  playerIds: string[];
  playersConnected: boolean[];

  actions: GameAction[] = [];
  actionHistory: GameAction[] = [];

  player1: Player = new Player();
  player1PositionDestination: Position;

  constructor({ playerIds }: IRunningGame) {
    this.id = uuid.v4();
    this.playerIds = playerIds;
    this.playersConnected = new Array(playerIds.length).fill(false);
  }

  update(deltaTime): void {
    if (this.player1PositionDestination) {
      this.player1.x = this.player1.x + this.player1.velocity * deltaTime;
    }
  }

  startGame(): void {
    this.isStarted = true;
    this.actions.push({
      type: ActionType.StartGame,
    });
  }

  playerJoinedGame(clientId): boolean {
    const index = this.playerIds.findIndex((p) => p === clientId);
    this.playersConnected[index] = true;
    return this.allPlayersConnected();
  }

  private allPlayersConnected(): boolean {
    return this.playersConnected.some((p) => p === false);
  }

  actionMove(clientId: string, position: Position): void {
    this.actions.push({
      type: ActionType.Move,
      playerId: clientId,
      moveTo: position,
    });
  }

  actionFire(clientId, from: Position, to: Position): void {
    this.actions.push({
      type: ActionType.Fire,
      playerId: clientId,
      from,
      to,
    });
  }

  getSnapshot(): GameAction[] {
    const snapshot = [...this.actions];

    this.actionHistory = [...this.actionHistory, ...snapshot];
    this.actions = [];

    return snapshot;
  }
}
