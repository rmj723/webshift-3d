import { create } from "zustand";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { subscribeWithSelector } from "zustand/middleware";
import { Group, Mesh, PerspectiveCamera, Vector3 } from "three";
import { GeolibInputCoordinates } from "geolib/es/types";
import { TARGETS, TileType } from "../utils/types";
import * as Ably from "ably";

type DataType = {
  ablyRealtime: Ably.Types.RealtimePromise;
  loading: boolean;
  name: string;
  target: TARGETS;
  originGPS: GeolibInputCoordinates;
  tiles: TileType;
  portalObject: Group | null;
};

export default create(
  subscribeWithSelector((set: any, get: any) => {
    return {
      state: {
        playerID: Math.random().toString(),
        orbit: null! as OrbitControls,
        camera: null! as PerspectiveCamera,
        panning: false,
        cameraPosOffset: new Vector3(),
        avatar: null! as Group,
        avatarAnim: "Idle",
        vehicles: {} as { [key: string]: Group },
        geohashToFeatureId: new Map(),
        featureToGeoHash: new Map(),
        staticColliders: [] as Mesh[],
        buildingCollider: null! as Mesh,
        wallCollider: null! as Mesh,
      },

      data: {
        loading: true,
        target: TARGETS.AVATAR,
        originGPS: [-73.9730278, 40.7636166] as GeolibInputCoordinates,
      } as DataType,
      updateData: (newItem: Partial<DataType>) => {
        set(() => {
          return { data: { ...get().data, ...newItem } };
        });
      },
    };
  })
);
