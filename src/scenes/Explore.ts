import { Scene3D } from "@enable3d/phaser-extension";
import { ExplorationStatus, GameState, Script } from "../types";
import { CommandRunner } from "../helpers/CommandRunner";

const GRID = 10;

export class Explore extends Scene3D {
  state: GameState;
  text: Phaser.GameObjects.BitmapText;

  currentStatus: ExplorationStatus;

  script: Script;
  pointer: number;
  lastKey: string;
  runner: CommandRunner;

  constructor() {
    super("Explore");
    this.currentStatus = ExplorationStatus.Exploring;
    this.pointer = 0;
    this.lastKey = "";
    this.runner = new CommandRunner(this);
  }

  init() {
    this.accessThirdDimension();
  }

  preload() {}

  create() {
    this.state = this.registry.get("state");
    this.text = this.add.bitmapText(400, 200, "font", `oaw${  this.game.config.gameTitle}`).setOrigin(0.5).setTint(0x222222);

    // Key events
    this.input.keyboard.on("keydown", event => {
      this.lastKey = event.key;

      switch (this.currentStatus) {
        case ExplorationStatus.Exploring:
          this.moveParty(event);
          break;

        case ExplorationStatus.Script:
        case ExplorationStatus.ScriptChoice:
          this.runScript();
          break;
      }

      this.updateScene();
    });

    // 3d scene
    const textures = this.registry.get("textures");
    this.third.warpSpeed("-ground", "-sky");


    for (let y = 0; y < this.state.map.getHeight(); ++y) {
      for (let x = 0; x < this.state.map.getWidth(); ++x) {
        const floor = this.state.map.floors[y][x];
        const ceiling = this.state.map.ceilings[y][x];
        const object = this.state.map.objects[y][x];
        const wall = this.state.map.walls[y][x];

        if (floor !== 0){
          this.third.add.box(
            { x: x * GRID, y: 0, z: y * GRID, height: GRID / 10, width: GRID, depth: GRID },
            { lambert: { map: textures.floor[floor - 1] } });
        }

        if (ceiling !== 0){
          this.third.add.box(
            { x: x * GRID, y: GRID, z: y * GRID, height: GRID / 10, width: GRID, depth: GRID },
            { lambert: { map: textures.ceiling[ceiling - 1], transparent: true, opacity: 0.2 } });
        }

        if (wall !== 0){
          this.third.add.box(
            { x: x * GRID, y: GRID / 2, z: y * GRID, height: GRID - GRID / 10, width: GRID, depth: GRID },
            { lambert: { map: textures.wall[wall - 1] } });
        }

        if (object !== 0){
          this.third.add.sphere(
            { x: x * GRID, y: GRID / 2, z: y * GRID, radius: GRID / 5 },
            { lambert: { map: textures.wall[object - 1] } });
        }
      }
    }

    // DEBUG
    window.party = this.third.add.box({ x: 0, y: 0, z: 0, height: GRID / 4 }, { lambert: { color: "#ff0000" } });
    window.cam = this.third.camera;
    // First set
    this.updateScene();
  }

  moveParty(event) {
    switch (event.key) {
      case "a":
        this.state.party.turnLeft();
        break;

      case "d":
        this.state.party.turnRight();
        break;

      case "w":
        this.state.party.forward(this.state.map);
        break;

      case "s":
        this.state.party.backward(this.state.map);
        break;

      case " ": {
        const script = this.state.map.getScript(this.state.party.x, this.state.party.y);

        if (script) {
          this.script = script;
          this.currentStatus = ExplorationStatus.Script;
          this.runScript();
        }
        break;
      }

      default:
        break;
    }
  }

  updateScene() {
    const forward = this.state.party.getForward();
    const backward = this.state.party.getBackward();
    console.log("Update: f/b", forward, backward);
    console.log("Update: party", this.state.party);
    this.third.camera.position.set(backward.x * GRID, GRID / 2, backward.y * GRID);
    this.third.camera.lookAt(forward.x * GRID, GRID / 2, forward.y * GRID);
    window.party.position.set(this.state.party.x * GRID, 0, this.state.party.y * GRID);
    this.text.setText(this.state.map.debugShowMap(this.state.party.x, this.state.party.y, this.state.party.a));
  }

  runScript() {
    const line = this.script.code[this.pointer];
    console.log("Running", line);

    try {
      this.runner[line.command](line.data);
    } catch (e) {
      console.error("Command not found", e, line);
    }

    if (this.pointer >= this.script.code.length) {
      console.log("Script ended");
      this.pointer = 0;
      this.currentStatus = ExplorationStatus.Exploring;
    }
  }

  update() {}
}
