import React from "react";
import { Bone, Group, Quaternion, Vector3 } from "three";
import useApp from "../../store/useApp";
import { GroupProps, useFrame } from "@react-three/fiber";

interface Props extends GroupProps {
  name?: string;
}
export const PortalGun: React.FC<Props> = ({ name, ...otherProps }) => {
  const groupRef = React.useRef<Group>(null!);

  const {
    state,
    data: { portalObject },
    updateData,
  } = useApp();
  const boneRef = React.useRef<Bone>(null!);
  const [pos] = React.useState(new Vector3(0, 0, 0));

  const [quat] = React.useState(new Quaternion());

  React.useEffect(() => {
    const { avatar } = state;
    boneRef.current = avatar.getObjectByName("mixamorigRightHand") as Bone;

    if (portalObject === null) {
      const { position, rotation } = otherProps;
      position &&
        groupRef.current.position.set(position[0], position[1], position[2]);
      rotation &&
        groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, [state, portalObject, otherProps]);

  useFrame(() => {
    if (boneRef.current && portalObject === groupRef.current) {
      boneRef.current.getWorldPosition(pos);
      boneRef.current.getWorldQuaternion(quat);
      groupRef.current.position.copy(pos);
      groupRef.current.setRotationFromQuaternion(quat);
    }
  });

  return (
    <group ref={groupRef} {...otherProps}>
      <mesh
        onDoubleClick={() => {
          updateData({ portalObject: groupRef.current });
        }}
      >
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </group>
  );
};
