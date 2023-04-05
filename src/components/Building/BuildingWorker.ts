import { parseFeatures } from "./parseFeatures";
import { getGeometryData } from "./Building.Utils";

export const convertFeaturesToGeos = (features, originGPS) => {
  const {
    buildingPhysicsGeo,
    buildingGeos,
    roadGeo,
    roadBorderGeo,
    roadLineGeo,
    waterGeo,
    grassGeo,
    wallGeo,
    treePositions,
  } = parseFeatures(features, originGPS)!;

  return {
    buildingPhysicsGeo: getGeometryData(buildingPhysicsGeo),
    buildingGeos: buildingGeos.map((geos) => getGeometryData(geos)),
    roadGeo: getGeometryData(roadGeo),
    roadBorderGeo: getGeometryData(roadBorderGeo),
    roadLineGeo: getGeometryData(roadLineGeo),
    waterGeo: getGeometryData(waterGeo),
    grassGeo: getGeometryData(grassGeo),
    wallGeo: getGeometryData(wallGeo),
    treePositions,
  };
};

export function removeFeatures(allFeatures, idArrToRemove: number[]) {
  let newFeatures: any[] = [];

  allFeatures.forEach((feature) => {
    const {
      properties: { id },
    } = feature;
    if (!idArrToRemove.includes(id)) newFeatures.push(feature);
  });

  return newFeatures;
}
