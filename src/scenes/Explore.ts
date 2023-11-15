import { Scene3D } from "@enable3d/phaser-extension";
import { GameEvents, GameState, GameStatus, Position2D } from "../types";
import { ScriptRunner } from "../helpers/ScriptRunner";
import { EventManager } from "../helpers/EventManager";
import { Graphics } from "../helpers/Graphics";
import { GameConfig } from "../constants/config";
import { MonsterManager } from "../entities/MonsterManager";
import { CombatQueue } from "../helpers/CombatQueue";
import { Monster } from "../entities/Monster";
import { executeFrames } from "../helpers/animation";

export class Explore extends Scene3D {
  state: GameState;
  lastKey: string;
  isBlocked: boolean;
  monsters: MonsterManager;
  combatQueue: CombatQueue;

  constructor() {
    super("Explore");
    this.lastKey = "";
    this.isBlocked = false;
    this.monsters = new MonsterManager();
    this.combatQueue = new CombatQueue();
  }

  init() {
    this.accessThirdDimension();
    this.third.renderer.setPixelRatio(5);
  }

  async create() {
    this.state = this.registry.get("state");
    this.combatQueue.pushActors(this.state.party.actors);

    // Events
    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      if (!this.isBlocked) {
        this.isBlocked = true;
        this.lastKey = event.key;

        switch (this.state.status) {
          case GameStatus.Exploring:
            this.moveParty(event);
            break;

          case GameStatus.Script:
          case GameStatus.ScriptChoice:
            ScriptRunner.next({ lastKey: this.lastKey });
            this.isBlocked = false;
            break;

          case GameStatus.Fighting:
            this.fightParty(event);
            break;

          case GameStatus.FightingChoice:
            this.fightChoiceParty(event);
            break;
        }
      }
    });

    EventManager.on(GameEvents.UpdateView, () => {
      this.generateMap();
      this.updateCamera();
    });

    // 3d scene and go
    await this.third.warpSpeed("-ground", "-sky");
    EventManager.emit(GameEvents.UpdateView);
  }

  generateMap() {
    this.monsters.generate(this.state.dungeon);
    Graphics.renderMap(this.state.dungeon, this.monsters);
  }

  updateCamera(cb?: () => void) {
    console.log("Explore.updateCamera", this.state.party);
    const camera = this.third.camera;
    const size = GameConfig.gridSize;
    const resolution = 5;
    const backward = this.state.party.getBackward();

    const dx = ((backward.x * size) - camera.position.x) / resolution;
    const dz = ((backward.y * size) - camera.position.z) / resolution;

    executeFrames(() => {
      camera.position.setX(camera.position.x + dx);
      camera.position.setZ(camera.position.z + dz);
      Graphics.rotateFix();
    }, () => {
      camera.position.set(backward.x * size, size / 2, backward.y * size);
      Graphics.rotateFix();

      if (cb !== undefined) {
        cb();
      }
    }, () => {
      camera.lookAt(this.state.party.x * size, size / 2, this.state.party.y * size);
    }, resolution, 100);
  }

  moveMonsters() {
    const { party, dungeon } = this.state;
    this.monsters.chaseParty(party, dungeon);

    if (this.monsters.isFighting(party)) {
      this.combatQueue.pushActors(this.monsters.getMonstersAt(party as Position2D));
      if (this.state.status === GameStatus.Exploring) this.doNextCombatAction(); // first time, do the action as soon as possible
      this.state.status = GameStatus.Fighting;
    }
  }

  doNextCombatAction() {
    this.isBlocked = true;
    const actor = this.combatQueue.getNextActor();

    if (actor instanceof Monster) {
      console.log("Explore.doNextCombatAction: Monster action executed", actor);

      actor.obj3d.executeAction(() => {
        this.doNextCombatAction();
      }, 0, 2, 500);
    } else {
      console.log("Explore.doNextCombatAction: Party action", actor);
      this.isBlocked = false;
      this.state.status = GameStatus.FightingChoice;
      this.moveMonsters();
    }
  }



  // TODO is there a better way to handle keys? both fight and move party cases
  // (call a key f() from a registry object?)
  // other module?
  fightChoiceParty(event: KeyboardEvent) {
    const { party } = this.state;

    switch (event.key) {
      case "a":
        party.turnLeft();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        this.updateCamera(() => this.isBlocked = false);
        break;

      case "d":
        party.turnRight();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        this.updateCamera(() => this.isBlocked = false);
        break;

      case " ":
        console.log("Explore.fightChoiceParty: Party action done");
        this.state.status = GameStatus.Fighting;
        this.doNextCombatAction();
        break;

      default:
        console.log("Explore.fightChoiceParty: Unregistered key", event);
        this.isBlocked = false;
        break;
    }
  }

  fightParty(event: KeyboardEvent) {
    const { party } = this.state;

    switch (event.key) {
      case "a":
        party.turnLeft();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        this.updateCamera(() => this.isBlocked = false);
        break;

      case "d":
        party.turnRight();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        this.updateCamera(() => this.isBlocked = false);
        break;

      case " ":
        this.doNextCombatAction();
        break;

      default:
        console.log("Explore.fightParty: Unregistered key", event);
        this.isBlocked = false;
        break;
    }
  }

  moveParty(event: KeyboardEvent) {
    const { party } = this.state;

    switch (event.key) {
      case "a":
        party.turnLeft();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        break;

      case "d":
        party.turnRight();
        Graphics.rotateFix();
        this.monsters.updateMonsters3dObjects();
        break;

      case "w":
        party.forward(this.state.dungeon);
        this.moveMonsters();
        break;

      case "s":
        party.backward(this.state.dungeon);
        this.moveMonsters();
        break;

      case " ": {
        // TODO address inmediate events - events that need a certain party angle
        const script = this.state.dungeon.getScript(party.x, party.y);

        if (script) {
          ScriptRunner.setScript(script);
          this.state.status = GameStatus.Script;
          ScriptRunner.next({ lastKey: this.lastKey });
        } else {
          this.moveMonsters();
        }

        break;
      }

      default:
        console.log("Explore.moveParty: Unregistered key", event);
        break;
    }

    this.updateCamera(() => this.isBlocked = false);
  }

  update() {}
}
