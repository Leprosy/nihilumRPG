import { Scene3D } from "@enable3d/phaser-extension";
import { Party } from "../entities/Party";
import { Actor } from "../entities/Actor";
import { Dungeon } from "../entities/Dungeon";
import { GameState } from "../types";

export class Load extends Scene3D {
  constructor() {
    super("Load");
  }

  preload() {}

  init() {
    this.accessThirdDimension();
  }

  async create() {
    const state: GameState = {
      party: new Party([new Actor()]),
      map: new Dungeon()
    };

    const textures = await Promise.all([
      this.third.load.texture("/assets/img/textures/floor0.png"),
      this.third.load.texture("/assets/img/textures/floor1.png"),
      this.third.load.texture("/assets/img/textures/wall0.png"),
      this.third.load.texture("/assets/img/textures/wall1.png"),
    ]);

    this.registry.set("state", state);
    this.registry.set("textures", textures);
    this.scene.start("Explore");
  }
}
