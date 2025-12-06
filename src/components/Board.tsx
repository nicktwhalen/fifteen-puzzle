"use client";

import { Tile } from "./Tile";
import styles from "./Board.module.css";
import { useMemo, useState } from "react";
import { EMPTY_TILE } from "@/lib/types/game";
import ConfettiExplosion from "react-confetti-explosion";

export function Board() {
  const [tiles, setTiles] = useState(() => {
    const initialTiles = Array.from({ length: 16 }, (_, i) => ({
      id: i,
    }));
    // TODO: remove next line and call shuffleTiles() after testing
    [initialTiles[14], initialTiles[15]] = [
      initialTiles[15]!,
      initialTiles[14]!,
    ];
    return initialTiles;
  });

  const isWon = useMemo(
    () => tiles.every((tile, index) => tile.id === index),
    [tiles]
  );

  const emptyIndex = useMemo(
    () => tiles.findIndex((t) => t.id === EMPTY_TILE),
    [tiles]
  );

  function canMove(index: number): boolean {
    const diff = Math.abs(index - emptyIndex);
    const sameRow = Math.floor(index / 4) === Math.floor(emptyIndex / 4);

    return diff === 4 || (diff === 1 && sameRow);
  }

  function handleTileClick(index: number) {
    if (isWon) return;

    if (!canMove(index)) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [
      newTiles[emptyIndex]!,
      newTiles[index]!,
    ];

    setTiles(newTiles);
  }

  function shuffleTiles() {
    setTiles((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
      }
      return shuffled;
    });
  }

  return (
    <>
      {isWon && (
        <div className={styles.confettiWrapper}>
          <ConfettiExplosion
            colors={["#000000", "#FFFFFF"]}
            duration={10000}
            particleCount={150}
            force={0.4}
          />
        </div>
      )}
      <button className={styles.shuffleButton} onClick={shuffleTiles}>
        Shuffle
      </button>
      <div className={styles.board}>
        {tiles.map((tile, index) => (
          <Tile
            key={tile.id}
            id={tile.id}
            onClick={() => handleTileClick(index)}
            canMove={!isWon && canMove(index)}
          />
        ))}
      </div>
    </>
  );
}
