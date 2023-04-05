import { GeolibInputCoordinates } from "geolib/es/types";
import * as THREE from "three";
import { CatmullRomCurve3, ExtrudeGeometry, Shape } from "three";
import { gpsToPos } from "../../utils/gpsToPos";

export function createWalls(
  d: GeolibInputCoordinates[],
  properties: any,
  center: GeolibInputCoordinates,
  width = 0.01
) {
  // Init points array
  let points: THREE.Vector3[] = [];

  // Loop for all nodes
  for (let i = 0; i < d.length; i++) {
    if (!d[0][1]) return;

    let el = d[i];

    if (!el[0] || !el[1]) return;

    let elp = [el[0], el[1]];

    //convert position from the center position
    elp = gpsToPos([elp[0], elp[1]], center);

    // Draw Line
    points.push(new THREE.Vector3(elp[0], 0, elp[1]));
  }

  const geo = createWallGeo(points, width);

  return geo;
}

function createWallGeo(points: THREE.Vector3[], width: number) {
  const shape = new Shape();
  const thickness = 0.1;
  shape.moveTo(-thickness / 2, -width / 2);
  shape.lineTo(-thickness / 2, width / 2);
  shape.lineTo(thickness / 2, width / 2);
  shape.lineTo(thickness / 2, -width / 2);

  const pathCurve = new CatmullRomCurve3(points, false);
  const extrudedGeo = new ExtrudeGeometry(shape, {
    steps: 10,
    curveSegments: 1,
    extrudePath: pathCurve,
    bevelEnabled: false,
  });
  extrudedGeo.rotateZ(Math.PI);

  return extrudedGeo;
}
