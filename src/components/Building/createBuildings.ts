import { GeolibInputCoordinates } from "geolib/es/types";
import { ExtrudeGeometry, Shape } from "three";
import { generateShape } from "./generateShape";

export function createBuildings(
  coordinates: GeolibInputCoordinates[][],
  properties: any,
  center: GeolibInputCoordinates
) {
  let shape: Shape = null!;
  const holes: Shape[] = [];

  const height = properties.tags["height"] ? properties.tags["height"] : 1;

  coordinates.forEach((coordinate: GeolibInputCoordinates[], idx: number) => {
    if (idx == 0) {
      shape = generateShape(coordinate, center);
    } else {
      holes.push(generateShape(coordinate, center));
    }
  });

  for (let i = 0; i < holes.length; i++) {
    shape.holes.push(holes[i]);
  }

  const geometry = new ExtrudeGeometry(shape, {
    curveSegments: 1,
    depth: 0.06 * height,
    bevelEnabled: false,
  });
  geometry.normalizeNormals();

  geometry.rotateX(Math.PI / 2);

  geometry.rotateZ(Math.PI);

  return geometry;
}
