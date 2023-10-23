import { GameConfig } from "../constants/config";
import { Position2D } from "../types";
import { Actor } from "./Actor";
import { Dungeon } from "./Dungeon";
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

  chaseParty(P: Party, dungeon: Dungeon, monsters: Monster[]) {
    console.log("Monster.chaseParty: checking", P.x, P.y, "=", this.x, this.y);
    if (P.x === this.x && P.y === this.y) {
      console.log("Already engeged");
      return;
    }

    let nx = this.x;
    let ny = this.y;

    if (Math.abs(P.x - nx) + Math.abs(P.y - ny) <= 3) {
      console.log("Monster.chaseParty: is chasing");

      if (P.a == 0 || P.a == 2) { // Party has N-S orientation
        if (nx == P.x) { // Same position, get near
          console.log("same x");
          ny += (P.y - ny) / Math.abs(P.y - ny);
        } else {
          console.log("try to get same x");
          nx += (P.x - nx) / Math.abs(P.x - nx);
        }
      } else {
        if (ny == P.y) { // Same position, get near
          console.log("same y");
          nx += (P.x - nx) / Math.abs(P.x - nx);
        } else {
          console.log("try to get same y");
          ny += (P.y - ny) / Math.abs(P.y - ny);
        }
      }

      console.log("new pos", nx, ny);
      if (dungeon.isPassable(nx, ny)) {
        if (!monsters.some((mon: Monster) => mon.x === nx && mon.y === ny)) {
          this.x = nx;
          this.y = ny;
          this.set3dPosition(nx, ny);
          return;
        }
      } else {
        console.log("Is blocked");
        return;
      }
    }
  }

  set3dPosition(x: number, y: number) {
    this.obj3d.position.x = x * GameConfig.gridSize;
    this.obj3d.position.z = y * GameConfig.gridSize;
  }
}