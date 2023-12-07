import {
  AdvancedDynamicTexture,
  Button,
  Control,
  Image,
} from "@babylonjs/gui/2D";
import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
} from "@babylonjs/core";

export class Graphics {
  static ANTIALIAS = false;
  static ADAPT_DEVICE_RATIO = false;

  private static scene: Scene;
  private static engine: Engine;
  private static GUI: AdvancedDynamicTexture;

  static init(root: Element) {
    // Init engine
    const canvas = root as HTMLCanvasElement;
    const engine = new Engine(
      canvas,
      this.ANTIALIAS,
      {},
      this.ADAPT_DEVICE_RATIO
    );
    const scene = new Scene(engine);
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 1;
    this.scene = scene;
    this.engine = engine;

    // GUI
    this.GUI = AdvancedDynamicTexture.CreateFullscreenUI(
      "GUI",
      true,
      this.scene
    );

    // Resize event
    window.addEventListener("resize", () => {
      console.log("Graphics: Resizing event");
      this.engine.resize();
    });

    // Run the damn thing
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  static clearUI() {
    const controls = this.GUI.getChildren()[0].children;
    controls.forEach((item: Control) => this.GUI.removeControl(item));
    //this.GUI.getControlsByType();
    //this.GUI.removeControl();
    console.log(this.GUI);
  }

  static showMainMenu(cb: () => void) {
    const logo = new Image("but", "../../../assets/logo.png");
    const button1 = Button.CreateSimpleButton("but1", "233#");
    button1.width = "30%";
    button1.height = "8%";
    button1.color = "white";
    button1.background = "green";
    button1.fontSize = "5%";
    button1.onPointerUpObservable.add(function () {
      console.log("Graphics.showMainMenu: cb called");
      cb();
    });

    this.GUI.addControl(logo);
    this.GUI.addControl(button1);
  }
}

/*
// Mesh
    const ground = MeshBuilder.CreateGround(
      "ground1",
      { width: 6, height: 6 },
      this.scene
    );
    const material = new StandardMaterial("material0");
    material.diffuseTexture = Loader.getTexture("ceiling1");
    ground.material = material;

// GUI
    const button1 = Button.CreateSimpleButton("but1", "233#");
    button1.width = "30%";
    button1.height = "8%";
    button1.color = "white";
    button1.background = "green";
    button1.fontSize = "5%";
    button1.onPointerUpObservable.add(function () {
      console.log("you did it!");
    });
    const logo = new Image("but", "../../../assets/logo.png");

    // this.GUI.addControl(logo);
    this.GUI.addControl(button1);
*/
