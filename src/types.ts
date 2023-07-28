import { Dungeon } from "./entities/Dungeon";
import { Party } from "./entities/Party";

export type GameState = {
  party: Party;
  map: Dungeon;
}

export enum ExplorationStatus {
  Exploring,
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