import { Dungeon } from "./entities/Dungeon";
import { Party } from "./entities/Party";
import { QuestManager } from "./helpers/QuestManager";

export type GameState = {
  party: Party;
  map: Dungeon;
  quests: QuestManager;
  status: Status;
}

export enum Status {
  Exploring,
  Teleporting,
  Script,
  ScriptChoice,
  ScriptPrompt
}

export type Script = {
  inmediate: boolean;
  code: ScriptInstruction[];
}

export type ScriptInstruction = {
  command: "display" | "prompt" | "choice" | "setPointer" | "endScript" | "comment";
  data?: any
}

export type Quest = {
  id: string;
  description: string;
}

export enum GameEvents {
  UpdateView = "UpdateView",
  LoadMap = "LoadMap"
}

export type loadMapArgs = {
  dungeon: string;
  call: () => void;
}