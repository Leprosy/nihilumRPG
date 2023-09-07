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
    this.load.bitmapFont("font_large", "assets/fonts/large.png", "assets/fonts/large.xml");
    this.load.bitmapFont("font_small", "assets/fonts/small.png", "assets/fonts/small.xml");
  }

  create() {
    // Display something
    this.add.bitmapText(400, 300, "font_large", "Nihilum RPG").setOrigin(0.5).setTint(0xff0066);
    this.add.bitmapText(400, 500, "font_small", "Typescript RPG engine").setOrigin(0.5).setTint(0xff0066);
    this.add.text(400, 700, `Version ${this.game.config.gameVersion} ${new Date()}`, textStyles.debug).setOrigin(0.5);

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
