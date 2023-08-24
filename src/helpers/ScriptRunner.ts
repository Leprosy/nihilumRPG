import { Game } from "..";
import { Explore } from "../scenes/Explore";
import { Status, Script } from "../types";
import { EventManager } from "./EventManager";

export class ScriptRunner {
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
    const state = Game.registry.get("state");

    if (this.pointer >= this.script.code.length) {
      console.log("ScriptRunner.next: Script ended");
      state.status = Status.Exploring;
      return;
    }

    const { command, data } = this.script.code[this.pointer];
    console.log("ScriptRunner: Running", { pointer: this.pointer, command, data });
    this[command](data);
  }

  display(data: any) {
    console.log(Game);
    console.log(Game.events);

    console.log("Displaying", data);
    EventManager.emit("taldo", "crap fuck!");
    this.pointer++;
  }

  endScript() {
    this.pointer = this.script.code.length;
  }

  choice(data: any) {
    const state = Game.registry.get("state");

    if (state.status != Status.ScriptChoice) {
      state.status = Status.ScriptChoice;
    } else {
      const option = data.options[this.scene.lastKey];

      if (option) {
        this.pointer = option;
        state.status = Status.Script;
        this.next();
      }
    }
  }

  changeDungeon(data: any) {
    const state = Game.registry.get("state");
    state.status = Status.Teleporting;

    Game.load.once("complete", () => {
      try {
        const map = Game.cache.json.get("map");
        const start = map.startPoints[data.startPoint];
        state.map.loadDungeon(map);
        state.party.x = start.x;
        state.party.y = start.y;
        this.scene.drawMap();
        this.scene.updateScene();
      } catch (e) {
        console.error("ScriptRunner.changeDungeon: Error changing dungeon", e);
      }

      state.status = Status.Exploring;
      this.pointer++;
    });

    Game.cache.json.remove("map");
    Game.load.json("map", `assets/maps/${data.dungeon}.json`).start();
  }

  /* giveQuest(data: any) {
    const state = Game.registry.get("state");
    state.quests.push({ id: data.id, description: data.description });
    this.pointer++;
    this.next();
  }

  checkQuest(data: any) {
    console.log(this.scene.quests);
    this.pointer++;
    // this.next();
  } */

}