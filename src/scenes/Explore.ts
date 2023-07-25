import { Scene3D } from "@enable3d/phaser-extension";
import { GameState } from "../types";

export class Explore extends Scene3D {
  state: GameState;
  text: Phaser.GameObjects.BitmapText;

  constructor() {
    super("Explore");
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
      this.moveParty(event);
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

      default:
        break;
    }

    this.text.setText(this.state.map.debugShowMap(this.state.party.x, this.state.party.y, this.state.party.a));
  }

  update() {
  }
}
