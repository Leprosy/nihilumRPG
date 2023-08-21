import { Script } from "../types";


export class Dungeon {
  name: string;

  floors: number[][];
  ceilings: number[][];
  objects: number[][];
  walls: number[][];
  scripts: Record<string, Script>;

  constructor(data: any) {
    //TODO create a type for this?
    this.loadDungeon(data);
  }

  loadDungeon(data: any) {
    console.log("loading", data);
    try {
      this.name = data.name;
      this.floors = data.floors;
      this.ceilings = data.ceilings;
      this.objects = data.objects;
      this.walls = data.walls;
      this.scripts = data.scripts;
      console.log("done", this);
    } catch (e) {
      console.error("Dungeon.loadDungeon: Error loading map", e);
    }
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