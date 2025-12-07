export interface BoardProps {
  tiles: Tile[];
  tileImages: string[];
  isWon: boolean;
  onTileClick: (index: number) => void;
}

export interface Tile {
  id: number;
}

export interface TileProps {
  id: number;
  image?: string;
  onClick: () => void;
  canMove: boolean;
}

export const EMPTY_TILE = 15;
