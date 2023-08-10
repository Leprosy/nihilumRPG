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
    });

    //DEBUG
    window.cam = this.third.camera;
    window.party = this.state.party;



    // 3d scene
    const textures = this.registry.get("textures");
    this.third.warpSpeed("-ground", "-sky");

    for (let x = 0; x < this.state.map.getWidth(); x++) {
      for (let y = 0; y < this.state.map.getHeight(); ++y) {
        const floor = this.state.map.floors[x][y];
        const ceiling = this.state.map.ceilings[x][y];
        const object = this.state.map.objects[x][y];
        const wall = this.state.map.walls[x][y];

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

    window.party = this.third.add.sphere({ x: 0, y: 0, z: 0, radius: GRID / 10 }, { lambert: { color: "#ff0000" } });

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
        console.log(script);

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

    // this.third.camera.position.set(this.state.party.x * 4, 0, this.state.party.y * 4);
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
