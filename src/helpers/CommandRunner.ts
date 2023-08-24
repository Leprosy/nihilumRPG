import { Explore } from "../scenes/Explore";
import { Status, Script } from "../types";

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
    if (this.pointer >= this.script.code.length) {
      console.log("CommandRunner.next: Script ended");
      return;
    }

    const { command, data } = this.script.code[this.pointer];
    console.log("CommandRunner: running", { pointer: this.pointer, command, data });
    this[command](data);
  }

  isComplete() {
    return this.pointer === this.script.code.length;
  }

  display(data: any) {
    console.log("displaying", data);
    this.pointer++;
  }

  endScript() {
    this.pointer = this.script.code.length;
  }

  choice(data: any) {
    if (this.scene.state.status != Status.ScriptChoice) {
      this.scene.state.status = Status.ScriptChoice;
    } else {
      const option = data.options[this.scene.lastKey];

      if (option) {
        this.pointer = option;
        this.scene.state.status = Status.Script;
        this.scene.runScript();
      }
    }
  }

  changeDungeon(data: any) {
    this.scene.state.status = Status.Teleporting;

    this.scene.load.once("complete", () => {
      try {
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

      this.scene.state.status = Status.Exploring;
      this.pointer++;
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