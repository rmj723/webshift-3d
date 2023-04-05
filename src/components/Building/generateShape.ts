import { GeolibInputCoordinates } from "geolib/es/types";
import { Shape } from "three";
import { gpsToPos } from "../../utils/gpsToPos";

export function generateShape(
  points: GeolibInputCoordinates[],
  center: GeolibInputCoordinates
) {
  const shape = new Shape();

  points.forEach((point: GeolibInputCoordinates, idx: number) => {
    const pos = gpsToPos(point, center);

    if (idx == 0) {
      shape.moveTo(pos[0], pos[1]);
    } else {
      shape.lineTo(pos[0], pos[1]);
    }
  });

  return shape;
}
