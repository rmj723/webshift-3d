import useApp from "../../store/useApp";
import { Player } from "../Player/Player";
import React, { useEffect } from "react";
import * as Ably from "ably";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OtherPlayer } from "./OtherPlayer";

type AvatarProp = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  avatarAnim: string;
};

// number of players
let currentAvatarIDs: string[] = [];
let avatarTransformData: { [key: string]: AvatarProp } = {};
let idleTimers: number[] = [];

export const MultiPlayers = () => {
  const { state, tiles } = useApp();
  const [avatarIDs, setAvatarIDs] = React.useState<string[]>([]);

  const groupRef = React.useRef<THREE.Group>(null!);

  const [, getKeyboardControls] = useKeyboardControls();

  useEffect(() => {
    // const tiles = { c: 12 };
    if (Object.keys(tiles).length === 0) return;
    let timer = 0;

    (async () => {
      const apiKey =
        "ybyXHg.mHyTug:bycaIuavWh9GhIL9Q26dosOkpPNN7id5WmPlW1Kvb34";
      const realtime = new Ably.Realtime.Promise(apiKey);

      await realtime.connection.once("connected");
      console.log("Connected to Ably!");

      let i = 0;
      for (let key in tiles) {
        const value = tiles[key];

        const channel = realtime.channels.get(value);

        await channel.subscribe((msg) => {
          const { id, position, rotation, avatarAnim } = msg.data;
          avatarTransformData[id] = { position, rotation, avatarAnim };

          // Add a new avatar
          if (id !== state.playerID && !currentAvatarIDs.includes(id)) {
            setAvatarIDs((prev) => [...prev, id]);
            currentAvatarIDs.push(id);
          }

          // Detect Idle
          if (idleTimers[i]) clearTimeout(idleTimers[i]);
          idleTimers[i] = window.setTimeout(() => {
            avatarTransformData[id].avatarAnim = "Idle";
          }, 500);
        });
        ++i;

        // only the current `tile channel` publish
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
              await channel.publish("update", {
                id: state.playerID,
                position,
                rotation,
                avatarAnim: state.avatarAnim,
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
      const { position, rotation, avatarAnim } = avatarTransformData[g.name];
      // g.position.lerp(position, 0.1);
      g.position.copy(position);
      g.rotation.copy(rotation);
      g.userData.animate(avatarAnim);
    });
  });

  return (
    <>
      <Player position={[-2, 0, 0]} />

      <group ref={groupRef}>
        {avatarIDs.length > 0 &&
          avatarIDs.map((avatar, idx) => (
            <OtherPlayer key={idx} name={avatar} />
          ))}
      </group>
    </>
  );
};
