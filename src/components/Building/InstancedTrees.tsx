import { useGLTF } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import {
  Euler,
  InstancedMesh,
  Matrix4,
  Mesh,
  Quaternion,
  Vector3,
} from "three";

interface Props {
  treePositions: Vector3[];
}

export const InstancedTrees: React.FC<Props> = ({ treePositions }) => {
  const [leavesMesh, setLeavesMesh] = useState<Mesh>(new Mesh());
  const [trunkMesh, setTrunkMesh] = useState<Mesh>(new Mesh());
  const {
    //@ts-ignore
    nodes: { trunk, leaves },
  } = useGLTF("./models/tree-transformed.glb");

  useEffect(() => {
    const leavesGeo = leaves.geometry;
    const leavesMat = leaves.material;

    const trunkGeo = trunk.geometry;
    const trunkMat = trunk.material;
    const count = treePositions.length;
    const _leavesMesh = new InstancedMesh(leavesGeo, leavesMat, count);
    const _trunkMesh = new InstancedMesh(trunkGeo, trunkMat, count);

    const matrix = new Matrix4();

    const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3(1, 1, 1);

    for (let i = 0; i < count; ++i) {
      const pos = treePositions[i];

      rotation.x = Math.random() / 5;
      rotation.y = Math.random() * 2 * Math.PI;
      rotation.z = Math.random() / 5;
      // quaternion.setFromEuler(rotation);

      matrix.compose(pos, quaternion, scale);
      _leavesMesh.setMatrixAt(i, matrix);
      _trunkMesh.setMatrixAt(i, matrix);
    }

    setLeavesMesh(_leavesMesh);
    setTrunkMesh(_trunkMesh);
  }, [treePositions, trunk, leaves]);

  return (
    <>
      <primitive object={leavesMesh} position-y={-0.4} />
      <primitive object={trunkMesh} position-y={-0.4} />
    </>
  );
};
