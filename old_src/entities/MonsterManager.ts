import { Position2D } from "../types";
import { Dungeon } from "./Dungeon";
import { Monster } from "./Monster";
import { Party } from "./Party";

const MAX_MONSTERS = 3;

// TODO merge "entities" and "helpers" into "classes"?
export class MonsterManager {
  monsters: Monster[];

  constructor() {
  }

  generate(dungeon: Dungeon) {
    // TODO generation logic
    this.monsters = [
      new Monster(7, 9, 0), new Monster(8, 9, 0), new Monster(5, 9, 1), new Monster(4, 9, 0)
    ];
  }

  getKey(x: number, y: number) {
    return `${x}x${y}`;
  }

  chaseParty(party: Party, dungeon: Dungeon) {
    const oaw =  {};

    // Chase party
    this.monsters.forEach( (monster: Monster) => {
      const pos = monster.chaseParty(party, dungeon); // TODO: move dungeon wall logic here?
      const count = oaw[this.getKey(pos.x, pos.y)] || 0;

      // Groups
      if (count < MAX_MONSTERS) {
        monster.x = pos.x;
        monster.y = pos.y;
        monster.groupIndex = count;
      }

      const key = this.getKey(monster.x, monster.y);
      oaw[key] = (oaw[key] || 0) + 1;
    });

    // Update group info & update 3d object
    this.monsters.forEach( (monster: Monster) => {
      const key = this.getKey(monster.x, monster.y);
      monster.groupCount = oaw[key];
    });

    this.updateMonsters3dObjects();
  }

  updateMonsters3dObjects() {
    this.monsters.forEach( (monster: Monster) => {
      monster.set3dPosition();
    });
  }

  getMonstersAt(pos: Position2D) {
    return this.monsters.filter((monster: Monster) => monster.x === pos.x && monster.y === pos.y);
  }

  isFighting(party: Party) {
    return this.getMonstersAt(party as Position2D).length > 0;
  }
}