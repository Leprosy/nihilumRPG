import { ExtendedObject3D } from "@enable3d/phaser-extension";
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
  Exploring,
  Teleporting,
  Script,
  ScriptChoice,
  ScriptPrompt,
  Fighting,
  FightingChoice
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

export interface Monster3D extends ExtendedObject3D {
  switchTexture: () => void;
  executeAction: (end: () => void, index1: number, index2: number, time: number) => void;
}