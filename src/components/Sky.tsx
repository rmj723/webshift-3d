import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { DoubleSide, Mesh, TextureLoader } from "three";
import useApp from "../store/useApp";

export const Sky = () => {
  const meshRef = useRef<Mesh>(null);
  const skyMap = useLoader(TextureLoader, "./textures/sky.jpg");

  const { target, state } = useApp();

  useFrame(() => {
    if (!state.avatar || !meshRef.current) return;

    const { avatar, vehicles } = state;
    const pos =
      target === "avatar"
        ? avatar.position
        : vehicles[avatar.userData.vehicleName].position;
    const { x, z } = pos;
    meshRef.current.position.set(x, -30, z);
  });

  return (
    <mesh ref={meshRef} position-y={-30}>
      <sphereGeometry args={[3000]} />
      <meshBasicMaterial map={skyMap} side={DoubleSide} />
    </mesh>
  );
};
