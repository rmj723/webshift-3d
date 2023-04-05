import { useRef, useState, useEffect, RefObject } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useApp from "../../store/useApp";

export function useVehicle(
  vehicleRef: RefObject<THREE.Group | null>,
  frontWheelRef: RefObject<THREE.Group | null>,
  backWheelRef: RefObject<THREE.Group | null>
) {
  const camera = useThree((state) => state.camera);
  const carVelocity = window.location.href.includes("localhost") ? 100 : 20;
  const { state, target } = useApp();

  const [, getKeyboardControls] = useKeyboardControls();

  const action = useRef("Stop");
  const [rotateQuaternion] = useState(new THREE.Quaternion());
  const [rotateAngle] = useState(new THREE.Vector3(0, 1, 0));
  const [runDirection] = useState(new THREE.Vector3());

  const [rayOriginWorldPos] = useState(new THREE.Vector3(0, 0, 0));
  const [raycaster] = useState(
    new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0))
  );

  useEffect(() => {
    const { vehicle, orbit } = state;
    if (!orbit || !vehicle || target !== "vehicle") return;

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

    const vehicle = vehicleRef.current;

    const { forward, backward, leftward, rightward, run } =
      getKeyboardControls();

    let directionOffset: number = 0;
    const dirKeyPressed = [forward, backward, leftward, rightward].includes(
      true
    );

    action.current = dirKeyPressed ? "Run" : "Stop";

    if (action.current === "Run") {
      state.panning = false;

      frontWheelRef.current.rotation.x -= delta * 10;
      backWheelRef.current.rotation.x -= delta * 10;

      const angleYCameraDirection = Math.atan2(
        camera.position.x - vehicle.position.x,
        camera.position.z - vehicle.position.z
      );

      if (forward) {
        if (leftward) {
          directionOffset = Math.PI / 4;
        } else if (rightward) {
          directionOffset = -Math.PI / 4;
        }
      } else if (backward) {
        if (leftward) {
          directionOffset = Math.PI / 4 + Math.PI / 2;
        } else if (rightward) {
          directionOffset = -Math.PI / 4 - Math.PI / 2;
        } else {
          directionOffset = Math.PI;
        }
      } else if (leftward) {
        directionOffset = Math.PI / 2;
      } else if (rightward) {
        directionOffset = -Math.PI / 2;
      }

      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + directionOffset
      );

      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + directionOffset
      );

      // rotate avatar with direction key pressed
      vehicle.quaternion.rotateTowards(rotateQuaternion, 0.2);

      camera.getWorldDirection(runDirection);
      runDirection.y = 0;
      runDirection.normalize();
      runDirection.applyAxisAngle(rotateAngle, directionOffset);

      const moveX = runDirection.x * carVelocity * delta;
      const moveZ = runDirection.z * carVelocity * delta;
      vehicle.position.x += moveX;
      vehicle.position.z += moveZ;

      if (state.buildingCollider && state.wallCollider) {
        const s = vehicle.children[0];
        s.getWorldPosition(rayOriginWorldPos);
        rayOriginWorldPos.y = 5000;
        raycaster.ray.origin.copy(rayOriginWorldPos);
        const intersects = raycaster.intersectObjects([
          state.buildingCollider,
          state.wallCollider,
        ]);

        if (intersects.length > 0) {
          vehicle.position.x -= moveX;
          vehicle.position.z -= moveZ;
        }
      }

      if (!state.panning) {
        state.orbit.target.set(
          vehicle.position.x,
          vehicle.position.y,
          vehicle.position.z
        );
      }

      camera.position.x = vehicle.position.x + state.cameraPosOffset.x;
      camera.position.y = vehicle.position.y + state.cameraPosOffset.y;
      camera.position.z = vehicle.position.z + state.cameraPosOffset.z;
    }
  });
}
