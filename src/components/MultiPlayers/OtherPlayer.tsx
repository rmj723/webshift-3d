import React, { useEffect, useRef } from "react";
import { GroupProps, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import useApp from "../../store/useApp";
import { ChatBubble } from "../ChatBubble/ChatBubble";
import { Html } from "@react-three/drei";
import { TARGETS } from "../../utils/types";
import { Players } from "../Player/Players";

interface Props extends GroupProps {
  avatarID: string;
  avatarName: string;
  avatarType: string;
  target: string;
}

export const OtherPlayer: React.FC<Props> = ({
  avatarID,
  avatarName,
  avatarType,
  target,
  ...rest
}) => {
  const gltf = useLoader(GLTFLoader, Players[avatarType].url, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    loader.setDRACOLoader(dracoLoader);
  });
  const {
    state,
    data: { messages },
  } = useApp();
  const group = useRef<THREE.Group>(null!);
  const mixer = useRef<THREE.AnimationMixer>(null!);
  const action = useRef<THREE.AnimationAction>(null!);

  useEffect(() => {
    const { scene, animations } = gltf as any;
    const g = group.current;
    //@ts-ignore
    const model = SkeletonUtils.clone(scene);
    model.rotation.y = Math.PI;

    mixer.current = new THREE.AnimationMixer(model);

    action.current = mixer.current.clipAction(animations[3]);
    action.current.loop = THREE.LoopRepeat;
    action.current.play();
    g.add(model);
    const getAnimation = (animName: string) => {
      const anims = animations.filter((e) => e.name === animName);
      return anims[0];
    };
    const animationsMap = new Map([
      ["Idle", mixer.current.clipAction(getAnimation("idle"))],
      ["Walk", mixer.current.clipAction(getAnimation("walk"))],
      ["Run", mixer.current.clipAction(getAnimation("run"))],
    ]);

    // change animation of avatar
    let currentAction = "Idle";
    g.userData.animate = (actionToPlay: string) => {
      if (currentAction !== actionToPlay) {
        const animToPlay = animationsMap.get(actionToPlay);
        const currentAnim = animationsMap.get(currentAction)!;
        const fadeDuration = 0.2;
        currentAnim.fadeOut(fadeDuration);
        animToPlay!.reset().fadeIn(fadeDuration).play();
        currentAction = state.avatarAnim = actionToPlay;
      }
    };

    return () => {
      g.remove(model);
    };
  }, [gltf, state]);

  useFrame((_, delta) => {
    if (!mixer.current || !action.current) return;
    mixer.current.update(delta);
  });

  return (
    <group name={avatarID} ref={group} {...rest}>
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
          {avatarName}
        </Html>
      )}

      {<ChatBubble msg={messages[avatarID]} />}
    </group>
  );
};
