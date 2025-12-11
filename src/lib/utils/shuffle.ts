import { Board, MAX_DIFFICULTY } from "../types/game";
import { getManhattanDistance, isSolvable } from "./solver";

export function shuffleTiles(board: Board): Board {
  let shuffled: Board | null = null;
  while (
    shuffled === null ||
    !isSolvable(shuffled) ||
    getManhattanDistance(shuffled) > MAX_DIFFICULTY
  ) {
    shuffled = [...board];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
  }

  console.log(
    "debug data:",
    "board",
    shuffled,
    "manhattan distance",
    getManhattanDistance(shuffled)
  );

  return shuffled;
}
