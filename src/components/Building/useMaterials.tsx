import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export const useMaterials = () => {
  const roadMap = useLoader(TextureLoader, "./textures/concret/base.jpg");
  // @ts-ignore
  const { materials } = useGLTF("./materials/mats-transformed.glb");
  return {
    materials,
    roadMap,
  };
};
