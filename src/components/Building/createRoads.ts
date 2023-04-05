import { GeolibInputCoordinates } from "geolib/es/types";
import * as THREE from "three";
import { gpsToPos } from "../../utils/gpsToPos";

export function createRoads(
  d: GeolibInputCoordinates[],
  properties: any,
  center: GeolibInputCoordinates,
  width = 0.05
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

  const geo = createRoadGeo(points, width);

  return geo;
}

export function createRoadGeo(pts: THREE.Vector3[], width: number) {
  var ls = 50; //200; // length segments
  var ws = 4; // width segments, tracks

  var lss = ls + 1;
  var wss = ws + 1;
  var faceCount = ls * ws * 2;
  var vertexCount = lss * wss;

  const geometry = new THREE.BufferGeometry();

  const indexArr = new Uint32Array(faceCount * 3);
  const posArr = new Float32Array(vertexCount * 3);
  const uvArr = new Float32Array(vertexCount * 2);

  var curve = new THREE.CatmullRomCurve3(pts);
  const points = curve.getPoints(ls);

  let indexCount = 0;

  for (var j = 0; j < ls; j++) {
    for (var i = 0; i < ws; i++) {
      // 2 faces / segment,  3 vertex indices
      const a = wss * j + i;
      const b1 = wss * (j + 1) + i; // right-bottom
      const c1 = wss * (j + 1) + 1 + i;
      const b2 = wss * (j + 1) + 1 + i; // left-top
      const c2 = wss * j + 1 + i;

      indexArr[indexCount] = a; // right-bottom
      indexArr[indexCount + 1] = b1;
      indexArr[indexCount + 2] = c1;

      indexArr[indexCount + 3] = a; // left-top
      indexArr[indexCount + 4] = b2;
      indexArr[indexCount + 5] = c2;

      // write groups for multi material
      geometry.addGroup(indexCount, 6, i);

      indexCount += 6;
    }
  }

  const normal = new THREE.Vector3(0, 0, 0);
  const binormal = new THREE.Vector3(0, 1, 0);

  var vIdx = 0; // vertex index
  var posIdx = 0; // position  index

  // var d = [-0.52, -0.5, 0.5, 0.52];

  // var d = [-0.6, -0.58, -0.01, 0.01, 0.58, 0.6];
  const d = [
    -width / 2,
    -width / 2 + width / 60,
    -width / 120,
    width / 120,
    width / 2 - width / 60,
    width / 2,
  ];

  for (var j = 0; j < lss; j++) {
    // length

    for (var i = 0; i < wss; i++) {
      // width

      // calculate here the coordinates according to your wishes

      const tangent = curve.getTangent(j / ls); //  .. / length segments

      normal.crossVectors(tangent, binormal);

      binormal.crossVectors(normal, tangent); // new binormal

      normal.normalize(); //.multiplyScalar(0.25);

      const x = points[j].x + d[i] * normal.x;
      const y = points[j].y;
      const z = points[j].z + d[i] * normal.z;

      posIdx = vIdx * 3;
      posArr[posIdx] = x;
      posArr[posIdx + 1] = y;
      posArr[posIdx + 2] = z;
      vIdx++;
    }
  }

  var uvIdxCount = 0;

  var len = curve.getLength();
  var lenList = curve.getLengths(ls);

  for (var j = 0; j < lss; j++) {
    for (var i = 0; i < wss; i++) {
      uvArr[uvIdxCount] = lenList[j] / len;
      uvArr[uvIdxCount + 1] = i / ws + 0.125;
      uvIdxCount += 2;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
  geometry.setIndex(new THREE.BufferAttribute(indexArr, 1));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));

  geometry.computeVertexNormals();

  geometry.rotateZ(Math.PI);

  return geometry;
}
