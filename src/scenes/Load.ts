import Phaser from "phaser";
import { Party } from "../entities/Party";
import { Actor } from "../entities/Actor";
import { Dungeon } from "../entities/Dungeon";
import { GameState } from "../types";

export class Load extends Phaser.Scene {
  constructor() {
    super("Load");
  }

  preload() {}

  create() {
    const state: GameState = {
      party: new Party([new Actor()]),
      map: new Dungeon()
    };

    this.registry.set("state", state);
    this.scene.start("Explore");
  }
}
