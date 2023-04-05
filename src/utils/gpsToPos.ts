import { GeolibInputCoordinates } from "geolib/es/types";

export const EARTH_RADIUS = 6378137; // in meters

export function gpsToPos(
  objPos: GeolibInputCoordinates,
  centerPos: GeolibInputCoordinates
) {
  const [originLon, originLat] = centerPos as [number, number];
  const [lon, lat] = objPos as [number, number];

  const x =
    EARTH_RADIUS * ((lon * Math.PI) / 180 - (originLon * Math.PI) / 180);

  const y =
    EARTH_RADIUS *
    Math.log(
      Math.tan(Math.PI / 4 + (lat * Math.PI) / 360) /
        Math.tan(Math.PI / 4 + (originLat * Math.PI) / 360)
    );

  return [-x / 100, y / 100];
}
