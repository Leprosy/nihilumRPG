import Phaser from "phaser";
import { ExtendedObject3D, Scene3D, THREE } from "@enable3d/phaser-extension";
import { Dungeon } from "../entities/Dungeon";
import { GameConfig } from "../constants/config";
import { Game } from "..";

export class Graphics {
  private static currentMessage: Phaser.GameObjects.Group;
  private static geometries: ExtendedObject3D[] = [];
  private static objects: ExtendedObject3D[] = [];

  private static getScene(): Scene3D {
    return Game.scene.getScenes(true)[0] as Scene3D;
  }

  static renderMap(map: Dungeon) {
    const scene = this.getScene();

    // TODO refactor this shit!
    const third = scene.third;
    const size = GameConfig.gridSize;
    const textures = scene.registry.get("textures");
    this.geometries.forEach(item => item.removeFromParent());
    this.objects.forEach(item => item.removeFromParent());
    this.geometries = [];
    this.objects = [];

    for (let y = 0; y < map.getHeight(); ++y) {
      for (let x = 0; x < map.getWidth(); ++x) {
        const floor = map.floors[y][x];
        const ceiling = map.ceilings[y][x];
        const object = map.objects[y][x];
        const wall = map.walls[y][x];

        if (floor !== 0){
          this.geometries.push(third.add.box(
            { x: x * size, y: 0, z: y * size, height: size / 10, width: size, depth: size },
            { lambert: { map: textures.floor[floor - 1] } }));
        }

        if (ceiling !== 0){
          this.geometries.push(third.add.box(
            { x: x * size, y: size, z: y * size, height: size / 10, width: size, depth: size },
            { lambert: { map: textures.ceiling[ceiling - 1], transparent: true, opacity: 0.2 } }));
        }

        if (wall !== 0){
          this.geometries.push(third.add.box(
            { x: x * size, y: size / 2, z: y * size, height: size - size / 10, width: size, depth: size },
            { lambert: { map: textures.wall[wall - 1] } }));
        }

        if (object !== 0){
          this.geometries.push(third.add.sphere(
            { x: x * size, y: size / 2, z: y * size, radius: size / 5 },
            { lambert: { map: textures.wall[object - 1] } }));
        }
      }
    }

    // Sky dome
    third.add.sphere({ x: 0, y: 0, z: 0, radius: size * 100 },
      { lambert: { map: textures.sky[0], side: THREE.BackSide } });

    // Monsters
    const monsterSize = size * 0.9;
    const monster = third.add.plane({
      x: 0, y: monsterSize / 2, z: 0, height: monsterSize, width: monsterSize / 2
    },
    {
      lambert: { map: textures.monster[0], side: THREE.DoubleSide, transparent: true }
    });
    monster.material.map.offset.x = 0;
    monster.material.map.repeat.x = 0.25;

    this.objects.push(monster);
  }

  static rotateFix(factor: number) {
    const scene = this.getScene();
    this.objects.forEach((item: ExtendedObject3D) => {
      item.rotateY(Math.PI / 2 * factor);
    });
  }

  static message(title: string, text: string) {
    const scene = this.getScene();
    this.currentMessage = scene.add.group();
    this.currentMessage.add(scene.add.rectangle(GameConfig.width / 2, GameConfig.height / 2, 400, 300, 0xdcc072));
    this.currentMessage.add(
      scene.add.bitmapText(GameConfig.width / 2, GameConfig.height / 5, "font_large", title)
        .setOrigin(0.5, 0)
        .setTint(0x330000));
    this.currentMessage.add(
      scene.add.bitmapText(GameConfig.width / 2, GameConfig.height / 5 + 50, "font_small", text)
        .setOrigin(0.5, 0)
        .setTint(0x330000)
        .setFontSize(24));

    window.oaw = this.currentMessage;
  }

  static dialog(title: string, text: string, face: string) {
    const scene = this.getScene();
    this.currentMessage = scene.add.group();
    this.currentMessage.add(scene.add.rectangle(GameConfig.width / 2, GameConfig.height / 2, 400, 300, 0xdcc072));
    this.currentMessage.add(
      scene.add.bitmapText(GameConfig.width / 2 + 30, GameConfig.height / 4, "font_large", title)
        .setOrigin(0.5, 0)
        .setTint(0x330000));
    this.currentMessage.add(
      scene.add.bitmapText(GameConfig.width / 2, GameConfig.height / 3 + 100, "font_small", text)
        .setOrigin(0.5)
        .setTint(0x330000).setFontSize(24));
    this.currentMessage.add(scene.add.image(170, 120, "face0").setDisplaySize(100, 100));
  }

  static clearMessage() {
    console.log("Graphics.clearMessage: current msg", this.currentMessage);

    if (this.currentMessage) {
      this.currentMessage.children.each(item => item.destroy());
    }
  }
}
