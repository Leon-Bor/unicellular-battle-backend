import { Position } from './position';
import uuid from 'uuid';

export interface IBullet {
  position: Position;
  destination: Position;
  velocity: number;
}

export class Bullet {
  id: string;
  position: Position;
  velocity: number;

  destination: Position;
  destinationAngle: number;

  constructor({ position, destination, velocity }) {
    this.id = uuid.v4();
    this.position = position;
    this.destination = destination;
    this.velocity = velocity;

    var dx = this.destination.x - this.position.x;
    var dy = this.destination.y - this.position.y;
    this.destinationAngle = Math.atan2(dy, dx);
  }

  updatePosition(deltatime): void {
    var xVelocity = this.velocity * Math.cos(this.destinationAngle) * deltatime;
    var yVelocity = this.velocity * Math.sin(this.destinationAngle) * deltatime;

    this.position.x = this.position.x + xVelocity;
    this.position.y = this.position.y + yVelocity;
  }

  isBulletOutOfScreen(): boolean {
    if (this.position.x < 0 || this.position.y < 0) {
      return true;
    } else if (this.position.x > 1080 || this.position.y > 1920) {
      return true;
    } else {
      false;
    }
  }
}
