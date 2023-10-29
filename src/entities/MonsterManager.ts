import { Dungeon } from "./Dungeon";
import { Monster } from "./Monster";
import { Party } from "./Party";

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

  chaseParty(party: Party, dungeon: Dungeon) {
    this.monsters.forEach( (monster: Monster) => {
      const pos = monster.chaseParty(party, dungeon);
      monster.x = pos.x;
      monster.y = pos.y;
      monster.set3dPosition(0, 0);
    });
  }
}