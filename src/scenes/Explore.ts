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
    const size = GameConfig.gridSize;
    const resolution = 5;
    const forward = this.state.party.getForward();
    const backward = this.state.party.getBackward();

    const pos1 = this.third.camera.position;
    const pos2 = backward;
    const dx = ((pos2.x * size) - pos1.x) / resolution;
    const dz = ((pos2.y * size) - pos1.z) / resolution;
    let i = 0;
    const cam2 = this.third.camera.clone();
    cam2.lookAt(forward.x * size, size / 2, forward.y * size);
    console.log({ cam2: cam2.rotation.toArray(), cam1: this.third.camera.rotation.toArray() });
    this.third.camera.lookAt(forward.x * size, size / 2, forward.y * size);


    console.log({ x1: pos1.x, z1: pos1.z, x2: pos2.x, z2: pos2.y, dx, dz });

    const fx = () => {
      if (i++ < resolution) {
        this.third.camera.position.setX(pos1.x + dx);
        this.third.camera.position.setZ(pos1.z + dz);
        console.log("Explore.UpdateScene: Moving...");
        setTimeout(fx, 100 / resolution);
      } else {
        this.third.camera.position.set(backward.x * size, size / 2, backward.y * size);
        this.third.camera.lookAt(forward.x * size, size / 2, forward.y * size);
        this.isMoving = false;
        console.log("Explore.UpdateScene: Done moving.");
      }
    };

    setTimeout(fx,  100 / resolution);
  }

  moveParty(event: KeyboardEvent) {
    const { party } = this.state;

    // TODO is there a better way? (call a key f() from a registry object?)
    switch (event.key) {
      case "a":
        party.turnLeft();
        break;

      case "d":
        party.turnRight();
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
