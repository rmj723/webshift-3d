import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Scene } from "./Scene";
import SceneExporter from "./utils/SceneExporter";
import useApp from "./store/useApp";
import Player from "./components/ui/player/Player";
import Chat from "./components/ui/chat/Chat";
import Inventory from "./components/ui/Inventory/Inventory";
import { Loading } from "./components/Loading/Loading";
import { PortalPanel } from "./components/PortalGun/PortalPanel";

const App = () => {
  const { state, loading } = useApp();
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "run", keys: ["Shift"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Player name={"Joel Green"} image="/images/joel.png" />
      <Chat />
      <Inventory />
      {loading && <Loading />}
      <Canvas
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 10000,
          position: [5, 4, -10],
        }}
        onPointerDown={(e) => {
          if (e.button === 2) state.panning = true;
        }}
      >
        <Scene />

        {window.location.href.includes("localhost") && (
          <>
            <Perf position="bottom-right" />
            <SceneExporter />
          </>
        )}
      </Canvas>
      <PortalPanel />
    </KeyboardControls>
  );
};

const root = ReactDOM.createRoot(
  document.querySelector("#root") as HTMLDivElement
);

root.render(<App />);
