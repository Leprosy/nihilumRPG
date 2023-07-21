import { Dungeon } from "./entities/Dungeon";
import { Party } from "./entities/Party";

export type GameState = {
  party: Party;
  map: Dungeon;
}