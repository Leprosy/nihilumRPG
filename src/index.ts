import { Nihilum } from "./nihilum";

const main = async () => {
  const Game = new Nihilum({ rootElement: "#content" });
  window.Game = Game; // XXX Debug thing
};

main();
