import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}
const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
function saveString(text, filename) {
  save(new Blob([text], { type: "text/plain" }), filename);
}

const options = {
  trs: false,
  onlyVisible: false,
  binary: true,
  maxTextureSize: 4096,
};

function exportScene(exporter, scene) {
  exporter.parse(
    scene,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, "scene.glb");
      } else {
        const output = JSON.stringify(result, null, 2);
        saveString(output, "scene.gltf");
      }
    },
    function (error) {
      console.log("An error happened during parsing", error);
    },
    options
  );
}

export default function SceneExporter() {
  const exporter = new GLTFExporter();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const button = document.createElement("button");
    button.innerText = "Export scene";
    button.style.position = "absolute";
    button.style.bottom = "20px";
    button.style.right = "20px";

    button.addEventListener("click", () => {
      exportScene(exporter, scene);
    });
    document.body.appendChild(button);
  }, []);

  return <></>;
}
