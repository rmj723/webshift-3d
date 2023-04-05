import React, { useRef, useMemo, useEffect, Suspense } from "react";
import {
  extend,
  useThree,
  useLoader,
  useFrame,
  Object3DNode,
  GroupProps,
} from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}

interface Props extends GroupProps {
  geometry: THREE.BufferGeometry;
}

export function WaterMesh({ geometry, ...otherProps }: Props) {
  const { gl, scene } = useThree();
  const waterRef = useRef<Water>(null!);
  const waterNormals = useLoader(
    THREE.TextureLoader,
    "./textures/waternormals.jpg"
  );
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const sun = useMemo(() => new THREE.Vector3(), []);

  const waterConfig = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
    }),
    [waterNormals]
  );

  useEffect(() => {
    const parameters = {
      elevation: 2,
      azimuth: 180,
    };

    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    waterRef.current.material.uniforms["sunDirection"].value
      .copy(sun)
      .normalize();
  }, [gl, sun, scene]);

  useFrame(() => {
    waterRef.current.material.uniforms.time.value += 1.0 / 100.0;
  });

  return (
    <group {...otherProps}>
      <Suspense fallback={null}>
        <water
          ref={waterRef}
          args={[geometry, waterConfig]}
          rotation-x={-Math.PI / 2}
        ></water>
      </Suspense>
    </group>
  );
}
