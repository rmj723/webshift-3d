import { GeolibInputCoordinates } from "geolib/es/types";
import { ExtrudeGeometry, Mesh, MeshBasicMaterial, Shape } from "three";
import { generateShape } from "./generateShape";

const waterMat = new MeshBasicMaterial({ color: 0x0000ff });

export const createWater = (
  coordinates: GeolibInputCoordinates[][],
  properties: any,
  center: GeolibInputCoordinates
) => {
  let holes: Shape[] = [];
  let shape: Shape = null!;

  coordinates.forEach((coordinate: GeolibInputCoordinates[], idx: number) => {
    if (idx === 0) {
      shape = generateShape(coordinate, center);
    } else {
      holes.push(generateShape(coordinate, center));
    }
  });

  holes.forEach((hole) => {
    shape.holes.push(hole);
  });

  const geometry = new ExtrudeGeometry(shape, {
    curveSegments: 1,
    depth: 0.0001,
    bevelEnabled: false,
  });

  geometry.computeBoundingBox();

  geometry.rotateX(Math.PI / 2);

  geometry.rotateZ(Math.PI);

  const mesh = new Mesh(geometry, waterMat);

  mesh.userData = properties;

  return mesh;
};
