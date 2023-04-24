import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

export function PortalGunModel(props: GroupProps) {
  const { nodes, materials } = useGLTF(
    "./models/portal_gun-transformed.glb"
  ) as any;
  const { onDoubleClick } = props;

  return (
    <group {...props} dispose={null}>
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0.geometry}
        material={materials.material}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_1.geometry}
        material={materials.material_0}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_2.geometry}
        material={materials.material_2}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_3.geometry}
        material={materials.material_3}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_4.geometry}
        material={materials.material_4}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_5.geometry}
        material={materials.material_5}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_6.geometry}
        material={materials.material_6}
      />
      <mesh
        {...{ onDoubleClick }}
        geometry={nodes.Object_0_7.geometry}
        material={materials.material_7}
      />
    </group>
  );
}

useGLTF.preload("./models/portal_gun-transformed.glb");
