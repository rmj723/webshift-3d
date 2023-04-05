import { create } from "zustand";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { subscribeWithSelector } from "zustand/middleware";
import { Group, Mesh, PerspectiveCamera, Vector3 } from "three";
import { GeolibInputCoordinates } from "geolib/es/types";

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
        originGPS: null! as GeolibInputCoordinates,
        geohashToFeatureId: new Map(),
        featureToGeoHash: new Map(),
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

      portal: null! as Group,
      setPortal: (portal: Group) => {
        set(() => {
          return { portal };
        });
      },
    };
  })
);
