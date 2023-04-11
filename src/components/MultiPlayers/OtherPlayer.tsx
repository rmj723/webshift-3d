import React, { useEffect, useRef } from "react";
import { GroupProps, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import useApp from "../../store/useApp";

interface Props extends GroupProps {
  name: string;
}

export const OtherPlayer: React.FC<Props> = ({ name, ...rest }) => {
  const gltf = useLoader(
    GLTFLoader,
    "./models/ybot-transformed.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/gltf/");
      loader.setDRACOLoader(dracoLoader);
    }
  );
  const { state } = useApp();
  const group = useRef<THREE.Group>(null!);
  const mixer = useRef<THREE.AnimationMixer>(null!);
  const action = useRef<THREE.AnimationAction>(null!);

  useEffect(() => {
    const { scene, animations } = gltf;
    const g = group.current;
    //@ts-ignore
    const model = SkeletonUtils.clone(scene);
    model.rotation.y = Math.PI;

    mixer.current = new THREE.AnimationMixer(model);

    action.current = mixer.current.clipAction(animations[3]);
    action.current.loop = THREE.LoopRepeat;
    action.current.play();
    g.add(model);

    const animationsMap = new Map([
      ["Idle", mixer.current.clipAction(animations[0])],
      ["Walk", mixer.current.clipAction(animations[3])],
      ["Run", mixer.current.clipAction(animations[2])],
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

  return <group name={name} ref={group} {...rest} />;
};
