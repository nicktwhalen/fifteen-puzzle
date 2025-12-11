"use client";

import { Tile } from "./Tile";
import styles from "./Board.module.css";
import { useMemo } from "react";
import { BoardProps, EMPTY_TILE } from "@/lib/types/game";

export function Board({ board, tileImages, onTileClick, isWon }: BoardProps) {
  const emptyIndex = useMemo(
    () => board.findIndex((tile) => tile === EMPTY_TILE),
    [board]
  );

  function canMove(index: number): boolean {
    const diff = Math.abs(index - emptyIndex);
    const sameRow = Math.floor(index / 4) === Math.floor(emptyIndex / 4);
    return diff === 4 || (diff === 1 && sameRow);
  }

  return (
    <div className={styles.board}>
      {board.map((tile, index) => (
        <Tile
          key={tile}
          id={tile}
          image={tile === EMPTY_TILE ? undefined : tileImages[tile - 1]}
          onClick={() => onTileClick(index)}
          canMove={!isWon && canMove(index)}
        />
      ))}
    </div>
  );
}
