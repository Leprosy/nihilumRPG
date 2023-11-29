// FIXME LoadAssets and LoadMap scenes
import { Scene3D, THREE } from "@enable3d/phaser-extension";
import { Party } from "../entities/Party";
import { Actor } from "../entities/Actor";
import { Dungeon } from "../entities/Dungeon";
import { GameEvents, GameState, GameStatus, TextureMap } from "../types";
import { Texture } from "three/src/textures/Texture";
import { QuestManager } from "../helpers/QuestManager";
import { EventManager } from "../helpers/EventManager";

export class Load extends Scene3D {
  constructor() {
    super("Load");
  }

  preload() {
    // Faces
    this.load.image("face0", "assets/img/face/face0.gif");
  }

  init() {
    this.accessThirdDimension();
  }

  async create() {
    // Creating the game states
    // TODO Load this from somewhere(saved game file)
    const state: GameState = {
      party: new Party([new Actor()]),
      dungeon: new Dungeon(),
      quests: new QuestManager(),
      status: GameStatus.Exploring,
    };

    // Loading 3d assets
    const keyMap = {
      floor: "/assets/img/textures/",
      wall: "/assets/img/textures/",
      ceiling: "/assets/img/textures/",
      sky: "/assets/img/textures/",
      monster: "/assets/img/monsters/",
      monsteract: "/assets/img/monsters/",
      object: "/assets/img/objects/",
    };
    const animatedKeys = ["monster", "monsteract", "object"];
    const keys = Object.keys(keyMap);
    const textures: TextureMap = {};

    for (let j = 0; j < keys.length; ++j) {
      let index = 1;
      let change = false;
      const arr: Texture[] = [];
      const key = keys[j];

      while (!change) {
        const txtName = `${keyMap[key]}${key}${index}.png`;
        console.log("Load: loading texture", txtName);

        const result: Texture | unknown = await Promise.race([
          this.third.load.texture(txtName),
          new Promise((res) =>
            setTimeout(() => {
              res(undefined);
            }, 100)
          ),
        ]);

        if (!result) {
          console.log("Load: texture not found", txtName);
          change = true;
        } else {
          const tex = result as Texture;
          tex.magFilter = THREE.NearestFilter;
          tex.minFilter = THREE.LinearMipMapLinearFilter;
          arr.push(tex);

          // Objects and monsters fix
          if (animatedKeys.indexOf(key) >= 0) {
            tex.offset.x = 0;
            tex.repeat.x = tex.source.data.height / tex.source.data.width;
          }

          ++index;
        }
      }

      textures[key] = arr;
    }

    // Register map load event
    EventManager.on(GameEvents.LoadMap, (args) => this.loadMap(args));

    // Done
    this.registry.set("state", state);
    this.registry.set("textures", textures);
    this.loadMap({
      startPoint: 0,
      dungeon: "map0",
      call: () => {
        this.scene.start("Main");
      },
    }); // TODO: extract this data from saved game?
  }

  /*
   * Loads a Map from a json file
   */
  loadMap(args: loadMapArgs) {
    console.log("Load.loadMap: loadMap/is ready", this.load.isReady(), args);

    if (!this.load.isReady()) {
      // TODO this loader thing is weird...why we need to reset and load again
      setTimeout(() => {
        console.log("Load.loadMap: retrying", args);
        this.load.reset();
        this.loadMap(args);
      }, 500);
      return;
    }

    this.load.once("complete", () => {
      console.log("Load.loadMap: inside loadmap complete");
      const map = this.cache.json.get("map");
      const start = map.startPoints[args.startPoint];
      const state = this.registry.get("state");
      state.dungeon.loadDungeon(map);
      state.party.x = start.x;
      state.party.y = start.y;
      args.call();
    });

    this.cache.json.remove("map");
    this.load.json("map", `assets/maps/${args.dungeon}.json`).start();
  }
}

export type loadMapArgs = {
  // TODO import this from scriptrunner?
  startPoint: number;
  dungeon: string;
  call: () => void;
};
