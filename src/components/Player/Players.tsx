import { useGLTF } from "@react-three/drei";
import React from "react";

export const Players = {
  ybot: {
    url: "./models/ybot-transformed.glb",
    getAvatar: (nodes: any, materials: any) => (
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
    ),
  },

  aj: {
    url: "./models/aj-transformed.glb",
    getAvatar: (nodes: any, materials: any) => (
      <group name="Scene" rotation-y={Math.PI}>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Boy01_Body_Geo"
            geometry={nodes.Boy01_Body_Geo.geometry}
            material={materials.Boy01_Body_MAT1}
            skeleton={nodes.Boy01_Body_Geo.skeleton}
          />
          <skinnedMesh
            name="Boy01_Brows_Geo"
            geometry={nodes.Boy01_Brows_Geo.geometry}
            material={materials.Boy01_Brows_MAT2}
            skeleton={nodes.Boy01_Brows_Geo.skeleton}
          />
          <skinnedMesh
            name="Boy01_Eyes_Geo"
            geometry={nodes.Boy01_Eyes_Geo.geometry}
            material={materials.Boy01_Brows_MAT2}
            skeleton={nodes.Boy01_Eyes_Geo.skeleton}
          />
          <skinnedMesh
            name="h_Geo"
            geometry={nodes.h_Geo.geometry}
            material={materials.Boy01_Brows_MAT2}
            skeleton={nodes.h_Geo.skeleton}
          />
        </group>
      </group>
    ),
  },

  amy: {
    url: "./models/amy-transformed.glb",
    getAvatar: (nodes: any, materials: any) => (
      <group name="Scene" rotation-y={Math.PI} scale={1.25}>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Ch46"
            geometry={nodes.Ch46.geometry}
            material={materials.Ch46_body}
            skeleton={nodes.Ch46.skeleton}
          />
        </group>
      </group>
    ),
  },
};

useGLTF.preload("./models/ybot-transformed.glb");
useGLTF.preload("./models/aj-transformed.glb");
useGLTF.preload("./models/amy-transformed.glb");
