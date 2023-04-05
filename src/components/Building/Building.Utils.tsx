import { BufferAttribute, BufferGeometry } from "three";
// @ts-ignores
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils";

export const scale = 100;

export function getGeometryData(geometry) {
  return geometry
    ? {
        position: {
          array: geometry.getAttribute("position").array,
          itemSize: geometry.getAttribute("position").itemSize,
          count: geometry.getAttribute("position").count,
        },
        normal: {
          array: geometry.getAttribute("normal").array,
          itemSize: geometry.getAttribute("normal").itemSize,
          count: geometry.getAttribute("normal").count,
        },
        uv: {
          array: geometry.getAttribute("uv").array,
          itemSize: geometry.getAttribute("uv").itemSize,
          count: geometry.getAttribute("uv").count,
        },
        index: geometry.index
          ? {
              array: geometry.index.array,
              itemSize: geometry.index.itemSize,
              count: geometry.index.count,
            }
          : null,
        groups: geometry.groups,
      }
    : null;
}

export function createGeometry(geometryData) {
  const geometry = new BufferGeometry();
  const { index } = geometryData;

  for (let attributeName of Object.keys(geometryData)) {
    if (attributeName !== "index" && attributeName !== "groups") {
      const { array, itemSize } = geometryData[attributeName];
      const attribute = new BufferAttribute(array, itemSize, false);
      geometry.setAttribute(attributeName, attribute);
    }
  }

  if (geometryData.index)
    geometry.setIndex(
      new BufferAttribute(new Uint32Array(index.array), index.itemSize)
    );

  if (geometryData.groups) {
    //@ts-ignore
    geometryData.groups.forEach(({ start, count, materialIndex }) =>
      geometry.addGroup(start, count, materialIndex)
    );
  }

  return geometry;
}

export function merge(geos: BufferGeometry[], isBuilding: boolean = false) {
  const mergedGeo =
    geos.length > 0
      ? (BufferGeometryUtils.mergeBufferGeometries(geos) as BufferGeometry)
      : null;
  mergedGeo && mergedGeo.scale(scale, scale, scale);

  // Separate building material
  if (mergedGeo && isBuilding) {
    mergedGeo.computeBoundingBox();
    const { array, count } = mergedGeo.getAttribute("normal");
    const uvArr = mergedGeo.getAttribute("uv").array as Float32Array;
    for (let i = 0; i < count; ++i) {
      const y = array[i * 3 + 1];
      if (y === 1) {
        uvArr[i * 2] *= 0;
        uvArr[i * 2 + 1] = 0;
      }
    }
    mergedGeo.setAttribute("uv", new BufferAttribute(uvArr, 2));
  }

  return mergedGeo;
}
