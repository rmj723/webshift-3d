import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useVehicle } from "./useVehicle";
import { Group, Mesh } from "three";
import useApp from "../../store/useApp";

interface Props extends GroupProps {
  vehicleName: string;
}
export function Vehicle({ vehicleName, ...otherProps }: Props) {
  const { target, setTarget, state } = useApp();
  // @ts-ignore
  const { nodes, materials } = useGLTF("./models/car.glb");
  const vehicleRef = useRef<Group>(null!);
  const frontWheelRef = useRef<Group>(null!);
  const backWheelRef = useRef<Group>(null!);

  const colliderRef = useRef<Mesh>(null!);

  useEffect(() => {
    state.vehicle = vehicleRef.current;
    state.staticColliders.push(colliderRef.current);
  }, [state]);

  const onDoubleClick = (e) => {
    e.stopPropagation();
    const { avatar } = state;

    if (target === "avatar") {
      /// get on a car
      avatar.visible = false;
      setTarget("vehicle");
      state.panning = false;
    } else {
      // get off a car
      const pos = state.vehicle.position;
      avatar.position.x = pos.x + 2;
      avatar.position.z = pos.z + 2;

      avatar.visible = true;
      setTarget("avatar");
      state.panning = false;
    }
  };

  useVehicle(vehicleRef, frontWheelRef, backWheelRef);

  return (
    <group ref={vehicleRef} {...otherProps} dispose={null}>
      <mesh name="collision-detector-1" position={[0, -1, -3]}>
        <sphereGeometry args={[0.1]} />
      </mesh>
      <mesh name="collision-detector-2" position={[0, -1, 3]}>
        <sphereGeometry args={[0.1]} />
      </mesh>
      <mesh name="collision-detector-3" position={[1.2, -1, 0]}>
        <sphereGeometry args={[0.1]} />
      </mesh>
      <mesh name="collision-detector-4" position={[-1.2, -1, 0]}>
        <sphereGeometry args={[0.1]} />
      </mesh>

      <mesh ref={colliderRef} position-y={1} visible={false}>
        <boxGeometry args={[2.2, 2, 4.8]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0.geometry}
        material={materials.black_matt}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_1.geometry}
        material={materials.interior}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_2.geometry}
        material={materials.black}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_3.geometry}
        material={materials.black_shiny}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_4.geometry}
        material={materials.chrome}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_5.geometry}
        material={materials.body}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_6.geometry}
        material={materials.silver}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_7.geometry}
        material={materials.orange}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_8.geometry}
        material={materials.plate}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_9.geometry}
        material={materials.d_glass}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_10.geometry}
        material={materials.black}
        {...{ onDoubleClick }}
      />
      <mesh
        geometry={nodes.desirefxme_131_black_matt_0_11.geometry}
        material={materials.r_glass}
        {...{ onDoubleClick }}
      />

      <group ref={frontWheelRef} position={[-0.00513, 0.333601, -1.48706]}>
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0.geometry}
          material={materials.black_shiny}
        />
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0_1.geometry}
          material={materials.tire_mat1}
        />
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0_2.geometry}
          material={materials.silver}
        />
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0_3.geometry}
          material={materials.brakes1}
        />
      </group>

      <group ref={backWheelRef} position={[0.00258, 0.333596, 1.48227]}>
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0004.geometry}
          material={materials.black_shiny}
        />
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0004_1.geometry}
          material={materials.tire_mat1}
        />
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0004_2.geometry}
          material={materials.silver}
        />
        <mesh
          geometry={nodes.desirefxme_165_black_shiny_0004_3.geometry}
          material={materials.brakes1}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/car-transformed.glb");
