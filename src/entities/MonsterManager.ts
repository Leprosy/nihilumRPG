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
    this.monsters.forEach( (monster: Monster) => {
      const pos = monster.chaseParty(party, dungeon);
      const count = oaw[this.getKey(pos.x, pos.y)] || 0;

      if (count < MAX_MONSTERS) {
        monster.x = pos.x;
        monster.y = pos.y;
        monster.set3dPosition(0, 0);
      }

      oaw[this.getKey(monster.x, monster.y)] = (oaw[this.getKey(monster.x, monster.y)] || 0) + 1;
    });

    console.log("OAW total", oaw);
  }
}