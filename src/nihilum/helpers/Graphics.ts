import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

// Side-effects only imports allowing the standard material to be used as default.
import "@babylonjs/core/Materials/standardMaterial";
// Side-effects only imports allowing Mesh to create default shapes (to enhance tree shaking, the construction methods on mesh are not available if the meshbuilder has not been imported).
import "@babylonjs/core/Meshes/Builders/sphereBuilder";
import "@babylonjs/core/Meshes/Builders/boxBuilder";
import "@babylonjs/core/Meshes/Builders/groundBuilder";

export const Graphics = {
  renderDungeon(root: Element) {
    const canvas = root as HTMLCanvasElement;
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 2;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    Mesh.CreateGround("ground1", 6, 6, 2, scene);

    engine.runRenderLoop(() => {
      scene.render();
    });
  }
};
