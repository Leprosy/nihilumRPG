import { Position2D } from "../types";
import { Actor } from "./Actor";
import { Dungeon } from "./Dungeon";

export class Party {
  actors: Actor[];
  x: number;
  y: number;
  a: number;

  constructor(actors: Actor[]) {
    this.actors = actors;
    this.x = 0;
    this.y = 0;
    this.a = 0;
  }

  turnLeft() {
    this.a = (this.a + 1) % 4;
  }

  turnRight() {
    this.a = this.a - 1;
    if (this.a < 0) this.a = 3;
  }

  private checkBoundaries(x:number, y:number, map: Dungeon) {
    if (x < 0 || y < 0) return;
    if (x === map.getWidth() || y === map.getHeight()) return;
    if (!map.isPassable(x, y)) return;

    this.x = x;
    this.y = y;
  }

  getForward(): Position2D {
    return {
      x: this.x + Math.round(Math.sin(this.a * Math.PI / 2)),
      y: this.y + Math.round(Math.cos(this.a * Math.PI / 2))
    };
  }

  getBackward(): Position2D {
    return {
      x: this.x - Math.round(Math.sin(this.a * Math.PI / 2)),
      y: this.y - Math.round(Math.cos(this.a * Math.PI / 2))
    };
  }

  forward(map: Dungeon) {
    const forward = this.getForward();
    this.checkBoundaries(forward.x, forward.y, map);
  }

  backward(map: Dungeon) {
    const backward = this.getBackward();
    this.checkBoundaries(backward.x, backward.y, map);
  }
}