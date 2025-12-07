"use client";

import { EMPTY_TILE, TileProps } from "@/lib/types/game";
import styles from "./Tile.module.css";

export function Tile({ id, image, canMove, onClick }: TileProps) {
  const isEmpty = id === EMPTY_TILE;

  return (
    <div
      className={`${styles.tile} ${canMove ? styles.movable : ""} ${
        isEmpty ? styles.empty : ""
      }`}
      onClick={canMove ? onClick : undefined}
    >
      {!isEmpty && image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={`${id + 1}`} className={styles.tileImage} />
      )}
    </div>
  );
}
