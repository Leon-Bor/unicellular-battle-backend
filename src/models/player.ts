import { Position } from './position';
import { Tween } from '@tweenjs/tween.js';
import { MathUtils } from '../utils/mathUtils';

export interface IPlayer {
  id: string;
}

export class Player {
  id: string;

  position: Position;
  destination: Position | undefined;

  health: number = 100;
  velocity: number = 100;
  bulletVelocity: number = 100;
  bulletDamage: number = 5;
  maxBullets: number = 10;
  hitBoxRadius: number = 100;

  private moveToTween: Tween<Position> | undefined;

  constructor({ id }) {
    this.id = id;
  }

  moveTo(destination: Position): void {
    if (this.moveToTween) {
      this.moveToTween.stop();
      this.moveToTween = undefined;
    }

    const distance = MathUtils.distanceBetween(
      this.position.x,
      this.position.y,
      destination.x,
      destination.y,
    );
    const speed = distance * (1000 / this.velocity);

    this.moveToTween = new Tween(this.position)
      .to(destination, speed)
      .onUpdate((position) => {
        this.position.x = position.x;
        this.position.y = position.y;
      })
      .start();
  }

  updatePosition(deltatime): void {
    if (this.moveToTween) {
      this.moveToTween.update(deltatime);
    }
  }
}
