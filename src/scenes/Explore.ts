import { Scene3D } from "@enable3d/phaser-extension";
import { ExplorationStatus, GameState, Script } from "../types";
import { CommandRunner } from "../helpers/CommandRunner";

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

  async create() {
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

    // 3d
    const textures = this.registry.get("textures");
    console.log(textures);

    this.third.warpSpeed("-ground", "-sky");
    this.third.add.box({ x: 1, y: 2, height: 0.5, width: 4, depth: 4 }, { lambert: { map: textures[0] } });
    // const object = this.third.add.mesh({});
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
