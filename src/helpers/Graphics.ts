import Phaser from "phaser";
import { ExtendedObject3D, Scene3D, THREE } from "@enable3d/phaser-extension";
import { Dungeon } from "../entities/Dungeon";
import Third from "@enable3d/phaser-extension/dist/third";
import { TextureMap } from "../types";
import { GameConfig } from "../constants/config";

export class Graphics {
  private static currentMessage: Phaser.GameObjects.Group;
  static size = 10;

  static renderMap(geometries: ExtendedObject3D[], map: Dungeon, textures: TextureMap, third: Third) {
    // TODO refactor this shit!
    geometries.forEach(item => item.removeFromParent());
    geometries = [];

    for (let y = 0; y < map.getHeight(); ++y) {
      for (let x = 0; x < map.getWidth(); ++x) {
        const floor = map.floors[y][x];
        const ceiling = map.ceilings[y][x];
        const object = map.objects[y][x];
        const wall = map.walls[y][x];

        if (floor !== 0){
          geometries.push(third.add.box(
            { x: x * this.size, y: 0, z: y * this.size, height: this.size / 10, width: this.size, depth: this.size },
            { lambert: { map: textures.floor[floor - 1] } }));
        }

        if (ceiling !== 0){
          geometries.push(third.add.box(
            { x: x * this.size, y: this.size, z: y * this.size, height: this.size / 10, width: this.size, depth: this.size },
            { lambert: { map: textures.ceiling[ceiling - 1], transparent: true, opacity: 0.2 } }));
        }

        if (wall !== 0){
          geometries.push(third.add.box(
            { x: x * this.size, y: this.size / 2, z: y * this.size, height: this.size - this.size / 10, width: this.size, depth: this.size },
            { lambert: { map: textures.wall[wall - 1] } }));
        }

        if (object !== 0){
          geometries.push(third.add.sphere(
            { x: x * this.size, y: this.size / 2, z: y * this.size, radius: this.size / 5 },
            { lambert: { map: textures.wall[object - 1] } }));
        }
      }
    }

    third.add.sphere({ x: 0, y: 0, z: 0, radius: this.size * 100 },
      { lambert: { map: textures.sky[0], side: THREE.BackSide } });
  }

  static message(scene: Scene3D, title: string, text: string) {
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

  static dialog(scene: Scene3D, title: string, text: string, face: string) {
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
