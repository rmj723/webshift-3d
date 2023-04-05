import axios from "axios";
import { GeolibInputCoordinates } from "geolib/es/types";
import Geohash from "latlon-geohash";

let current_geo_hashes: any[] = [];

function latLongToGeoHash(
  lat: number,
  long: number,
  precision: number
): string {
  const geohash = Geohash.encode(lat, long, precision);
  return geohash;
}

function getGeoHashNeighbours(geohash: string) {
  const geohashes = Geohash.neighbours(geohash);
  return geohashes;
}
function getBounds(geohash: string) {
  const { ne, sw } = Geohash.bounds(geohash);
  const nw = { lat: sw.lat, lon: ne.lon };
  const se = { lat: ne.lat, lon: sw.lon };

  return { nw, ne, se, sw };
}
async function getGeoJSONFromGeoHash(geohash: string) {
  try {
    const reponse = await axios.get(
      // process.env.REACT_APP_API_BACKEND + "/get_tile/" + geohash
      "https://data-api.webshift.io" + "/get_tile/" + geohash
    );
    return reponse.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getIdsToRemove(
  geohashToFeatureId: Map<string, number[]>,
  featureToGeoHash: Map<string, string[]>,
  currentGeoHashes
) {
  const idsToRemove: any[] = [];
  const geokeys = Array.from(geohashToFeatureId.keys());

  const geoHashesToRemove: any[] = geokeys.filter(
    (key) => !currentGeoHashes.includes(key)
  );

  const keys = Array.from(featureToGeoHash.keys());
  keys.forEach((key) => {
    const geoHashes = featureToGeoHash.get(key);
    geoHashesToRemove.forEach((geoHashToRemove) => {
      const geoHashRemoveIndex = geoHashes!.indexOf(geoHashToRemove);
      if (geoHashRemoveIndex >= 0) {
        featureToGeoHash.get(key)?.splice(geoHashRemoveIndex, 1);
        if (featureToGeoHash.get(key)!.length < 1) {
          idsToRemove.push(key);
          featureToGeoHash.delete(key);
        }
      }
    });
  });
  return idsToRemove;
}

async function load(
  center: GeolibInputCoordinates,
  precision: number,
  addFeatures,
  geohashToFeatureId,
  featureToGeoHash,
  remove
) {
  const long = center[0];
  const lat = center[1];
  const initialGeoHash = latLongToGeoHash(lat, long, precision);
  const neighborsHashes = getGeoHashNeighbours(initialGeoHash);
  neighborsHashes.c = initialGeoHash;
  const newGeoHashes: any[] = [];
  const geoarray: any[] = [];
  if (!current_geo_hashes) {
    current_geo_hashes = neighborsHashes;
  } else {
    const keys = Object.keys(neighborsHashes);
    keys.forEach((key) => {
      if (!current_geo_hashes.includes(neighborsHashes[key])) {
        newGeoHashes.push(neighborsHashes[key]);
        current_geo_hashes.push(neighborsHashes[key]);
      }
      geoarray.push(neighborsHashes[key]);
    });
  }

  newGeoHashes.forEach(async (tempHash) => {
    const tempGeoJSON = await getGeoJSONFromGeoHash(tempHash);
    const featureObject: any = {
      features: [],
      type: "FeatureCollection",
    };
    tempGeoJSON.features.forEach((feature) => {
      const featureId = feature.properties.id;
      const savedFeatureToHashEntry = featureToGeoHash.get(featureId);

      if (savedFeatureToHashEntry) {
        featureToGeoHash.get(featureId).push(tempHash);
      } else {
        featureToGeoHash.set(featureId, [tempHash]);
        featureObject.features.push(feature);
      }

      if (!geohashToFeatureId.get(tempHash)) {
        geohashToFeatureId.set(tempHash, [featureId]);
      } else {
        geohashToFeatureId.get(tempHash).push(featureId);
      }
    });
    addFeatures(featureObject);
  });

  remove(getIdsToRemove(geohashToFeatureId, featureToGeoHash, geoarray));
}

export {
  latLongToGeoHash,
  getGeoJSONFromGeoHash,
  getGeoHashNeighbours,
  load,
  getBounds,
  getIdsToRemove,
};
