import React from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps, useFrame } from "@react-three/fiber";

export const Airplane: React.FC<GroupProps> = (props) => {
  const gltf = useGLTF("./models/plane-transformed.glb");
  const [obj, setObj] = React.useState<THREE.Group>(new THREE.Group());
  const mixerRef = React.useRef<THREE.AnimationMixer>();

  React.useEffect(() => {
    const { scene, animations } = gltf;
    const object = scene.clone();
    object.scale.multiplyScalar(7);
    const mixer = new THREE.AnimationMixer(object);
    mixerRef.current = mixer;
    const action = mixer.clipAction(animations[0]);
    action.play();
    setObj(object);
  }, [gltf, mixerRef]);

  useFrame((_, delta) => {
    if (!mixerRef.current) return;

    mixerRef.current.update(delta);
  });
  return (
    <group {...props}>
      <primitive object={obj} position-y={400} />
    </group>
  );
};

useGLTF.preload("./models/plane-transformed.glb");
