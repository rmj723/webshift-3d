import { GeolibInputCoordinates } from "geolib/es/types";
import { Float32BufferAttribute, Shape, ShapeGeometry } from "three";
import { generateShape } from "./generateShape";

export const createPolyArea = (
  coordinates: GeolibInputCoordinates[][],
  properties: any,
  center: GeolibInputCoordinates,
  color: string = "#ffffff"
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

  const geometry = new ShapeGeometry(shape);

  // Add vertex colors
  const { count, array } = geometry.getAttribute("position");
  const colors: number[] = [];
  // Define the colors here
  const c = hexToRgb(color);
  for (let i = 0; i < count; ++i) {
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

  geometry.computeBoundingBox();

  geometry.rotateX(Math.PI / 2);

  geometry.rotateZ(Math.PI);

  return geometry;
};

function hexToRgb(hex: string) {
  // Remove the "#" character from the beginning of the hex string
  hex = hex.replace("#", "");

  // Convert the hex string to an integer
  const hexInt = parseInt(hex, 16);

  // Extract the red, green, and blue components from the integer
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;

  // Divide the red, green, and blue components by 255 to get values between 0 and 1
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  // Return the result as an array
  return [r, g, b];
}
