import Phaser from "phaser";
import { enable3d, Canvas } from "@enable3d/phaser-extension";
import { Main, Explore, Load } from "./scenes/";

export let Game: SimpleGame;

class SimpleGame {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
        height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2)
      },
      parent: "content",
      scene: [Main, Explore, Load],
      title: "A Game",
      version: "0.1",
      ...Canvas()
    };

    enable3d(() => Game = new Phaser.Game(config));
  }
}

window.onload = () => {
  Game = new SimpleGame();
};
