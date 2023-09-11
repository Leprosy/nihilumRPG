import Phaser from "phaser";
import { textStyles } from "../constants/styles";
import { GameConfig } from "../constants/config";

export class Main extends Phaser.Scene {
  keys: Phaser.Input.Keyboard.Key[];

  constructor() {
    super("Main");
    this.keys = [];
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
    this.load.bitmapFont("font_huge", "assets/fonts/huge.png", "assets/fonts/huge.xml");
    this.load.bitmapFont("font_large", "assets/fonts/large.png", "assets/fonts/large.xml");
    this.load.bitmapFont("font_small", "assets/fonts/small.png", "assets/fonts/small.xml");
  }

  create() {
    // Display something
    this.add.bitmapText(GameConfig.width / 2, GameConfig.height / 3, "font_huge", "Nihilum RPG").setTint(0xff0066).setOrigin(0.5);
    this.add.bitmapText(GameConfig.width / 2, GameConfig.height / 3 + 50, "font_large", "Typescript RPG engine").setOrigin(0.5).setTint(0xff0066);
    this.add.bitmapText(GameConfig.width / 2, GameConfig.height / 3 + 100, "font_small", "<Press SPACE>").setOrigin(0.5).setTint(0xff0066);
    this.add.text(GameConfig.width / 2, GameConfig.height / 3 + 200, `this is long text???\ncan be rendered?\n Version ${this.game.config.gameVersion} ${new Date()}`, textStyles.debug).setOrigin(0.5);

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
