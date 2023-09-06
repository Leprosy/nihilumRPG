import { Scene3D } from "@enable3d/phaser-extension";
import { Party } from "../entities/Party";
import { Actor } from "../entities/Actor";
import { Dungeon } from "../entities/Dungeon";
import { GameEvents, GameState, Status, loadMapArgs } from "../types";
import { Texture } from "three/src/textures/Texture";
import { QuestManager } from "../helpers/QuestManager";
import { EventManager } from "../helpers/EventManager";

export class Load extends Scene3D {
  constructor() {
    super("Load");
  }

  preload() {
    // TODO if no map is passed, load first one
    this.load.json("map", "assets/maps/map0.json");
  }

  init() {
    this.accessThirdDimension();
  }

  async create() {
    // Creating the game states
    // TODO Load this from somewhere(saved game file)
    const state: GameState = {
      party: new Party([new Actor()]),
      map: new Dungeon(this.cache.json.get("map")),
      quests: new QuestManager(),
      status: Status.Exploring
    };

    // Loading 3d assets
    // TODO can this be preloaded?
    const textures: Record<string, Texture[]> = {};
    const keys = ["floor", "wall", "object", "ceiling"];

    for (let j = 0; j < keys.length; ++j) {
      const arr: Promise<Texture>[] = [];
      const key = keys[j];

      for (let i = 0; i < 4; ++i) {
        // TODO console is not showing "file not found" errors
        arr.push(this.third.load.texture(`/assets/img/textures/${key}${i + 1}.png`));
      }

      textures[key] = await Promise.all(arr);
    }

    // Register map load event
    EventManager.on(GameEvents.LoadMap, (args) => this.loadMap(args));

    // Done
    this.registry.set("state", state);
    this.registry.set("textures", textures);
    this.scene.start("Explore");
  }

  loadMap(args: loadMapArgs) {
    console.log("Load.loadMap: loadMap/is ready", this.load.isReady(), args);

    if (!this.load.isReady()) { // TODO this loader thing is weird...why we need to reset and load again
      setTimeout(() => {
        console.log("Load.loadMap: retrying", args);
        this.load.reset();
        this.loadMap(args);
      }, 500);
      return;
    }

    this.load.once("complete", () => {
      console.log("Load.loadMap: inside loadmap complete");
      args.call();
    });

    this.cache.json.remove("map");
    this.load.json("map", `assets/maps/${args.dungeon}.json`).start();
  }
}
