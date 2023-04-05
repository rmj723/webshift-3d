import React from "react";
import { Bone, Group, Quaternion, Vector3 } from "three";
import useApp from "../../store/useApp";
import { GroupProps, useFrame } from "@react-three/fiber";

interface Props extends GroupProps {
  name?: string;
}
export const PortalGun: React.FC<Props> = ({ name, ...otherProps }) => {
  const groupRef = React.useRef<Group>(null!);

  const { state, portal, setPortal } = useApp();
  const boneRef = React.useRef<Bone>(null!);
  const [pos] = React.useState(new Vector3(0, 0, 0));

  const [quat] = React.useState(new Quaternion());
  React.useEffect(() => {
    const { avatar } = state;
    boneRef.current = avatar.getObjectByName("mixamorigRightHand") as Bone;
  }, [state]);

  useFrame(() => {
    if (boneRef.current && portal === groupRef.current) {
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
          setPortal(groupRef.current);
        }}
      >
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </group>
  );
};
