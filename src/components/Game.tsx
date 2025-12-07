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
          {/* <button className={styles.button}>Hint</button> */}
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
