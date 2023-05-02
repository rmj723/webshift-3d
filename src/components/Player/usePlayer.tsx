import { useRef, useState, useEffect, RefObject } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useApp from "../../store/useApp";

const runVelocity = 6;
const walkVelocity = 3;

type CharacterControllerProps = {
  animationsMap: Map<string, THREE.AnimationAction>;
  avatarRef: RefObject<THREE.Group | null>;
};

export function usePlayer({
  animationsMap,
  avatarRef,
}: CharacterControllerProps) {
  const camera = useThree((state) => state.camera);

  const {
    data: { target },
    state,
  } = useApp();

  const [, getKeyboardControls] = useKeyboardControls();

  const action = useRef("Idle");
  const [rotateQuaternion] = useState(new THREE.Quaternion());
  const [rotateAngle] = useState(new THREE.Vector3(0, 1, 0));
  const [walkDirection] = useState(new THREE.Vector3());

  const [rayOriginWorldPos] = useState(new THREE.Vector3(0, 0, 0));
  const [raycaster] = useState(
    new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0))
  );

  useEffect(() => {
    const { avatar, orbit } = state;
    if (!orbit || !avatar || target !== "avatar") return;

    state.cameraPosOffset.subVectors(camera.position, avatar.position);
    orbit.target.copy(avatar.position);

    const orbitChangeHandler = () => {
      state.cameraPosOffset.subVectors(camera.position, avatar.position);
    };
    orbit.addEventListener("change", orbitChangeHandler);
    return () => {
      orbit.removeEventListener("change", orbitChangeHandler);
    };
  }, [camera, state, target]);

  useFrame(({ camera }, delta) => {
    if (!avatarRef.current || target !== "avatar") return;

    const avatar = avatarRef.current;

    const { forward, backward, leftward, rightward, run } =
      getKeyboardControls();

    let directionOffset: number = 0;
    const dirKeyPressed = [forward, backward, leftward, rightward].includes(
      true
    );

    let actionToPlay =
      dirKeyPressed && run ? "Run" : dirKeyPressed ? "Walk" : "Idle";

    // change animation of avatar
    if (action.current !== actionToPlay) {
      const animToPlay = animationsMap.get(actionToPlay);
      const currentAnim = animationsMap.get(action.current)!;
      const fadeDuration = 0.2;
      currentAnim.fadeOut(fadeDuration);
      animToPlay!.reset().fadeIn(fadeDuration).play();
      action.current = state.avatarAnim = actionToPlay;
    }

    if (action.current === "Run" || action.current === "Walk") {
      state.panning = false;

      const angleYCameraDirection = Math.atan2(
        camera.position.x - avatar.position.x,
        camera.position.z - avatar.position.z
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
      avatar.quaternion.rotateTowards(rotateQuaternion, 0.2);

      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, directionOffset);

      const velocity = state.avatarAnim === "Run" ? runVelocity : walkVelocity;

      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      avatar.position.x += moveX;
      avatar.position.z += moveZ;

      if (state.buildingCollider && state.wallCollider) {
        const s = avatar.children[0];
        s.getWorldPosition(rayOriginWorldPos);
        rayOriginWorldPos.y = 5000;
        raycaster.ray.origin.copy(rayOriginWorldPos);
        const intersects = raycaster.intersectObjects([
          state.buildingCollider,
          state.wallCollider,
          ...state.staticColliders,
        ]);

        if (intersects.length > 0) {
          avatar.position.x -= moveX;
          avatar.position.z -= moveZ;
        }
      }

      if (!state.panning) {
        state.orbit.target.set(
          avatar.position.x,
          avatar.position.y + 1,
          avatar.position.z
        );
      }

      camera.position.x = avatar.position.x + state.cameraPosOffset.x;
      camera.position.y = avatar.position.y + state.cameraPosOffset.y;
      camera.position.z = avatar.position.z + state.cameraPosOffset.z;
    }
  });
}
