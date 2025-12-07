export interface BoardProps {
  tiles: Tile[];
  isWon: boolean;
  onTileClick: (index: number) => void;
}

export interface Tile {
  id: number;
}

export interface TileProps {
  id: number;
  onClick: () => void;
  canMove: boolean;
}

export const EMPTY_TILE = 15;
