import { Actor } from "../entities/Actor";
import { Monster } from "../entities/Monster";
import { Party } from "../entities/Party";

export class CombatQueue {
  actors: Actor[];
  index: number;

  constructor() {
    this.index = 0;
    this.actors = [];
  }

  pushActors(actors: Actor[]) {
    actors.forEach((item: Actor) => {
      if (this.actors.indexOf(item) < 0) {
        this.actors.push(item);
      }
    });

    this.actors.sort((a1: Actor, a2: Actor) => a2.dexterity - a1.dexterity);
    console.log("OAW", this.actors);
  }
}