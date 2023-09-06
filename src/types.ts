import { Dungeon } from "./entities/Dungeon";
import { Party } from "./entities/Party";
import { QuestManager } from "./helpers/QuestManager";
import { Texture } from "three/src/textures/Texture";

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

export type TextureMap = Record<string, Texture[]>;

export enum GameEvents {
  UpdateView = "UpdateView",
  LoadMap = "LoadMap"
}

export type loadMapArgs = {
  dungeon: string;
  call: () => void;
}