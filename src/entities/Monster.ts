import { GameConfig } from "../constants/config";
import { Actor } from "./Actor";
import { Party } from "./Party";
import { ExtendedObject3D } from "@enable3d/phaser-extension";


export class Monster extends Actor {
  experience: number;
  id: number;
  x: number;
  y: number;
  obj3d: ExtendedObject3D;

  constructor(x: number, y: number, id: number) {
    super();
    this.x = x;
    this.y = y;
    this.id = id;
  }

  chaseParty(P: Party) {
    console.log("Monster.chaseParty: cheking", P.x - this.x, P.y - this.y);
    if (P.x === this.x && P.y === this.y) return; // Already combating

    if (Math.abs(P.x - this.x) + Math.abs(P.y - this.y) <= 3) {
      console.log("Monster.chaseParty: is chasing");

      if (P.a == 0 || P.a == 2) { // Party has N-S orientation
        if (this.x == P.x) { // Same position, get near
          console.log("same x");
          this.y += (P.y - this.y) / Math.abs(P.y - this.y);
        } else {
          console.log("try to get same x");
          this.x += (P.x - this.x) / Math.abs(P.x - this.x);
        }
      } else {
        if (this.y == P.y) { // Same position, get near
          console.log("same y");
          this.x += (P.x - this.x) / Math.abs(P.x - this.x);
        } else {
          console.log("try to get same y");
          this.y += (P.y - this.y) / Math.abs(P.y - this.y);
        }
      }

      // Update obj3d
      this.obj3d.position.x = this.x * GameConfig.gridSize;
      this.obj3d.position.z = this.y * GameConfig.gridSize;
    }

  }
}