import useApp from "../../store/useApp";
import { Player } from "../Player/Player";
import React, { useEffect } from "react";
import * as Ably from "ably";
import * as THREE from "three";
import { Vector3, Euler } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OtherPlayer } from "./OtherPlayer";
import { TARGETS } from "../../utils/types";
import { useAbly } from "./useAbly";

type PlayerStateType = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  animation: string;
  target: string;
  vehicleName: string;
  timer?: number;
};

// number of players
let currentAvatarIDs: string[] = [];
let playerStates: { [key: string]: PlayerStateType } = {};
let idleTimers: number[] = [];

export const MultiPlayers = () => {
  const {
    state,
    data: { tiles, ablyRealtime },
  } = useApp();

  useAbly();

  const [avatarIDs, setAvatarIDs] = React.useState<string[]>([]);
  const groupRef = React.useRef<THREE.Group>(null!);
  const [, getKeyboardControls] = useKeyboardControls();

  useEffect(() => {
    if (!tiles || !ablyRealtime) return;

    let timer = 0;

    for (let i = 0; i < 9; ++i) {
      const key = Object.keys(tiles)[i];
      const value = tiles[key];

      const channel = ablyRealtime.channels.get(value) as any;

      if (channel.subscriptions.any.length === 0) {
        channel.subscribe((msg) => {
          const { id, playerState } = msg.data;
          const arr = playerState.split(",");

          playerStates[id] = {
            position: new Vector3(arr[0], arr[1], arr[2]),
            rotation: new Euler(arr[3], arr[4], arr[5]),
            animation: arr[6],
            target: arr[7],
            vehicleName: arr[8],
          };

          // Add a new avatar
          if (id !== state.playerID && !currentAvatarIDs.includes(id)) {
            setAvatarIDs((prev) => [...prev, id]);
            currentAvatarIDs.push(id);
          }

          // Detect Idle
          if (idleTimers[i]) clearTimeout(idleTimers[i]);
          idleTimers[i] = window.setTimeout(() => {
            playerStates[id].animation = "Idle";
          }, 500);
        });
      }

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

          const {
            position,
            rotation,
            userData: { target, vehicleName },
          } = state.avatar;

          const vehicle =
            target === TARGETS.VEHICLE ? state.vehicles[vehicleName] : null;

          const convert = (s: Vector3 | Euler) =>
            `${s.x.toFixed(2)},${s.y.toFixed(2)},${s.z.toFixed(2)}`;

          if (dirKeyPressed) {
            await channel.publish("update", {
              id: state.playerID,
              playerState: `${convert(
                vehicle ? vehicle.position : position
              )},${convert(vehicle ? vehicle.rotation : rotation)},${
                state.avatarAnim
              },${target},${vehicleName}`,
            });
          }
        }, 100);
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [state, ablyRealtime, tiles, setAvatarIDs]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((g) => {
      const { position, rotation, animation, target, vehicleName } =
        playerStates[g.name];
      if (target === TARGETS.AVATAR) {
        g.visible = true;
        g.position.lerp(position, 0.1);
        g.rotation.copy(rotation);
        g.userData.animate(animation);
      } else {
        g.visible = false;
        const vehicle = state.vehicles[vehicleName];
        vehicle.position.lerp(position, 0.1);
        vehicle.rotation.copy(rotation);
      }
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
