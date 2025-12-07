export async function splitImageIntoTiles(
  imagePath: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Make it square by cropping to center
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      const tileSize = size / 4;
      const tiles: string[] = [];

      // Create 16 tiles
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const canvas = document.createElement("canvas");
          canvas.width = tileSize;
          canvas.height = tileSize;
          const ctx = canvas.getContext("2d")!;

          // Extract this tile's portion of the image
          ctx.drawImage(
            img,
            x + col * tileSize, // Source X
            y + row * tileSize, // Source Y
            tileSize, // Source width
            tileSize, // Source height
            0, // Dest X
            0, // Dest Y
            tileSize, // Dest width
            tileSize // Dest height
          );

          tiles.push(canvas.toDataURL());
        }
      }

      resolve(tiles);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imagePath;
  });
}
