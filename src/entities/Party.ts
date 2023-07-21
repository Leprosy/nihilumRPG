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

  turnRight() {
    this.a = (this.a + 1) % 4;
  }

  turnLeft() {
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

  forward(map: Dungeon) {
    const newx = this.x + Math.round(Math.sin(this.a * Math.PI / 2));
    const newy = this.y + Math.round(Math.cos(this.a * Math.PI / 2));
    this.checkBoundaries(newx, newy, map);
  }

  backward(map: Dungeon) {
    const newx = this.x - Math.round(Math.sin(this.a * Math.PI / 2));
    const newy = this.y - Math.round(Math.cos(this.a * Math.PI / 2));
    this.checkBoundaries(newx, newy, map);
  }
}