import { Graphics } from "../helpers/Graphics";
import { Key } from "../helpers/Key";
import { Scene, Scenes } from "../helpers/Scenes";

export class Main extends Scene {
  create() {
    console.log("Main: Create was overriden?");
  }

  start() {
    console.log("Main: Start was overriden?");

    Key.start();
    Key.add("Space", (event) => {
      console.log("Space pressed", event);
    });
    Graphics.showMainMenu(() => {
      Scenes.start("another");
    });
  }

  stop() {
    Key.stop();
    Graphics.clearUI();
    console.log("Main: Stop was overriden?");
  }
}
