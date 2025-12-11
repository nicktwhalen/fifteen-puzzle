export type Board = number[];

export const EMPTY_TILE = 0;

export const MAX_DIFFICULTY = 15;

export interface BoardProps {
  board: Board;
  tileImages: string[];
  isWon: boolean;
  onTileClick: (index: number) => void;
}

export interface TileProps {
  id: number;
  image?: string;
  onClick: () => void;
  canMove: boolean;
}
