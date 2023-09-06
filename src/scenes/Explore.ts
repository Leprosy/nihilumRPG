import { ExtendedObject3D, Scene3D } from "@enable3d/phaser-extension";
import { GameEvents, GameState, Status } from "../types";
import { ScriptRunner } from "../helpers/ScriptRunner";
import { EventManager } from "../helpers/EventManager";
import { MapDraw } from "../helpers/MapDraw";

const GRID = 10;

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
        case Status.Exploring:
          this.moveParty(event);
          break;

        case Status.Script:
        case Status.ScriptChoice:
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
    MapDraw.render(this.geometries, this.state.map, this.registry.get("textures"), this.third);
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
        party.forward(this.state.map);
        break;

      case "s":
        party.backward(this.state.map);
        break;

      case " ": {
        // TODO address inmediate events
        const script = this.state.map.getScript(party.x, party.y);

        if (script) {
          this.runner.setScript(script);
          this.state.status = Status.Script;
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
