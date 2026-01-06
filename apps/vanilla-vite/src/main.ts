import { mountThree } from "three-core";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;
root.innerHTML = `
  <div style="width:100vw;height:100vh;">
    <canvas id="c" style="display:block;width:100%;height:100%"></canvas>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#c")!;
const app = mountThree(canvas);

const resize = () => {
  const rect = canvas.getBoundingClientRect();
  app.resize(rect.width, rect.height);
};
resize();
window.addEventListener("resize", resize);
