import { Game } from "..";
import { GameStatus, Script, GameEvents, GameState } from "../types";
import { EventManager } from "./EventManager";
import { Graphics } from "./Graphics";

type MessageParams = {
  message: string;
  title: string;
}

type DialogParams = MessageParams & {
  face: string;
}

type changeDungeonParams = {
  startPoint: number;
  dungeon: string;
}
//TODO is this worth the time?




export class ScriptRunner {
  private static script: Script;
  private static pointer: number;

  static setScript(script: Script) {
    this.pointer = 0;
    this.script = script;
  }

  static next(extraData?: any) {
    const state = Game.registry.get("state");
    Graphics.clearMessage();

    if (this.pointer >= this.script.code.length) {
      console.log("ScriptRunner.next: Script ended");
      state.status = GameStatus.Exploring;
      return;
    }

    const { command, data } = this.script.code[this.pointer];
    const args = { ...data, ...extraData };
    console.log("ScriptRunner: Running", { pointer: this.pointer, command, args });
    this[command](args);
  }

  static message(data: MessageParams) {
    Graphics.message(data.title, data.message);
    this.pointer++;
  }

  static dialog(data: DialogParams) {
    Graphics.dialog(data.title, data.message, data.face);
    this.pointer++;
  }

  static endScript() {
    this.pointer = this.script.code.length;
    this.next();
  }

  static choice(data: any) {
    const state: GameState = Game.registry.get("state");
    Graphics.message("Select an option", Object.keys(data.options).join(","));

    if (state.status != GameStatus.ScriptChoice) {
      state.status = GameStatus.ScriptChoice;
    } else {
      const option = data.options[data.lastKey];

      if (option) {
        this.pointer = option;
        state.status = GameStatus.Script;
        this.next();
      }
    }
  }

  static changeDungeon(data: changeDungeonParams) {
    const state: GameState = Game.registry.get("state");
    state.status = GameStatus.Teleporting;
    Graphics.message("Traveling...", "");

    EventManager.emit(GameEvents.LoadMap, {
      ...data,
      call: () => {
        try {
          EventManager.emit(GameEvents.UpdateView);
          Graphics.clearMessage();
        } catch (e) {
          console.error("ScriptRunner.changeDungeon: Error changing dungeon", e);
        }

        state.status = GameStatus.Exploring;
        this.pointer++;
      }
    });
  }

  static giveQuest(data: any) {
    const state: GameState = Game.registry.get("state");
    console.log("giving quest:", data);
    state.quests.pushQuest(data.id, data.description);
    console.log("quests now:", state.quests);
    this.pointer++;
    this.next();
  }

  static checkQuest(data: any) {
    const state: GameState = Game.registry.get("state");
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