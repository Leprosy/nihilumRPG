import { Graphics } from "./helpers/Graphics";
import { Loader } from "./helpers/Loader";
import { Scenes } from "./helpers/Scenes";
import { State } from "./helpers/State";
import { LoadGame } from "./scenes/LoadGame";
import { Main } from "./scenes/MainMenu";

type NihilumConfig = {
  rootElement: string;
};

export class Nihilum {
  constructor(config: NihilumConfig) {
    console.log("Nihilum: starting engine");

    const rootElement = document.querySelector(config.rootElement);

    if (!rootElement) {
      console.error(`Nihilum: undefined canvas rootElement: ${rootElement}`);
      return;
    }

    // Init state
    State.init();

    // Init graphics
    Graphics.init(rootElement);

    // Load assets and start
    Loader.loadTextures().then(() => {
      // We are ready
      console.log("Nihilum: engine ready");

      /**
       *  GAME CODE STARTS HERE
       */
      Scenes.add("mainMenu", Main);
      Scenes.add("loadGame", LoadGame);
      Scenes.start("mainMenu");
    });
  }
}
