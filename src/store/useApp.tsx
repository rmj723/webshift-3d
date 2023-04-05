import { create } from "zustand";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { subscribeWithSelector } from "zustand/middleware";
import { Group, Mesh, Vector3 } from "three";

export default create(
  subscribeWithSelector((set: any) => {
    return {
      state: {
        orbit: null! as OrbitControls,
        panning: false,
        cameraPosOffset: new Vector3(),
        avatar: null! as Group,
        vehicle: null! as Group,
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
