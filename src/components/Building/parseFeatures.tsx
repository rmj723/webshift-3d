import { GeolibInputCoordinates } from "geolib/es/types";

import { BufferGeometry, ExtrudeGeometry, Vector3 } from "three";

import { createBuildings } from "./createBuildings";
import { createRoads } from "./createRoads";

import { createPolyArea } from "./createPolyArea";
import { merge, scale } from "./Building.Utils";
import { gpsToPos } from "../../utils/gpsToPos";
import { createWalls } from "./createWalls";

export const parseFeatures = (features, center: GeolibInputCoordinates) => {
  const buildingPhysicsGeos: BufferGeometry[] = [];
  const buildingGeos: ExtrudeGeometry[][] = [];
  const roadGeos: BufferGeometry[] = [];
  const roadBorderGeos: BufferGeometry[] = [];
  const roadLineGeos: BufferGeometry[] = [];
  const waterGeos: BufferGeometry[] = [];
  const grassGeos: BufferGeometry[] = [];
  const wallGeos: BufferGeometry[] = [];
  const treePositions: Vector3[] = [];

  const featureIDs: number[] = [];

  Array(5)
    .fill(0)
    .forEach((_, idx) => {
      buildingGeos[idx] = [];
    });

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const {
      geometry: { coordinates, type },
      properties,
    } = feature;

    const { tags, id } = properties;

    featureIDs.push(id);

    if (!tags) return;

    // Add buildings
    if (tags.building === "yes" && type === "Polygon") {
      const geo = createBuildings(coordinates, properties, center);
      buildingPhysicsGeos.push(
        createPolyArea(coordinates, properties, center)!
      );
      Array(5)
        .fill(0)
        .forEach((_, index) => {
          id % 5 === index && buildingGeos[index].push(geo);
        });
    }

    // Add Roads
    if (
      type == "LineString" &&
      tags.highway &&
      tags.highway !== "pedestrian" &&
      tags.highway !== "footway" &&
      tags.highway !== "path"
    ) {
      roadGeos.push(createRoads(coordinates, properties, center, 0.07)!);
      roadBorderGeos.push(createRoads(coordinates, properties, center, 0.08)!);
      roadLineGeos.push(createRoads(coordinates, properties, center, 0.001)!);
    }

    // Water
    if (type === "Polygon" && tags["natural"] === "water") {
      waterGeos.push(createPolyArea(coordinates, properties, center));
    }

    // Add Grass
    if (type === "Polygon" && tags["landuse"] == "grass") {
      grassGeos.push(
        createPolyArea(coordinates, properties, center, "#00ff00")
      );
    }

    // Add Trees
    if (type === "Point" && tags["natural"] === "tree") {
      const pos = gpsToPos(coordinates, center);
      treePositions.push(new Vector3(-pos[0] * scale, 0, pos[1] * scale));
    }

    // Add Fence/Wall
    if (type === "LineString" && tags["barrier"]) {
      wallGeos.push(createWalls(coordinates, properties, center)!);
    }
  }

  return {
    buildingPhysicsGeo: merge(buildingPhysicsGeos),
    buildingGeos: buildingGeos.map((geos) => merge(geos, true)),
    roadGeo: merge(roadGeos),
    roadBorderGeo: merge(roadBorderGeos),
    roadLineGeo: merge(roadLineGeos),
    waterGeo: merge(waterGeos),
    grassGeo: merge(grassGeos),
    wallGeo: merge(wallGeos),
    treePositions,
  };
};
