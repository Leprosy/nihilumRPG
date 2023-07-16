import Phaser from "phaser";
import { Scene3D } from "@enable3d/phaser-extension";

export class Stage extends Scene3D {
  keys: Phaser.Input.Keyboard.Key[];

  constructor() {
    super("Stage");
    this.keys = [];
  }

  init() {
    this.accessThirdDimension();
  }

  preload() { }

  create() {
    this.add.image(400, 100, "logo");
    this.add.bitmapText(400, 200, "font", this.game.config.gameTitle).setOrigin(0.5);
    this.add.bitmapText(400, 300, "font", "We are in\nthe first stage").setOrigin(0.5).setTint(0x0000dd).setCenterAlign();
    this.keys["space"] = this.input.keyboard.addKey("SPACE");

    // 3d
    // creates a nice scene
    this.third.warpSpeed();

    // adds a box
    this.third.add.box({ x: 1, y: 2 });

  }

  update() {
    if (this.keys["space"].isDown) {
      console.log("Space pressed on Stage");
      this.scene.start("Main");
    }
  }
}
