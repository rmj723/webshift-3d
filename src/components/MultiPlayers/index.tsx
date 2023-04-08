import useApp from "../../store/useApp";
import { Player } from "../Player/Player";
import React, { useEffect } from "react";
import * as Ably from "ably";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type AvatarProp = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
};

// number of players
let count = 0;
let currentAvatarIDs: string[] = [];
let avatarTransformData: { [key: string]: AvatarProp } = {};

export const MultiPlayers = () => {
  const { state, tiles } = useApp();
  const [avatarIDs, setAvatarIDs] = React.useState<string[]>([]);

  const groupRef = React.useRef<THREE.Group>(null!);

  const [, getKeyboardControls] = useKeyboardControls();

  useEffect(() => {
    if (Object.keys(tiles).length === 0) return;

    let timer = 0;

    (async () => {
      const apiKey =
        "ybyXHg.mHyTug:bycaIuavWh9GhIL9Q26dosOkpPNN7id5WmPlW1Kvb34";
      const realtime = new Ably.Realtime.Promise(apiKey);

      await realtime.connection.once("connected");
      console.log("Connected to Ably!");

      for (let key in tiles) {
        const value = tiles[key];

        const channel = realtime.channels.get(value);

        await channel.subscribe((msg) => {
          const { id, position, rotation } = msg.data;

          avatarTransformData[id] = { position, rotation };

          if (id !== state.playerID && !currentAvatarIDs.includes(id)) {
            setAvatarIDs((prev) => [...prev, id]);
            currentAvatarIDs.push(id);
          }
        });

        if (key === "c") {
          timer = window.setInterval(async () => {
            const { forward, backward, leftward, rightward } =
              getKeyboardControls();
            const dirKeyPressed = [
              forward,
              backward,
              leftward,
              rightward,
            ].includes(true);

            const { position, rotation } = state.avatar;
            if (dirKeyPressed) {
              console.log(state.playerID);
              await channel.publish("update", {
                id: state.playerID,
                position,
                rotation,
              });
            }
          }, 100);
        }
      }
    })();

    return () => {
      clearInterval(timer);
    };
  }, [state, tiles, setAvatarIDs]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((g) => {
      const { position, rotation } = avatarTransformData[g.name];
      g.position.copy(position);
      g.rotation.copy(rotation);
    });
  });

  return (
    <>
      <Player position={[-2, 0, 0]} />

      <group ref={groupRef}>
        {avatarIDs.length > 0 &&
          avatarIDs.map((avatar, idx) => (
            <group key={idx} name={avatar}>
              <mesh position-y={0.1}>
                <boxGeometry args={[0.2]} />
                <meshBasicMaterial color="#81fd0d" />
              </mesh>
            </group>
          ))}
      </group>
    </>
  );
};
