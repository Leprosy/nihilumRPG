import { Graphics } from "./helpers/Graphics";
import { Logger } from "./helpers/Logger";
import { StateManager } from "./helpers/StateManager";

type NihilumConfig = {
  rootElement: string;
}

export class Nihilum {
  private rootElement: Element;
  state: StateManager;

  constructor(config: NihilumConfig) {
    Logger.log("NihilumRPG", "init");

    this.rootElement = document.querySelector(config.rootElement);

    // Load assets


    // Init graphics
    Graphics.renderDungeon(this.rootElement);

    // Init state
    this.state = new StateManager();

    // Init something else?
  }

  start() {
    Logger.log("NihilumRPG: ");
  }
}
