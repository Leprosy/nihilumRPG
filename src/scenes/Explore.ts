import { Scene3D } from "@enable3d/phaser-extension";
import { GameEvents, GameState, GameStatus } from "../types";
import { ScriptRunner } from "../helpers/ScriptRunner";
import { EventManager } from "../helpers/EventManager";
import { Graphics } from "../helpers/Graphics";
import { GameConfig } from "../constants/config";
import { MonsterManager } from "../entities/MonsterManager";

export class Explore extends Scene3D {
  state: GameState;
  lastKey: string;
  isMoving: boolean;
  monsters: MonsterManager;

  constructor() {
    super("Explore");
    this.lastKey = "";
    this.isMoving = false;
    this.monsters = new MonsterManager();
  }

  init() {
    this.accessThirdDimension();
    this.third.renderer.setPixelRatio(5);
  }

  async create() {
    this.state = this.registry.get("state");

    // Events
    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      if (!this.isMoving) {
        this.lastKey = event.key;

        switch (this.state.status) {
          case GameStatus.Exploring:
            this.moveParty(event);
            this.updateScene();
            break;

          case GameStatus.Script:
          case GameStatus.ScriptChoice:
            ScriptRunner.next({ lastKey: this.lastKey });
            break;

          case GameStatus.Fighting:
            this.fightParty(event);
            this.updateScene();
            break;
        }
      }
    });

    EventManager.on(GameEvents.UpdateView, () => {
      this.generateMap();
      this.updateScene();
    });

    // 3d scene and go
    await this.third.warpSpeed("-ground", "-sky");
    EventManager.emit(GameEvents.UpdateView);
  }

  generateMap() {
    this.monsters.generate(this.state.dungeon);
    window.oaw = this.monsters;
    Graphics.renderMap(this.state.dungeon, this.monsters);
  }

  updateScene() {
    console.log("Explore.updateScene", this.state.party);
    this.isMoving = true;
    const camera = this.third.camera;
    const size = GameConfig.gridSize;
    const resolution = 5;
    const delay = 100 / resolution;
    const backward = this.state.party.getBackward();

    const dx = ((backward.x * size) - camera.position.x) / resolution;
    const dz = ((backward.y * size) - camera.position.z) / resolution;

    let i = 0;

    const fx = () => {
      if (i++ < resolution) {
        camera.position.setX(camera.position.x + dx);
        camera.position.setZ(camera.position.z + dz);
        Graphics.rotateFix();
        setTimeout(fx, delay);
      } else {
        camera.position.set(backward.x * size, size / 2, backward.y * size);
        this.isMoving = false;
        Graphics.rotateFix();
      }

      camera.lookAt(this.state.party.x * size, size / 2, this.state.party.y * size);
    };

    setTimeout(fx, delay);
  }

  moveMonsters() {
    const { party, dungeon } = this.state;
    this.monsters.chaseParty(party, dungeon);
    console.log("OAW is fught", this.monsters.isFighting(party));
    this.state.status = this.monsters.isFighting(party) ? GameStatus.Fighting : GameStatus.Exploring;
  }



  // TODO is there a better way to handle keys? both fight and move party cases
  // (call a key f() from a registry object?)
  // other module?
  fightParty(event: KeyboardEvent) {
    const { party } = this.state;

    switch (event.key) {
      case "a":
        party.turnLeft();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        break;

      case "d":
        party.turnRight();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        break;

      case " ":
        this.moveMonsters();
        break;

      default:
        console.log("Explore.fightParty: Unregistered key", event);
        break;
    }
  }

  moveParty(event: KeyboardEvent) {
    const { party } = this.state;

    switch (event.key) {
      case "a":
        party.turnLeft();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        break;

      case "d":
        party.turnRight();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        break;

      case "w":
        party.forward(this.state.dungeon);
        this.moveMonsters();
        break;

      case "s":
        party.backward(this.state.dungeon);
        this.moveMonsters();
        break;

      case " ": {
        // TODO address inmediate events - events that need a certain party angle
        const script = this.state.dungeon.getScript(party.x, party.y);

        if (script) {
          ScriptRunner.setScript(script);
          this.state.status = GameStatus.Script;
          ScriptRunner.next({ lastKey: this.lastKey });
        } else {
          this.moveMonsters();
        }

        break;
      }

      default:
        console.log("Explore.moveParty: Unregistered key", event);
        break;
    }
  }

  update() {}
}
