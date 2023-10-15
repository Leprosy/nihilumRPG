import { Scene3D } from "@enable3d/phaser-extension";
import { GameEvents, GameState, GameStatus } from "../types";
import { ScriptRunner } from "../helpers/ScriptRunner";
import { EventManager } from "../helpers/EventManager";
import { Graphics } from "../helpers/Graphics";
import { GameConfig } from "../constants/config";

export class Explore extends Scene3D {
  state: GameState;
  lastKey: string;
  isMoving: boolean;

  constructor() {
    super("Explore");
    this.lastKey = "";
    this.isMoving = false;
  }

  init() {
    this.accessThirdDimension();
    this.third.renderer.setPixelRatio(5);
  }

  create() {
    this.state = this.registry.get("state");

    // Events
    this.events.on("create", () => this.drawMap());

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
        }

      }
    });

    EventManager.on(GameEvents.UpdateView, () => {
      this.drawMap();
      this.updateScene();
    });

    // 3d scene
    this.third.warpSpeed("-ground", "-sky");

    // First set
    this.updateScene();
  }

  drawMap() {
    Graphics.renderMap(this.state.dungeon);
  }

  updateScene() {
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
        setTimeout(fx, delay);
      } else {
        camera.position.set(backward.x * size, size / 2, backward.y * size);
        this.isMoving = false;
      }

      camera.lookAt(this.state.party.x * size, size / 2, this.state.party.y * size);
    };

    setTimeout(fx, delay);
  }

  moveParty(event: KeyboardEvent) {
    const { party } = this.state;

    // TODO is there a better way? (call a key f() from a registry object?)
    switch (event.key) {
      case "a":
        party.turnLeft();
        Graphics.rotateFix(1);
        break;

      case "d":
        party.turnRight();
        Graphics.rotateFix(-1);
        break;

      case "w":
        party.forward(this.state.dungeon);
        break;

      case "s":
        party.backward(this.state.dungeon);
        break;

      case " ": {
        // TODO address inmediate events
        const script = this.state.dungeon.getScript(party.x, party.y);

        if (script) {
          ScriptRunner.setScript(script);
          this.state.status = GameStatus.Script;
          ScriptRunner.next({ lastKey: this.lastKey });
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
