import { Scene3D } from "@enable3d/phaser-extension";
import { GameState, Status } from "../types";
import { CommandRunner } from "../helpers/CommandRunner";

const GRID = 10;

export class Explore extends Scene3D {
  state: GameState;
  geometries: any[];
  runner: CommandRunner;
  lastKey: string;

  constructor() {
    super("Explore");
    this.lastKey = "";
    this.runner = new CommandRunner(this);
    this.geometries = [];
  }

  init() {
    this.accessThirdDimension();
  }

  preload() {}

  create() {
    this.state = this.registry.get("state");

    // Key events
    this.input.keyboard.on("keydown", event => {
      this.lastKey = event.key;

      switch (this.state.status) {
        case Status.Exploring:
          this.moveParty(event);
          break;

        case Status.Script:
        case Status.ScriptChoice:
          this.runScript();
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
    // TODO refactor this shit!
    this.geometries.forEach(item => item.removeFromParent());
    this.geometries = [];
    const { map } = this.state;
    const textures = this.registry.get("textures");

    for (let y = 0; y < map.getHeight(); ++y) {
      for (let x = 0; x < map.getWidth(); ++x) {
        const floor = map.floors[y][x];
        const ceiling = map.ceilings[y][x];
        const object = map.objects[y][x];
        const wall = map.walls[y][x];

        if (floor !== 0){
          this.geometries.push(this.third.add.box(
            { x: x * GRID, y: 0, z: y * GRID, height: GRID / 10, width: GRID, depth: GRID },
            { lambert: { map: textures.floor[floor - 1] } }));
        }

        if (ceiling !== 0){
          this.geometries.push(this.third.add.box(
            { x: x * GRID, y: GRID, z: y * GRID, height: GRID / 10, width: GRID, depth: GRID },
            { lambert: { map: textures.ceiling[ceiling - 1], transparent: true, opacity: 0.2 } }));
        }

        if (wall !== 0){
          this.geometries.push(this.third.add.box(
            { x: x * GRID, y: GRID / 2, z: y * GRID, height: GRID - GRID / 10, width: GRID, depth: GRID },
            { lambert: { map: textures.wall[wall - 1] } }));
        }

        if (object !== 0){
          this.geometries.push(this.third.add.sphere(
            { x: x * GRID, y: GRID / 2, z: y * GRID, radius: GRID / 5 },
            { lambert: { map: textures.wall[object - 1] } }));
        }
      }
    }
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
        const script = this.state.map.getScript(party.x, party.y);

        if (script) {
          this.runner.setScript(script);
          this.state.status = Status.Script;
          this.runScript();
        }

        break;
      }

      default:
        console.log("Explore.moveParty: Unregistered key", event);
        break;
    }
  }

  runScript() {
    if (this.runner.isComplete()) {
      console.log("Script ended");
      this.state.status = Status.Exploring;
      return;
    }

    try {
      this.runner.next();
    } catch (e) {
      console.error("Explore.runScript: error", e);
    }
  }

  update() {}
}
