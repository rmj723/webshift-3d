import React, { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { Controls } from "./components/Controls";
import { Buildings } from "./components/Building/Building";
import { Terrain } from "./components/Terrain";
import { Vehicle } from "./components/Vehicle/Vehicle";
import { Sky } from "./components/Sky";
import { Airplanes } from "./components/Airplanes/Airplanes";
import { PortalGun } from "./components/PortalGun/PortalGun";
import { MultiPlayers } from "./components/MultiPlayers/MultiPlayers";

export function Scene() {
  return (
    <>
      <color args={["#252731"]} attach="background" />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      <ambientLight color={"#fafafa"} intensity={0.25} />
      <pointLight color={"#fafafa"} intensity={0.4} position={[200, 90, 40]} />
      <pointLight color={"#fafafa"} intensity={0.4} position={[200, 90, -40]} />

      <Controls />
      <MultiPlayers />
      <Vehicle
        position={[0, 0, 4]}
        rotation={[0, -1, 0]}
        vehicleName="vehicle1"
      />

      <Vehicle
        position={[10, 0, 4]}
        rotation={[0, 1, 0]}
        vehicleName="vehicle2"
      />
      <Airplanes />
      <Terrain />
      <PortalGun name="gun1" position={[1, 0, -2]} />
      <Buildings />
      <Sky />
    </>
  );
}
