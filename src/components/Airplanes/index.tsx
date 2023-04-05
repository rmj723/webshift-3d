import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Group } from "three";
import useApp from "../../store/useApp";
import { Airplane } from "./Airplane";

export const Airplanes = () => {
  const groupRef = useRef<Group>(null!);
  const { target, state } = useApp();

  useFrame(() => {
    if (!state.avatar || !groupRef.current) return;

    const { avatar, vehicle } = state;
    const pos = target === "avatar" ? avatar.position : vehicle.position;
    const { x, z } = pos;
    groupRef.current.position.set(x, 0, z);
  });

  return (
    <group ref={groupRef}>
      <Airplane />
      <Airplane rotation-y={Math.PI / 4} />
      <Airplane rotation-y={Math.PI / 2} />
      <Airplane rotation-y={(Math.PI * 3) / 4} />
      <Airplane rotation-y={Math.PI} />
      <Airplane rotation-y={(Math.PI * 5) / 4} />
      <Airplane rotation-y={(Math.PI * 6) / 4} />
      <Airplane rotation-y={(Math.PI * 7) / 4} />
    </group>
  );
};
