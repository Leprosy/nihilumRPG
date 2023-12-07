import { AssetsManager, Texture, TextureAssetTask } from "@babylonjs/core";
import { assetList } from "../data/assets";

export class Loader {
  private static textures: Texture[] = [];

  static async loadTextures(): Promise<void> {
    console.log("Loader.loadTextures: Start load");
    const AM = new AssetsManager();
    // const animatedKeys = ["monster", "monsteract", "object"];

    assetList.forEach((item: string) => {
      const file = item.split("/").pop();

      if (file) {
        const key = file.split(".")[0];
        const task = AM.addTextureTask(key, `../../../${item}`);

        task.onSuccess = (task: TextureAssetTask) => {
          console.log("Loader.loadTextures: Task complete", task);
          this.textures[task.name] = task.texture;
        };
      }
    });

    return AM.loadAsync();
  }

  static getTexture(name: string): Texture {
    if (this.textures[name]) {
      return this.textures[name];
    } else {
      console.error(`Loader.getTexture: Error getting '${name}'`);
      return new Texture("");
    }
  }

  static async loadDungeon(name: string) {
    return await name;
  }
}
