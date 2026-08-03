export type TileSpecial =
  | "rocket-horizontal"
  | "rocket-vertical"
  | "area-bomb"
  | "bomb"
  | null;

export type TileObstacle = {
  type: "ice";
  health: number;
};

export type Tile = {
  id: string;
  ball: string;
  special: TileSpecial;
  obstacle: TileObstacle | null;
};