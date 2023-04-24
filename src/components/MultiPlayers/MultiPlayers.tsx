import useApp from "../../store/useApp";
import { Player } from "../Player/Player";
import React, { useEffect } from "react";
import * as THREE from "three";
import { Vector3, Euler } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OtherPlayer } from "./OtherPlayer";
import { TARGETS } from "../../utils/types";
import { useAbly } from "./useAbly";
import { posToGps } from "../../utils/posToGps";
import { scale } from "../Building/Building.Utils";
import { gpsToPos } from "../../utils/gpsToPos";

type PlayerStateType = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  animation: string;
  avatarName: string;
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
    data: { tiles, ablyRealtime, originGPS },
  } = useApp();

  useAbly();

  const [avatarIDs, setAvatarIDs] = React.useState<string[]>([]);
  const [targets, setTargets] = React.useState<any[]>([]);

  const groupRef = React.useRef<THREE.Group>(null!);
  const [, getKeyboardControls] = useKeyboardControls();

  useEffect(() => {
    // const tiles = { c: "awef" }; // remove
    if (!tiles || !ablyRealtime) return;

    let timer = 0;

    for (let i = 0; i < 9; ++i) {
      const key = Object.keys(tiles)[i];
      const value = tiles[key];

      const channel = ablyRealtime.channels.get(value) as any;

      if (channel.subscriptions.any.length === 0) {
        channel.subscribe((msg) => {
          const { id, playerState, originGPS } = msg.data;
          const arr = playerState.split(",");

          // Update targets if any changes
          if (
            !playerStates[id] ||
            (playerStates[id] && playerStates[id].target !== arr[8])
          ) {
            setTargets((prev) => {
              let newTargets = { ...prev };
              newTargets[id] = arr[8];
              return newTargets;
            });
          }

          const f = (i: number) => parseFloat(arr[i]);

          // Get gps based on their origins
          const gps = posToGps([f(0) / scale, -f(2) / scale], originGPS);

          // Recalculate position based on my origin
          const newPos = gpsToPos(gps, state.originGPS);

          playerStates[id] = {
            position: new Vector3(-newPos[0] * scale, f(1), newPos[1] * scale),
            rotation: new Euler(f(3), f(4), f(5)),
            animation: arr[6],
            avatarName: arr[7],
            target: arr[8],
            vehicleName: arr[9],
          };

          // Add a new avatar
          if (id !== state.avatarID && !currentAvatarIDs.includes(id)) {
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

          const convert = (s: Vector3 | Euler) => {
            return `${s.x},${s.y},${s.z}`;
          };

          if (dirKeyPressed) {
            await channel.publish("update", {
              id: state.avatarID,
              originGPS: state.originGPS,
              playerState: `${convert(
                vehicle ? vehicle.position : position
              )},${convert(vehicle ? vehicle.rotation : rotation)},${
                state.avatarAnim
              },${state.avatarName},${target},${vehicleName}`,
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
          avatarIDs.map((avatarID, idx) => (
            <OtherPlayer
              key={idx}
              avatarID={avatarID}
              avatarName={playerStates[avatarID].avatarName}
              target={targets[avatarID]}
            />
          ))}
      </group>
    </>
  );
};
