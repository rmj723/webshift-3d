import React, { useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader, Vector2 } from "three";
import useApp from "../store/useApp";

const length = 2000;
let x_id = 0;
let z_id = 0;

export function Terrain() {
  const groundMap = useLoader(TextureLoader, "./textures/concret/base.jpg");
  groundMap.wrapS = groundMap.wrapT = RepeatWrapping;
  groundMap.repeat.set(30, 30);

  const [center, setCenter] = useState(new Vector2(0, 0));
  const { target, state } = useApp();

  useFrame(() => {
    if (!state.avatar) return;

    const { avatar, vehicle } = state;
    const pos = target === "avatar" ? avatar.position : vehicle.position;
    const { x, z } = pos;
    x_id = Math.floor(x / length);
    z_id = Math.floor(z / length);
    const _x = x_id * length;
    const _z = z_id * length;
    if (_x !== center.x || _z !== center.y) {
      setCenter(new Vector2(_x, _z));
    }
  });

  return (
    <>
      {Array(16)
        .fill(0)
        .map((_, idx) => (
          <mesh
            key={idx}
            position={[
              center.x + 2 * length - length * (idx % 4),
              -0.15,
              center.y + 2 * length - length * Math.floor(idx / 4),
            ]}
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[length, length]} />
            <meshStandardMaterial color="#7d7777" map={groundMap} />
          </mesh>
        ))}
    </>
  );
}
