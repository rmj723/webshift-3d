import { OrbitControls } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { createRoadGeo } from "../Building/createRoads";
import { useMaterials } from "../Building/useMaterials";

export const CurvedRoad = () => {
  const [obj, setObj] = useState<THREE.BufferGeometry | null>(null);
  const { roadMat } = useMaterials();

  useEffect(() => {
    setObj(
      createRoadGeo(
        [
          new THREE.Vector3(-25, 0, -25),
          new THREE.Vector3(-4, 2, -9),
          new THREE.Vector3(6, 0, 0),
          new THREE.Vector3(-3, 1, 1),
        ],
        2.8
      )
    );
  }, []);

  return (
    <>
      <ambientLight />
      <axesHelper />
      <OrbitControls />
      {obj && <mesh geometry={obj} material={roadMat} position-y={10}></mesh>}
    </>
  );
};
