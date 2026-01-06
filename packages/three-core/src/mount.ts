import * as THREE from "three";

export type ThreeApp = {
  resize: (w: number, h: number) => void;
  dispose: () => void;
};

export function mountThree(canvas: HTMLCanvasElement): ThreeApp {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 3;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 2);
  scene.add(light);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x44aa88 })
  );
  scene.add(cube);

  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  loop();

  const resize = (w: number, h: number) => {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const dispose = () => {
    cancelAnimationFrame(raf);
    renderer.dispose();
  };

  return { resize, dispose };
}
