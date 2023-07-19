import { Scene3D } from "@enable3d/phaser-extension";
import { Actor } from "../entities/Actor";
import { Dungeon } from "../entities/Dungeon";

class Party {
  actors: Actor[];
  x: number;
  y: number;
  a: number;

  constructor(actors: Actor[]) {
    this.actors = actors;
    this.x = 0;
    this.y = 0;
    this.a = 0;
  }

  turnRight() {
    this.a = (this.a + 1) % 4;
  }

  turnLeft() {
    this.a = this.a - 1;
    if (this.a < 0) this.a = 3;
  }

  private checkBoundaries(x:number, y:number, map: Dungeon) {
    console.log({ x, y });

    if (x < 0) return;
    if (y < 0) return;
    if (x === map.getWidth()) return;
    if (y === map.getHeight()) return;

    console.log("we are ok");

    this.x = x;
    this.y = y;
  }

  forward(map: Dungeon) {
    const newx = this.x + Math.round(Math.sin(this.a * Math.PI / 2));
    const newy = this.y + Math.round(Math.cos(this.a * Math.PI / 2));
    this.checkBoundaries(newx, newy, map);
    console.log(this);
  }

  backward(map: Dungeon) {
    const newx = this.x - Math.round(Math.sin(this.a * Math.PI / 2));
    const newy = this.y - Math.round(Math.cos(this.a * Math.PI / 2));
    this.checkBoundaries(newx, newy, map);
    console.log(this);
  }
}



export class Stage extends Scene3D {
  party: Party;
  map: Dungeon;
  text: Phaser.GameObjects.BitmapText;

  constructor() {
    super("Stage");
  }

  init() {
    this.accessThirdDimension();
  }

  preload() {}

  create() {
    // this.add.image(400, 100, "logo");
    this.text = this.add.bitmapText(400, 200, "font", `oaw${  this.game.config.gameTitle}`).setOrigin(0.5).setTint(0x222222);

    // Key events
    this.input.keyboard.on("keydown", event => {
      console.log("OAW key", event);
      this.moveParty(event);

    });

    // ents/objs
    this.party = new Party([new Actor()]);
    this.map = new Dungeon();

    // 3d
    // creates a nice scene
    this.third.warpSpeed();

    // adds a box
    this.third.add.box({ x: 1, y: 2 });

    console.log(this);
  }

  moveParty(event) {
    console.log(event);

    switch (event.key) {
      case "a":
        this.party.turnLeft();
        break;

      case "d":
        this.party.turnRight();
        break;

      case "w":
        this.party.forward(this.map);
        break;

      case "s":
        this.party.backward(this.map);
        break;

      default:
        break;
    }

    console.log("OAW party>", this.party);
    this.text.setText(this.map.debugShowMap(this.party.x, this.party.y, this.party.a));
  }

  update() {
  }
}
