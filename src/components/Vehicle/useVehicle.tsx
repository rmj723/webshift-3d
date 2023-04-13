import { useState, useEffect, RefObject } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useApp from "../../store/useApp";

let maxSpeed = 0;

export function useVehicle(
  vehicleRef: RefObject<THREE.Group | null>,
  frontWheelRef: RefObject<THREE.Group | null>,
  backWheelRef: RefObject<THREE.Group | null>
) {
  const camera = useThree((state) => state.camera);
  const {
    state,
    data: { target },
  } = useApp();

  const [, getKeyboardControls] = useKeyboardControls();

  const [vehiclePos] = useState(new THREE.Vector3(0, 0, 0));
  const [vehicleRot] = useState(new THREE.Vector3());
  const [velocity] = useState(new THREE.Vector3(0, 0, 0));
  const [acceleration] = useState(new THREE.Vector3(0, 0, 0));

  const [currentCameraPosition] = useState(new THREE.Vector3(15, 15, 0));
  const [currentCameraLookAt] = useState(new THREE.Vector3());

  const [rayOriginWorldPos] = useState(new THREE.Vector3(0, 0, 0));
  const [raycaster] = useState(
    new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0))
  );

  useEffect(() => {
    const { vehicles, orbit, avatar } = state;
    if (!orbit || target !== "vehicle") return;
    const vehicle = vehicles[avatar.userData.vehicleName];
    vehicleRot.setFromEuler(vehicle.rotation);
    vehiclePos.copy(vehicle.position);

    state.cameraPosOffset.subVectors(camera.position, vehicle.position);
    const orbitChangeHandler = () => {
      state.cameraPosOffset.subVectors(camera.position, vehicle.position);
    };
    orbit.addEventListener("change", orbitChangeHandler);
    return () => {
      orbit.removeEventListener("change", orbitChangeHandler);
    };
  }, [camera, state, target]);

  useFrame(({ camera }, delta) => {
    if (
      !vehicleRef.current ||
      !frontWheelRef.current ||
      !backWheelRef.current ||
      target !== "vehicle"
    )
      return;

    const { avatar, vehicles } = state;
    const vehicle = vehicles[avatar.userData.vehicleName];

    if (vehicle !== vehicleRef.current) return;

    acceleration.set(0, 0, 0);

    const { forward, backward, leftward, rightward, run } =
      getKeyboardControls();

    const dirKeyPressed = [forward, backward, leftward, rightward].includes(
      true
    );

    if (dirKeyPressed) {
      frontWheelRef.current.rotation.x -= delta * 10;
      backWheelRef.current.rotation.x -= delta * 10;
    } else {
      if (maxSpeed > 0) maxSpeed -= 0.01;
    }

    // Check colliders
    let intersected = false;
    let i = 0;
    if (state.buildingCollider && state.wallCollider) {
      const balls = vehicle.children.filter((_) =>
        _.name.includes("collision-detector")
      );
      while (i < 4) {
        const s = balls[i];
        s.getWorldPosition(rayOriginWorldPos);
        rayOriginWorldPos.y = 5000;
        raycaster.ray.origin.copy(rayOriginWorldPos);
        const intersects = raycaster.intersectObjects([
          state.buildingCollider,
          state.wallCollider,
        ]);

        if (intersects.length > 0) {
          intersected = true;
          break;
        }
        ++i;
      }
    }

    if (forward) {
      acceleration.z -= maxSpeed * Math.cos(vehicleRot.y);
      acceleration.x -= maxSpeed * Math.sin(vehicleRot.y);
      if (maxSpeed < 1) maxSpeed += 0.002;
    }
    if (backward) {
      acceleration.z += maxSpeed * Math.cos(vehicleRot.y);
      acceleration.x += maxSpeed * Math.sin(vehicleRot.y);
      maxSpeed = 0.2;
    }
    if (leftward) {
      vehicleRot.y += 0.02;
      vehicle.rotation.y = vehicleRot.y;
    }
    if (rightward) {
      vehicleRot.y -= 0.02;
      vehicle.rotation.y = vehicleRot.y;
    }

    // Apply friction to slow down the vehicle
    const friction = velocity.clone().multiplyScalar(-0.05);

    if (!intersected) {
      velocity.add(acceleration).add(friction);
      velocity.clampLength(0, maxSpeed);

      // Update vehicle position and rotation based on velocity
      vehiclePos.add(velocity);
      vehicle.position.copy(vehiclePos);
    } else {
      vehicle.position.x += Math.sin(vehicleRot.y);
      vehicle.position.z += Math.cos(vehicleRot.y);

      vehiclePos.x += Math.sin(vehicleRot.y);
      vehiclePos.z += Math.cos(vehicleRot.y);

      velocity.set(0, 0, 0);
    }

    const idealOffset = new THREE.Vector3(0, 3.5, 10);
    idealOffset.applyQuaternion(vehicle.quaternion);
    idealOffset.add(vehicle.position);

    const idealLookAt = new THREE.Vector3(0, 2, 0);
    idealLookAt.applyQuaternion(vehicle.quaternion);
    idealLookAt.add(vehiclePos);

    if (idealOffset.y < 0) {
      idealOffset.y = 1;
    }

    currentCameraPosition.lerp(idealOffset, 0.08);
    currentCameraLookAt.lerp(idealLookAt, 0.08);

    camera.position.copy(currentCameraPosition);
    camera.lookAt(currentCameraLookAt);

    state.orbit.target.copy(vehiclePos);
  });
}
