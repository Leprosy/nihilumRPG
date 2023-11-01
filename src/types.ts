import { Dungeon } from "./entities/Dungeon";
import { Party } from "./entities/Party";
import { QuestManager } from "./helpers/QuestManager";
import { Texture } from "three/src/textures/Texture";

export type GameState = {
  party: Party;
  dungeon: Dungeon;
  quests: QuestManager;
  status: GameStatus;
}

export enum GameEvents {
  UpdateView = "UpdateView",
  LoadMap = "LoadMap",
  ScreenCommand = "ScreenCommand"
}

export enum GameStatus {
  Fighting,
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

export type TextureMap = Record<string, Texture[]>;

export type Position2D = {
  x: number,
  y: number
}