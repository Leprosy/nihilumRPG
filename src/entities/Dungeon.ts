import { Script } from "../types";


export class Dungeon {
  name: string;

  floors: number[][];
  ceilings: number[][];
  objects: number[][];
  scripts: Record<string, Script>;

  constructor() {
    this.name = "Test map";
    this.floors = [ // Map is mirrored vertically
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 2],
      [1, 1, 1, 2, 3],
      [4, 1, 2, 3, 1],];

    this.ceilings = [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],];

    this.objects = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0],
      [0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0]
    ];

    this.scripts = {
      "0x4": {
        inmediate: true,
        code: [
          { instruction: "display", data: "Hello world!" },
          { instruction: "display", data: "Last instruction" },
          { instruction: "confirm", data: "Are you ready?" }
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
    return this.objects[y][x] === 0;
  }

  getScript(x: number, y: number): Script {
    return this.scripts[`${x}x${y}`];
  }



  debugShowMap(px, py, a) {
    let map = "";
    const char = ["n", "e", "s", "w"][a];

    for (let y = this.floors.length - 1; y >= 0; --y) {
      for (let x = 0; x < this.floors[y].length; ++x) {
        if (px === x && py === y) {
          map += char;
        } else {
          map += this.floors[y][x];
        }
      }

      map += "\n";
    }
    console.log(map);
    return map;
  }
}