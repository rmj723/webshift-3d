import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export const useMaterials = () => {
  const roadMap = useLoader(TextureLoader, "./textures/concret/base.jpg");
  // @ts-ignore
  const { materials } = useGLTF("./materials/mats-transformed.glb");

  const mat1 = materials["mat1"];
  const mat2 = materials["mat2"];
  const mat3 = materials["mat3"];
  const mat4 = materials["mat4"];
  const mat5 = materials["mat5"];

  mat1.map.repeat.set(3.6, 4.1);
  mat2.map.repeat.set(2.5, 1.5);
  mat3.map.repeat.set(3, 3);
  mat4.map.repeat.set(1, 1.6);
  mat5.map.repeat.set(3, 2.8);
  return {
    materials,
    roadMap,
  };
};
