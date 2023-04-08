export interface PlayerType {
  id: string;
  lat: number;
  long: number;
}

export type TileType = {
  [key in "c" | "e" | "n" | "ne" | "nw" | "s" | "se" | "sw" | "w"]: string;
};
