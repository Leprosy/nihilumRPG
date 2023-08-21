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

  changeDungeon(data: any) {
    this.scene.currentStatus = ExplorationStatus.Teleporting;

    this.scene.load.once("complete", () => {
      try {
        console.log("map loaded", data, this.scene.cache.json.get("map"));
        const map = this.scene.cache.json.get("map");
        const start = map.startPoints[data.startPoint];
        this.scene.state.map.loadDungeon(map);
        this.scene.state.party.x = start.x;
        this.scene.state.party.y = start.y;
        this.scene.drawMap();
        this.scene.updateScene();
      } catch (e) {
        console.error("CommandRunner.changeDungeon: Error changing dungeon", e);
      }

      this.scene.currentStatus = ExplorationStatus.Exploring;
      this.scene.pointer++;
    });

    this.scene.cache.json.remove("map");
    this.scene.load.json("map", `assets/maps/${data.dungeon}.json`).start();
  }

}