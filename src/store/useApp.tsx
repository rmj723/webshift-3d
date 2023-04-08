import { create } from "zustand";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { subscribeWithSelector } from "zustand/middleware";
import { Group, Mesh, PerspectiveCamera, Vector3 } from "three";
import { GeolibInputCoordinates } from "geolib/es/types";
import { NeighborHashesType, PlayerType } from "../utils/types";

export default create(
  subscribeWithSelector((set: any) => {
    return {
      state: {
        orbit: null! as OrbitControls,
        camera: null! as PerspectiveCamera,
        panning: false,
        cameraPosOffset: new Vector3(),
        avatar: null! as Group,
        vehicle: null! as Group,
        geohashToFeatureId: new Map(),
        featureToGeoHash: new Map(),
        neighborsHashes: {} as NeighborHashesType,
        staticColliders: [] as Mesh[],
        buildingCollider: null! as Mesh,
        wallCollider: null! as Mesh,
      },

      target: "avatar",
      setTarget: (target: string) => {
        set(() => {
          return { target };
        });
      },

      loading: true,
      setLoading: (loading: boolean) => {
        set(() => {
          return { loading };
        });
      },

      originGPS: [-73.9730278, 40.7636166] as GeolibInputCoordinates,
      setOriginGPS: (originGPS: GeolibInputCoordinates) => {
        set(() => {
          return { originGPS };
        });
      },

      portal: null! as Group,
      setPortal: (portal: Group | null) => {
        set(() => {
          return { portal };
        });
      },
    };
  })
);
