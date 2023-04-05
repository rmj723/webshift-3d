import React, { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { Controls } from "./components/Controls";
import { Buildings } from "./components/Building/Building";
import { Player } from "./components/Player/Player";
import { Terrain } from "./components/Terrain";
import { Vehicle } from "./components/Vehicle";
import { Sky } from "./components/Sky";
import { Airplanes } from "./components/Airplanes";
import { PortalGun } from "./components/PortalGun/PortalGun";

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
      <Player position={[-2, 0, 0]} />
      <Vehicle
        position={[0, 0, 4]}
        rotation={[0, -1, 0]}
        vehicleName="vehicle"
      />
      <Airplanes />
      <Terrain />
      <PortalGun name="gun1" position={[1, 0, -2]} />
      {/* <Buildings originGPS={[-73.9730278, 40.7636166]} /> */}
      <Sky />
    </>
  );
}
