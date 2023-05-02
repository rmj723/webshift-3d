import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import useApp from "../../store/useApp";
import { usePlayer } from "./usePlayer";
import { TARGETS } from "../../utils/types";
import { ChatBubble } from "../ChatBubble/ChatBubble";
import { Players } from "./Players";

export function Player(props: JSX.IntrinsicElements["group"]) {
  const avatarRef = useRef<THREE.Group>(null!);

  const {
    state,
    data: { messages, target, avatarType },
  } = useApp();

  const { nodes, materials, animations }: any = useGLTF(
    Players[avatarType].url
  );

  const { actions } = useAnimations(animations, avatarRef);

  const [animationsMap, setAnimationsMap] = useState<
    Map<string, THREE.AnimationAction>
  >(null!);

  useEffect(() => {
    setAnimationsMap(
      new Map([
        ["Idle", actions.idle!],
        ["Walk", actions.walk!],
        ["Run", actions.run!],
        ["Jump", actions.jump!],
      ])
    );
    actions.idle!.play();

    state.avatar = avatarRef.current;
    state.target = TARGETS.AVATAR;
  }, [actions, state]);

  usePlayer({
    animationsMap,
    avatarRef,
  });

  return (
    <group ref={avatarRef} dispose={null} {...props}>
      {target === TARGETS.AVATAR && (
        <group position-y={2}>
          <Html
            style={{
              width: "100px",
              color: "#00ff00",
              fontSize: "20px",
              textAlign: "center",
            }}
            center
          >
            {state.avatarName}
          </Html>
        </group>
      )}

      <ChatBubble msg={messages[state.avatarID]} />

      <mesh name="collision-detector" position={[0, -1, -0.8]}>
        <sphereGeometry args={[0.05]} />
      </mesh>

      {Players[avatarType].getAvatar(nodes, materials)}
    </group>
  );
}
