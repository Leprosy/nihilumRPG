import { Actor } from "./Actor";

export class Monster extends Actor {
  experience: number;
  id: number;
  x: number;
  y: number;

  constructor(x: number, y: number, id: number) {
    super();
    this.x = x;
    this.y = y;
    this.id = id;
  }
}