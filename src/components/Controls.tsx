import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import useApp from "../store/useApp";
import { useFrame } from "@react-three/fiber";

export const Controls = () => {
  const { state } = useApp();
  const ref = useRef<any>(null!);

  useEffect(() => {
    state.orbit = ref.current;
  }, [state]);

  useFrame(({ camera }) => {
    if (!ref.current) return;

    const d = camera.position.distanceTo(ref.current.target);
    camera.near = d < 150 ? 0.1 : 20;
    camera.updateProjectionMatrix();
  });

  return (
    <OrbitControls
      ref={ref}
      maxPolarAngle={1.5}
      enablePan={true}
      zoomSpeed={2}
      enableDamping={false}
      screenSpacePanning={false}
      minDistance={4}
      maxDistance={window.location.href.includes("localhost") ? 2000 : 500}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
};
