import { Scene3D } from "@enable3d/phaser-extension";
import { Party } from "../entities/Party";
import { Actor } from "../entities/Actor";
import { Dungeon } from "../entities/Dungeon";
import { GameState } from "../types";
import { Texture } from "three/src/textures/Texture";

export class Load extends Scene3D {
  constructor() {
    super("Load");
  }

  preload() {
    // if no map is passed, load first one
    this.load.json("map", "assets/maps/map0.json");
  }

  init() {
    this.accessThirdDimension();
  }

  async create() {
    const state: GameState = {
      party: new Party([new Actor()]),
      map: new Dungeon(this.cache.json.get("map"))
    };

    const textures = {};
    const keys = ["floor", "wall", "ceiling"];

    for (let j = 0; j < keys.length; ++j) {
      const arr: Promise<Texture>[] = [];
      const key = keys[j];

      for (let i = 0; i < 4; ++i) {
        arr.push(this.third.load.texture(`/assets/img/textures/${key}${i + 1}.png`));
      }

      textures[key] = await Promise.all(arr);
    }

    console.log("OAW text", textures);
    this.registry.set("state", state);
    this.registry.set("textures", textures);
    this.scene.start("Explore");
  }
}
