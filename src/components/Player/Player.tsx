import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import useApp from "../../store/useApp";
import { usePlayer } from "./usePlayer";
import { TARGETS } from "../../utils/types";
import { ChatBubble } from "../ChatBubble/ChatBubble";

export function Player(props: JSX.IntrinsicElements["group"]) {
  const avatarRef = useRef<THREE.Group>(null!);

  const {
    state,
    data: { messages, target },
  } = useApp();
  const { nodes, materials, animations }: any = useGLTF(
    "./models/ybot-transformed.glb"
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
    state.avatar.userData.target = TARGETS.AVATAR;
  }, [actions, state]);

  usePlayer({
    animationsMap,
    avatarRef,
  });

  return (
    <group ref={avatarRef} dispose={null} {...props}>
      {target === TARGETS.AVATAR && (
        <Html
          style={{
            width: "100px",
            color: "#00ff00",
            fontSize: "20px",
            textAlign: "center",
          }}
          position-y={2}
          center
        >
          {state.avatarName}
        </Html>
      )}

      <ChatBubble msg={messages[state.avatarID]} />

      <mesh name="collision-detector" position={[0, -1, -0.8]}>
        <sphereGeometry args={[0.05]} />
      </mesh>
      <group name="Scene" rotation-y={Math.PI}>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Alpha_Joints"
            geometry={nodes.Alpha_Joints.geometry}
            material={materials.Alpha_Joints_MAT}
            skeleton={nodes.Alpha_Joints.skeleton}
          />
          <skinnedMesh
            name="Alpha_Surface"
            geometry={nodes.Alpha_Surface.geometry}
            material={materials.Alpha_Body_MAT}
            skeleton={nodes.Alpha_Surface.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./models/ybot-transformed.glb");
