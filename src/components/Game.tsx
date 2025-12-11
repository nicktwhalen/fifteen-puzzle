"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Board } from "./Board";
import styles from "./Game.module.css";
import { EMPTY_TILE } from "@/lib/types/game";
import dynamic from "next/dynamic";
import { shuffleTiles } from "@/lib/utils/shuffle";
import { splitImageIntoTiles } from "@/lib/utils/imageProcessor";
import { solvePuzzle } from "@/lib/utils/solver";

const ConfettiExplosion = dynamic(() => import("react-confetti-explosion"), {
  ssr: false,
});
export function Game() {
  const [tiles, setTiles] = useState(
    Array.from({ length: 16 }, (_, i) => (i < 15 ? i + 1 : EMPTY_TILE))
  );
  const [tileImages, setTileImages] = useState<string[]>([]);
  const hasShuffled = useRef(false);

  useEffect(() => {
    if (hasShuffled.current) return;

    async function loadImageAndShuffle() {
      const images = await splitImageIntoTiles("/puzzle-image.png");
      setTileImages(images);
      setTiles((prev) => shuffleTiles(prev));
      hasShuffled.current = true;
    }

    loadImageAndShuffle();
  }, []);

  const isWon = useMemo(
    () => tiles.every((tile, index) => tile === (index + 1) % 16),
    [tiles]
  );

  const emptyIndex = useMemo(
    () => tiles.findIndex((tile) => tile === EMPTY_TILE),
    [tiles]
  );

  function handleShuffleClick() {
    setTiles((prev) => shuffleTiles(prev));
  }

  async function handleUploadClick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      const images = await splitImageIntoTiles(imageUrl);
      setTileImages(images);
      URL.revokeObjectURL(imageUrl);
      setTiles((prev) => shuffleTiles(prev));
    } catch (error) {
      console.error("Failed to process image:", error);
    }

    event.target.value = "";
  }

  function handleHintClick() {
    if (isWon) return;

    const steps = solvePuzzle(tiles);
    console.log(steps);
    setTiles(steps[1]!);
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
          <label htmlFor="image-upload" className={styles.button}>
            Upload Image
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleUploadClick}
            style={{ display: "none" }}
          />
          <button className={styles.button} onClick={handleHintClick}>
            Hint
          </button>
        </div>
        <Board
          board={tiles}
          tileImages={tileImages}
          onTileClick={handleTileClick}
          isWon={isWon}
        />
      </div>
    </>
  );
}
