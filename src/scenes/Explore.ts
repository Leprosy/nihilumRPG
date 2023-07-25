import { Scene3D } from "@enable3d/phaser-extension";
import { ExplorationStatus, GameState, Script } from "../types";

export class Explore extends Scene3D {
  state: GameState;
  text: Phaser.GameObjects.BitmapText;
  currentStatus: ExplorationStatus;
  script: Script;
  pointer: number;

  constructor() {
    super("Explore");
    this.currentStatus = ExplorationStatus.Exploring;
    this.pointer = 0;
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
      switch (this.currentStatus) {
        case ExplorationStatus.Exploring:
          this.moveParty(event);
          break;

        case ExplorationStatus.Script:
          this.runScript();
          break;
      }
    });

    // 3d
    this.third.warpSpeed();
    this.third.add.box({ x: 1, y: 2 });
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
    const instruction = this.script.code[this.pointer];
    console.log("Running", instruction);
    this.pointer++;

    if (this.pointer >= this.script.code.length) {
      console.log("Script ended");
      this.pointer = 0;
      this.currentStatus = ExplorationStatus.Exploring;
    }
  }

  update() {
  }
}
