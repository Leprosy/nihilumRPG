import { Game } from "..";
import { GameConfig } from "../constants/config";
import { Monster3D, Position2D } from "../types";
import { Actor } from "./Actor";
import { Dungeon } from "./Dungeon";
import { Party } from "./Party";
import monsters from "../../assets/monsters.json";

type monsterDefinition = {
  name: string;
  idle: number;
  actions: number;
}

export class Monster extends Actor {
  experience: number;
  id: number;
  x: number;
  y: number;
  obj3d: Monster3D;
  groupIndex: number;
  groupCount: number;
  idle: number;
  actions: number;

  constructor(x: number, y: number, id: number) {
    super();
    const data: monsterDefinition = monsters[id];
    this.name = `${data.name} ${this.name}`;
    this.idle = data.idle;
    this.actions = data.actions;
    this.x = x;
    this.y = y;
    this.id = id;
    this.groupIndex = 0;
    this.groupCount = 1;
  }

  chaseParty(P: Party, dungeon: Dungeon): Position2D {
    console.log("Monster.chaseParty: checking", P.x, P.y, "-", this.x, this.y);
    const samePos = { x: this.x, y: this.y };

    if (P.x === this.x && P.y === this.y) {
      return samePos;
    }

    let nx = this.x;
    let ny = this.y;

    if (Math.abs(P.x - nx) + Math.abs(P.y - ny) <= 3) { // TODO can we refactor this?
      if (P.a == 0 || P.a == 2) { // Party has N-S orientation
        if (nx == P.x) { // Same position, get near
          ny += (P.y - ny) / Math.abs(P.y - ny);
        } else {
          nx += (P.x - nx) / Math.abs(P.x - nx);
        }
      } else {
        if (ny == P.y) { // Same position, get near
          nx += (P.x - nx) / Math.abs(P.x - nx);
        } else {
          ny += (P.y - ny) / Math.abs(P.y - ny);
        }
      }

      if (dungeon.isPassable(nx, ny)) {
        return { x: nx, y: ny };
      } else {
        return samePos;
      }
    }

    return samePos;
  }

  set3dPosition() {
    const party: Party = Game.registry.get("state").party;
    const dSize = GameConfig.gridSize / 3;
    const d = this.groupIndex * dSize - (this.groupCount - 1) * dSize / 2;
    const dx = d * (party.a == 0 || party.a == 2 ? 1 * (party.a - 1) : 0);
    const dy = d * (party.a == 1 || party.a == 3 ? 1 * (party.a - 2) : 0);

    this.obj3d.position.x = this.x * GameConfig.gridSize - dx;
    this.obj3d.position.z = this.y * GameConfig.gridSize + dy;
  }
}