"use client";

import { Tile } from "./Tile";
import styles from "./Board.module.css";
import { useMemo } from "react";
import { BoardProps, EMPTY_TILE } from "@/lib/types/game";

export function Board({ tiles, onTileClick, isWon }: BoardProps) {
  const emptyIndex = useMemo(
    () => tiles.findIndex((t) => t.id === EMPTY_TILE),
    [tiles]
  );

  function canMove(index: number): boolean {
    const diff = Math.abs(index - emptyIndex);
    const sameRow = Math.floor(index / 4) === Math.floor(emptyIndex / 4);
    return diff === 4 || (diff === 1 && sameRow);
  }

  return (
    <div className={styles.board}>
      {tiles.map((tile, index) => (
        <Tile
          key={tile.id}
          id={tile.id}
          onClick={() => onTileClick(index)}
          canMove={!isWon && canMove(index)}
        />
      ))}
    </div>
  );
}
