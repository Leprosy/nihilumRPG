
export class Actor {
  hp: number;
  ap: number;
  name: string;

  mind:number;
  aspect:number;
  body:number;
  dexterity:number;

  constructor() {
    this.hp = 5;
    this.ap = 5;

    this.name = `OAW${new Date().getTime()}`;
    this.mind = 2;
    this.aspect = 1;
    this.body = 1;
    this.dexterity = 0;
  }
}