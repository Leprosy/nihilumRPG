import { Scene3D } from "@enable3d/phaser-extension";
import { GameEvents, GameState, GameStatus } from "../types";
import { ScriptRunner } from "../helpers/ScriptRunner";
import { EventManager } from "../helpers/EventManager";
import { Graphics } from "../helpers/Graphics";

const GRID = 10; // TODO: decouple this const, is used in Graphics too

export class Explore extends Scene3D {
  state: GameState;
  runner: ScriptRunner;
  lastKey: string;

  constructor() {
    super("Explore");
    this.lastKey = "";
    this.runner = new ScriptRunner(this);
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
    const forward = this.state.party.getForward();
    const backward = this.state.party.getBackward();
    this.third.camera.position.set(backward.x * GRID, GRID / 2, backward.y * GRID);
    this.third.camera.lookAt(forward.x * GRID, GRID / 2, forward.y * GRID);
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
