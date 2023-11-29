
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
    this.mind = this.genStat();
    this.aspect = this.genStat();
    this.body = this.genStat();
    this.dexterity = this.genStat();
  }

  genStat() {
    return Math.round(Math.random() * 4);
  }
}