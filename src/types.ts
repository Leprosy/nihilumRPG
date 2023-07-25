import { Dungeon } from "./entities/Dungeon";
import { Party } from "./entities/Party";

export type GameState = {
  party: Party;
  map: Dungeon;
}

export enum ExplorationStatus {
  Exploring,
  Script,
  ScriptConfirm,
  ScriptPrompt
}

export type Script = {
  inmediate: boolean;
  code: ScriptInstruction[];
}

export type ScriptInstruction = {
  instruction: "display" | "prompt" | "confirm";
  data: any
}