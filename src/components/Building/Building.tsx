import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { extend, useFrame } from "@react-three/fiber";
import { GeolibInputCoordinates } from "geolib/es/types";
import { load } from "../../utils/TileSystem/TileSystem";
import { DoubleSide, Group } from "three";
import useApp from "../../store/useApp";
import { posToGps } from "../../utils/posToGps";
import { WaterMaterial } from "../Materials/WaterMaterial";
import { useMaterials } from "./useMaterials";
import { createGeometry, scale } from "./Building.Utils";
import { InstancedTrees } from "./InstancedTrees";
import { useWorker } from "./Building.hooks";
extend({ WaterMaterial });

let allFeatures: any[] = [];

export function Buildings() {
  const { materials } = useMaterials();
  const groupRef = useRef<Group>(null!);

  const { target, state, loading, setLoading, originGPS } = useApp();

  const { worker } = useWorker();
  const [geos, setGeos] = useState<any>();

  const createBuildings = useCallback(() => {
    worker.convertFeaturesToGeos(allFeatures, originGPS).then((result) => {
      setGeos(result);
      if (loading) setLoading(false);
    });
  }, [originGPS, loading, setLoading]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!state.avatar) return;

      const { avatar, vehicle } = state;
      const pos = target === "avatar" ? avatar.position : vehicle.position;
      const { x, z } = pos;

      const gps = posToGps([x / scale, -z / scale], originGPS);
      load(
        gps,
        6,
        ({ features }, neighborsHashes) => {
          allFeatures = [...allFeatures, ...features];
          createBuildings();
          state.neighborsHashes = neighborsHashes;
        },
        state.geohashToFeatureId,
        state.featureToGeoHash,
        (ids) => {
          worker.removeFeatures(allFeatures, ids).then((filteredFeatures) => {
            allFeatures = filteredFeatures;
          });
        }
      );
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [target, originGPS]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Animate water
    groupRef.current.children.forEach((m: any) => {
      if (m.name === "water") m.material.uniforms.time.value += delta;
      if (m.name === "building") state.buildingCollider = m;
      if (m.name === "wall") state.wallCollider = m;
    });
  });

  return (
    <group ref={groupRef}>
      {geos && (
        <>
          {geos.buildingPhysicsGeo && (
            <mesh
              name="building"
              geometry={createGeometry(geos.buildingPhysicsGeo)}
              position-y={0.1}
            >
              <meshBasicMaterial transparent={true} />
            </mesh>
          )}

          {geos.buildingGeos &&
            geos.buildingGeos.map((geo, idx) => (
              <Fragment key={idx}>
                {geo && (
                  <mesh
                    geometry={createGeometry(geo)}
                    material={materials[`mat${(idx % 5) + 1}`]}
                  />
                )}
              </Fragment>
            ))}

          {geos.roadGeo && (
            <mesh geometry={createGeometry(geos.roadGeo)} position-y={-0.1}>
              <meshStandardMaterial color="#000000" />
            </mesh>
          )}

          {geos.roadBorderGeo && (
            <mesh
              geometry={createGeometry(geos.roadBorderGeo)}
              position-y={-0.12}
            >
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          )}

          {geos.roadLineGeo && (
            <mesh geometry={createGeometry(geos.roadLineGeo)} position-y={0.1}>
              <meshStandardMaterial side={DoubleSide} color="#ffffff" />
            </mesh>
          )}

          {geos.waterGeo && (
            <mesh
              name="water"
              geometry={createGeometry(geos.waterGeo)}
              position-y={-0.1}
            >
              <waterMaterial args={[materials.water.map]} side={DoubleSide} />
            </mesh>
          )}

          {geos.grassGeo && (
            <mesh
              geometry={createGeometry(geos.grassGeo)}
              material={materials.moss}
            ></mesh>
          )}

          {geos.treePositions && (
            <InstancedTrees treePositions={geos.treePositions} />
          )}

          {geos.wallGeo && (
            <mesh
              name="wall"
              geometry={createGeometry(geos.wallGeo)}
              position-y={0.05 * scale}
              material={materials.wall}
            ></mesh>
          )}
        </>
      )}
    </group>
  );
}
