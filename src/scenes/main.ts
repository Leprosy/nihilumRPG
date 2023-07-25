import Phaser from "phaser";
import { textStyles } from "../constants/styles";

export class Main extends Phaser.Scene {
  keys: Phaser.Input.Keyboard.Key[];

  constructor() {
    super("Main");
    this.keys = [];
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
    this.load.bitmapFont("font", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
  }

  create() {
    // Display something
    this.add.bitmapText(400, 300, "font", "Preszs <Space>").setOrigin(0.5).setTint(0xff0066);
    this.add.text(400, 500, `Version ${this.game.config.gameVersion} ${new Date()}`, textStyles.debug).setOrigin(0.5);

    // Keys
    this.keys["space"] = this.input.keyboard.addKey("SPACE");
    this.keys["a"] = this.input.keyboard.addKey("A");
  }

  update() {
    if (this.keys["space"].isDown) {
      this.scene.start("Load");
    }
  }
}
