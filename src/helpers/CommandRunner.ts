import { Explore } from "../scenes/Explore";
import { ExplorationStatus } from "../types";

export class CommandRunner {
  scene: Explore;

  constructor(scene: Explore) {
    this.scene = scene;
  }

  display(data: any) {
    console.log("commandDisplay", data);
    this.scene.pointer++;
  }

  endScript() {
    console.log("commandEndScript");
    this.scene.pointer = this.scene.script.code.length;
  }

  choice(data: any) {
    if (this.scene.currentStatus != ExplorationStatus.ScriptChoice) {
      this.scene.currentStatus = ExplorationStatus.ScriptChoice;
      console.log("commandChoice", data);
    } else {
      const option = data.options[this.scene.lastKey];

      if (option) {
        this.scene.pointer = option;
        this.scene.currentStatus = ExplorationStatus.Script;
        this.scene.runScript();
      }
    }
  }

}