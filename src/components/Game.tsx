"use client";

import { useEffect, useMemo, useState } from "react";
import { Board } from "./Board";
import styles from "./Game.module.css";
import { EMPTY_TILE } from "@/lib/types/game";
import dynamic from "next/dynamic";
import { shuffleTiles } from "@/lib/utils/shuffle";
import { splitImageIntoTiles } from "@/lib/utils/imageProcessor";

const ConfettiExplosion = dynamic(() => import("react-confetti-explosion"), {
  ssr: false,
});
export function Game() {
  const [tiles, setTiles] = useState(
    Array.from({ length: 16 }, (_, i) => ({ id: i }))
  );

  const [tileImages, setTileImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadImage() {
      const images = await splitImageIntoTiles("/puzzle-image.png");
      setTileImages(images);
    }
    loadImage();
  }, []);

  useEffect(() => {
    if (tileImages.length === 0) return;
    // TODO: after final testing, remove next 3 commented lines
    // const newTiles = [...tiles];
    // [newTiles[14], newTiles[15]] = [newTiles[15]!, newTiles[14]!];
    // setTiles(newTiles);
    setTiles((prev) => shuffleTiles(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileImages]);

  const isWon = useMemo(
    () => tiles.every((tile, index) => tile.id === index),
    [tiles]
  );

  const emptyIndex = useMemo(
    () => tiles.findIndex((t) => t.id === EMPTY_TILE),
    [tiles]
  );

  function handleShuffleClick() {
    setTiles((prev) => shuffleTiles(prev));
  }

  function handleTileClick(index: number) {
    if (isWon) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [
      newTiles[emptyIndex]!,
      newTiles[index]!,
    ];

    setTiles(newTiles);
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
      <div className={styles.container}>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleShuffleClick}>
            Shuffle
          </button>
          {/* <button className={styles.button}>Upload</button>
          <button className={styles.button}>Hint</button> */}
        </div>
        <Board
          tiles={tiles}
          tileImages={tileImages}
          onTileClick={handleTileClick}
          isWon={isWon}
        />
      </div>
    </>
  );
}
