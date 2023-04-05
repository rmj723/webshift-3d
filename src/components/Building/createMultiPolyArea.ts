import { GeolibInputCoordinates } from "geolib/es/types";
import {
  BufferGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Shape,
} from "three";
import { generateShape } from "./generateShape";
//@ts-ignore
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils";

const woodMat = new MeshBasicMaterial({ color: 0x00ff66 });

export const createMultiPolyArea = (
  coordinates: GeolibInputCoordinates[][][],
  properties: any,
  center: GeolibInputCoordinates
) => {
  const group = new Group();
  const geos: BufferGeometry[] = [];

  coordinates.forEach((coordinate: GeolibInputCoordinates[][]) => {
    let holes: Shape[] = [];
    let shape: Shape = null!;

    coordinate.forEach((points: GeolibInputCoordinates[], idx: number) => {
      if (idx === 0) {
        shape = generateShape(points, center);
      } else {
        holes.push(generateShape(points, center));
      }
    });

    holes.forEach((hole) => {
      shape.holes.push(hole);
    });

    const geo = new ExtrudeGeometry(shape, {
      curveSegments: 1,
      depth: 0.0001,
      bevelEnabled: false,
    });
    geo.computeBoundingBox();
    geo.rotateX(Math.PI / 2);
    geo.rotateZ(Math.PI);

    geos.push(geo);
  });

  const mergedGeo = BufferGeometryUtils.mergeBufferGeometries(
    geos
  ) as THREE.BufferGeometry;
  const mesh = new Mesh(mergedGeo, woodMat);

  mesh.userData = properties;

  return mesh;
};
