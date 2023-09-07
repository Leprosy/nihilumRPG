import Phaser from "phaser";
import { enable3d, Canvas } from "@enable3d/phaser-extension";
import { Main, Explore, Load } from "./scenes/";
import { GameConfig } from "./constants/config";

export let Game: Phaser.Game;

class SimpleGame {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      transparent: true,
      width: GameConfig.width,
      height: GameConfig.height,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      parent: "content",
      scene: [Main, Explore, Load],
      title: GameConfig.name,
      version: "0.1",
      ...Canvas()
    };

    enable3d(() => Game = new Phaser.Game(config));
  }
}

window.onload = () => {
  new SimpleGame();
};
