import { Actor } from "../entities/Actor";
import { Monster } from "../entities/Monster";
import { Party } from "../entities/Party";

export class CombatQueue {
  private actors: Actor[];
  private index: number;

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
    console.log("CombatQueue.pushActors: Actors now are", this.actors);
  }

  getNextActor() {
    const actor = this.actors[this.index++];
    console.log("CombatQueue.getNextActor: (index,actor) => ", this.index - 1, actor);

    if (this.index == this.actors.length) {
      console.log("CombatQueue.getNextActorL End of queue");
      this.index = 0;
    }

    return actor;
  }

  updateActorQueue() {
    this.actors.forEach((actor: Actor) => {
      if (actor.hp <= 0) {
        this.actors.splice(this.actors.indexOf(actor), 1);
      }
    });
  }
}