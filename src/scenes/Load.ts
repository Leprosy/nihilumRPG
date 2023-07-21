import Phaser from "phaser";

export class Load extends Phaser.Scene {

  constructor() {
    super("Load");
  }

  init() {
  }

  preload() {}

  create() {
    console.log("This is Load");
    this.scene.start("Stage");
  }

  update() {

  }
}
