export type TileSpecial = "cup" | null;

export type Tile = {
  id: string;
  ball: string;
  special: TileSpecial;
};