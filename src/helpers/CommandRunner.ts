import { Explore } from "../scenes/Explore";
import { ExplorationStatus, Script } from "../types";

export class CommandRunner {
  script: Script;
  scene: Explore;
  pointer: number;

  constructor(scene: Explore) {
    this.scene = scene;
    this.pointer = 0;
  }

  setScript(script: Script) {
    this.pointer = 0;
    this.script = script;
  }

  next() {
    const line = this.script.code[this.pointer];
    const { command, data } = line;
    console.log("CommandRunner: running", command, data, line);
    this[command](data);
  }

  isComplete() {
    return this.pointer === this.script.code.length;
  }

  display(data: any) {
    console.log("commandDisplay", data);
    this.pointer++;
  }

  endScript() {
    console.log("commandEndScript");
    this.pointer = this.script.code.length;
  }

  choice(data: any) {
    if (this.scene.currentStatus != ExplorationStatus.ScriptChoice) {
      this.scene.currentStatus = ExplorationStatus.ScriptChoice;
      console.log("commandChoice", data);
    } else {
      const option = data.options[this.scene.lastKey];

      if (option) {
        this.pointer = option;
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

  /* giveQuest(data: any) {
    this.scene.quests.push({ id: data.id, description: data.description });
    this.scene.pointer++;
    this.scene.runScript();
  }

  checkQuest(data: any) {
    console.log(this.scene.quests);
    this.scene.pointer++;
  } */

}