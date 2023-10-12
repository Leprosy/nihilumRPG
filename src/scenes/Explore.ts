import { ExtendedObject3D, Scene3D } from "@enable3d/phaser-extension";
import { GameEvents, GameState, GameStatus } from "../types";
import { ScriptRunner } from "../helpers/ScriptRunner";
import { EventManager } from "../helpers/EventManager";
import { Graphics } from "../helpers/Graphics";

const GRID = 10; // TODO: decouple this const, is used in Graphics too

export class Explore extends Scene3D {
  state: GameState;
  geometries: ExtendedObject3D[];
  runner: ScriptRunner;
  lastKey: string;

  constructor() {
    super("Explore");
    this.lastKey = "";
    this.runner = new ScriptRunner(this);
    this.geometries = [];
  }

  init() {
    this.accessThirdDimension();
    this.third.renderer.setPixelRatio(5);
  }

  preload() {}

  create() {
    this.state = this.registry.get("state");

    // External events
    EventManager.on(GameEvents.UpdateView, () => {
      this.drawMap();
      this.updateScene();
    });

    // Key events
    this.input.keyboard.on("keydown", event => {
      this.lastKey = event.key;

      switch (this.state.status) {
        case GameStatus.Exploring:
          this.moveParty(event);
          break;

        case GameStatus.Script:
        case GameStatus.ScriptChoice:
          this.runner.next();
          break;
      }

      this.updateScene();
    });

    // 3d scene
    this.third.warpSpeed("-ground", "-sky");
    this.drawMap();

    // First set
    this.updateScene();
  }

  drawMap() {
    Graphics.renderMap(this.geometries, this.state.dungeon, this.registry.get("textures"), this.third);
  }

  updateScene() {
    const forward = this.state.party.getForward();
    const backward = this.state.party.getBackward();
    this.third.camera.position.set(backward.x * GRID, GRID / 2, backward.y * GRID);
    this.third.camera.lookAt(forward.x * GRID, GRID / 2, forward.y * GRID);
  }

  moveParty(event) {
    const { party } = this.state;

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
          this.runner.setScript(script);
          this.state.status = GameStatus.Script;
          this.runner.next();
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
