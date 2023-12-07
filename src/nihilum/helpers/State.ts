type GameState = {
  dungeon: string;
  quests: string[];
};

export class State {
  private static instance: State;
  private state: GameState;

  private constructor() {
    this.state = {
      dungeon: "map0",
      quests: [],
    };
  }

  static init() {
    if (!State.instance) {
      State.instance = new State();
      console.log("StateManager: State initialized");
      return;
    }

    console.log("StateManager: State already initialized");
  }

  static get(key: string) {
    const data = this.instance.state[key];

    if (data) {
      return data;
    } else {
      console.error(`StateManager.get: invalid key ${key}`);
    }
  }

  static set(key: string, data: any) {
    // TODO: Can we hint this?
    this.instance.state[key] = data;
  }

  async load(uri: string) {
    return `oaw${uri}`;
  }
}
