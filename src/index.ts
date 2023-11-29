/* import { GameConfig } from "./nihilum/const/config";
import { renderDungeon } from "./nihilum/helpers/Graphics";
*/

import { Nihilum } from "./nihilum";

const main = async () => {
  const Game = new Nihilum({});
  // await Game.loadState("data/state.json");
  console.log("OAW!", Game);

  Game.start();
};

main();
