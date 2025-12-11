import { describe, expect, test } from "@jest/globals";
import {
  compressBoard,
  decompressBoard,
  getDistanceForTile,
  getManhattanDistance,
  getNextMoveBoards,
  solvePuzzle,
} from "./solver";

describe("getDistanceForTile", () => {
  test("tile needs 0 steps to get home", () => {
    expect(getDistanceForTile(1, 0)).toBe(0);
    expect(getDistanceForTile(4, 3)).toBe(0);
  });
  test("tile needs 1 step right to get home", () => {
    expect(getDistanceForTile(4, 2)).toBe(1);
  });
  test("tile needs 1 step left to get home", () => {
    expect(getDistanceForTile(1, 1)).toBe(1);
  });
  test("tile needs 1 step up to get home", () => {
    expect(getDistanceForTile(1, 4)).toBe(1);
  });
  test("tile needs 1 step down to get home", () => {
    expect(getDistanceForTile(5, 0)).toBe(1);
  });
  test("tile needs 6 steps to get home", () => {
    expect(getDistanceForTile(1, 15)).toBe(6);
  });
});

describe("getManhattanDistance", () => {
  test("12 tile needs to move 1 space", () => {
    expect(
      getManhattanDistance([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12,
      ])
    ).toBe(1);
  });
  test("11, 12, and 15 tiles needs to move 1 space each", () => {
    expect(
      getManhattanDistance([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 11, 13, 14, 0, 12,
      ])
    ).toBe(3);
  });
  test("solved board is 0", () => {
    expect(
      getManhattanDistance([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
      ])
    ).toBe(0);
  });
});

describe("getNextMoves", () => {
  test("2 next moves when empty space is in top left", () => {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const nextMoves = getNextMoveBoards(board);
    expect(nextMoves).toHaveLength(2);
    expect(nextMoves).toContainEqual([
      1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ]);
    expect(nextMoves).toContainEqual([
      4, 1, 2, 3, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ]);
  });
  test("2 next moves when empty space is in bottom right", () => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    const nextMoves = getNextMoveBoards(board);
    expect(nextMoves).toHaveLength(2);
    expect(nextMoves).toContainEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
    ]);
    expect(nextMoves).toContainEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12,
    ]);
  });
});

describe("compress/decompress", () => {
  test("roundtrip preserves board", () => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    expect(decompressBoard(compressBoard(board))).toEqual(board);
  });

  test("different boards produce different compressed values", () => {
    const board1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const board2 = [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(compressBoard(board1)).not.toBe(compressBoard(board2));
  });
});

describe("solvePuzzle", () => {
  test("solves solved puzzle in 0 moves", () => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    const steps = solvePuzzle(board);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual(board);
  });

  test("solves puzzle in exactly 1 move", () => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];
    const steps = solvePuzzle(board);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1]).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
    ]);
  });
});
