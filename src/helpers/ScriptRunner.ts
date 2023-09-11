import { Game } from "..";
import { Explore } from "../scenes/Explore";
import { Status, Script, GameEvents } from "../types";
import { EventManager } from "./EventManager";
import { Graphics } from "./Graphics";



type MessageParams = {
  message: string;
  title: string;
}

type DialogParams = MessageParams & {
  face: string;
}

type CommandParams = MessageParams | DialogParams;

export class ScriptRunner {
  script: Script;
  scene: Explore; // TODO: Finish decoupling this from Explore
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
    Graphics.clearMessage();

    if (this.pointer >= this.script.code.length) {
      console.log("ScriptRunner.next: Script ended");
      state.status = Status.Exploring;
      return;
    }

    const { command, data } = this.script.code[this.pointer];
    console.log("ScriptRunner: Running", { pointer: this.pointer, command, data });
    this[command](data);
  }

  message(data: MessageParams) {
    Graphics.message(this.scene, data.title, data.message);
    this.pointer++;
  }

  dialog(data: DialogParams) {
    Graphics.dialog(this.scene, data.title, data.message, data.face);
    this.pointer++;
  }

  endScript() {
    this.pointer = this.script.code.length;
    this.next();
  }

  choice(data: any) {
    const state = Game.registry.get("state");
    Graphics.message(this.scene, "Select an option", Object.keys(data.options).join(","));

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

    EventManager.emit(GameEvents.LoadMap, {
      dungeon: data.dungeon,
      call: () => {
        try {
          const map = Game.cache.json.get("map");
          const start = map.startPoints[data.startPoint];
          state.map.loadDungeon(map);
          state.party.x = start.x;
          state.party.y = start.y;
          EventManager.emit(GameEvents.UpdateView);
        } catch (e) {
          console.error("ScriptRunner.changeDungeon: Error changing dungeon", e);
        }

        state.status = Status.Exploring;
        this.pointer++;
      }
    });
  }

  giveQuest(data: any) {
    const state = Game.registry.get("state");
    console.log("giving quest:", data);
    state.quests.pushQuest(data.id, data.description);
    console.log("quests now:", state.quests);
    this.pointer++;
    this.next();
  }

  checkQuest(data: any) {
    const state = Game.registry.get("state");
    console.log("quests are:", state.quests, "checking:", data);
    console.log("has quest?", state.quests.hasQuest(data.questID));

    if (state.quests.hasQuest(data.questID)) {
      this.pointer = data.true;
    } else {
      this.pointer = data.false;
    }

    this.next();
  }

}