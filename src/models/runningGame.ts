import uuid from 'uuid';
import { Bullet } from './bullet';
import { Player } from './player';
import { Position } from './position';

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

export type GameAction = ActionMove | ActionFire | ActionStartGame;

export interface IGameSnapshot {
  players: Player[];
  bullets: Bullet[];
}

export class RunningGame {
  id: string;
  isStarted: boolean;
  playerIds: string[];

  actions: GameAction[] = [];
  actionHistory: GameAction[] = [];

  players: Player[] = [];
  bullets: Bullet[] = [];

  constructor({ playerIds }: IRunningGame) {
    this.id = uuid.v4();
    this.playerIds = playerIds;
  }

  update(deltaTime): void {
    this.bullets.map((bullet) => bullet.updatePosition(deltaTime));
    this.bullets = this.bullets.filter((bullet) =>
      bullet.isBulletOutOfScreen(),
    );

    this.players.map((player) => player.updatePosition(deltaTime));
  }

  startGame(): void {
    this.isStarted = true;
    this.actions.push({
      type: ActionType.StartGame,
    });
  }

  playerJoinedGame(clientId): boolean {
    this.players.push(new Player({ id: clientId }));
    return this.allPlayersConnected();
  }

  private allPlayersConnected(): boolean {
    return this.players.length === 2;
  }

  actionMove(clientId: string, position: Position): void {
    this.actions.push({
      type: ActionType.Move,
      playerId: clientId,
      moveTo: position,
    });

    this.players.find(({ id }) => id === clientId).moveTo(position);
  }

  actionFire(clientId, from: Position, to: Position): void {
    this.actions.push({
      type: ActionType.Fire,
      playerId: clientId,
      from,
      to,
    });

    this.bullets.push(
      new Bullet({
        position: new Position(from.x, from.y),
        destination: new Position(to.x, to.y),
        velocity: 100,
      }),
    );
  }

  getSnapshot(): IGameSnapshot {
    return {
      bullets: this.bullets,
      players: this.players,
    };
  }
}
