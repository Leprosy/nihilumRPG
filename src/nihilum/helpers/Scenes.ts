export class Scenes {
  private static scenes = {};
  private static active: Scene;

  static add(name: string, scene: new () => Scene) {
    if (!this.scenes[name]) {
      const instance = new scene();
      this.scenes[name] = instance;
      instance.create();
    }
  }

  static getScenes() {
    return this.scenes;
  }

  static start(name: string) {
    if (this.scenes[name]) {
      if (this.active) this.active.stop();
      this.active = this.scenes[name];
      this.active.start();
    } else {
      console.error(`Scenes.start: Scene '${name}' not found`);
    }
  }
}

export class Scene {
  constructor() {
    console.log("Scene: object created");
  }

  create() {
    console.log("Scene: You need to implement create");
  }

  start() {
    console.log("Scene: You need to implement start");
  }

  stop() {
    console.log("Scene: You need to implement stop");
  }

  update() {
    console.log("Scene: You need to implement update");
  }
}
