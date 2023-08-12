import { Script } from "../types";


export class Dungeon {
  name: string;

  floors: number[][];
  ceilings: number[][];
  objects: number[][];
  walls: number[][];
  scripts: Record<string, Script>;

  constructor() {
    this.name = "Test map";
    this.floors = [
      [1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1],
      [0, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [4, 4, 4, 4, 1],];

    this.ceilings = [
      [0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],];

    this.objects = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 3, 0],
      [0, 0, 0, 0, 0]
    ];

    this.walls = [
      [0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0]
    ];

    this.scripts = {
      "0x4": {
        inmediate: true,
        code: [
          { command: "display", data: "Hello world!" },
        ],
      },
      "4x4": {
        inmediate: true,
        code: [
          { command: "display", data: "This is a message" },
          { command: "display", data: "Answer" },
          { command: "choice", data: { text: "Are you ready?", options: { n: 3, y: 5 } } },
          { command: "display", data: "You are not ready" },
          { command: "endScript" },
          { command: "display", data: "You are indeed ready...great" },
        ],
      }
    };
  }

  getWidth() {
    return this.floors[0].length;
  }

  getHeight() {
    return this.floors.length;
  }

  isPassable(x: number, y: number) {
    return this.walls[y][x] === 0;
  }

  getScript(x: number, y: number): Script {
    return this.scripts[`${x}x${y}`];
  }



  debugShowMap(px, py, a) {
    let map = "";
    const char = ["n", "w", "s", "e"][a];

    for (let y = 0; y < this.floors.length; ++y) {
      for (let x = 0; x < this.floors[y].length; ++x) {
        if (px === x && py === y) {
          map += char;
        } else {
          map += this.walls[y][x];
        }
      }

      map += "\n";
    }
    //console.log(map);
    return map;
  }
}