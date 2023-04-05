import { GeolibInputCoordinates } from "geolib/es/types";
import { EARTH_RADIUS } from "./gpsToPos";

export function posToGps(
  pos: number[],
  centerPos: GeolibInputCoordinates
): [number, number] {
  const [originLon, originLat] = centerPos as [number, number];
  const x = pos[0] * 100;
  const y = -pos[1] * 100;

  const lon = (x / EARTH_RADIUS / Math.PI) * 180 + originLon;

  const lat =
    ((Math.atan(
      Math.exp(y / EARTH_RADIUS) *
        Math.tan(Math.PI / 4 + (originLat * Math.PI) / 360)
    ) -
      Math.PI / 4) *
      360) /
    Math.PI;

  return [lon, lat];
}
