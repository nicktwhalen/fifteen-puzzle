import { Heap } from "heap-js";

export type Board = number[];

export const EMPTY_TILE = 0;

export interface State {
  board: number[];
  moves: number;
  distance: number;
}

export function getDistanceForTile(tile: number, location: number): number {
  if (tile === 0) {
    return 0;
  }
  const columnDelta = Math.abs(((tile - 1) % 4) - (location % 4));
  const rowDelta = Math.abs(
    Math.floor((tile - 1) / 4) - Math.floor(location / 4)
  );
  return columnDelta + rowDelta;
}

export function getManhattanDistance(board: Board): number {
  return board.reduce((accumulator, tile, index) => {
    return accumulator + getDistanceForTile(tile, index);
  }, 0);
}

export function getNextMoveBoards(board: Board): Board[] {
  const nextBoards: Board[] = [];

  const emptyIndex = board.findIndex((tile) => tile === EMPTY_TILE);

  if (emptyIndex > 3) {
    const swapIndex = emptyIndex - 4;
    const nextBoard = [...board];
    [nextBoard[emptyIndex], nextBoard[swapIndex]] = [
      nextBoard[swapIndex]!,
      nextBoard[emptyIndex]!,
    ];
    nextBoards.push(nextBoard);
  }
  if (emptyIndex < 12) {
    const swapIndex = emptyIndex + 4;
    const nextBoard = [...board];
    [nextBoard[emptyIndex], nextBoard[swapIndex]] = [
      nextBoard[swapIndex]!,
      nextBoard[emptyIndex]!,
    ];
    nextBoards.push(nextBoard);
  }
  if (emptyIndex % 4 > 0) {
    const swapIndex = emptyIndex - 1;
    const nextBoard = [...board];
    [nextBoard[emptyIndex], nextBoard[swapIndex]] = [
      nextBoard[swapIndex]!,
      nextBoard[emptyIndex]!,
    ];
    nextBoards.push(nextBoard);
  }
  if (emptyIndex % 4 < 3) {
    const swapIndex = emptyIndex + 1;
    const nextBoard = [...board];
    [nextBoard[emptyIndex], nextBoard[swapIndex]] = [
      nextBoard[swapIndex]!,
      nextBoard[emptyIndex]!,
    ];
    nextBoards.push(nextBoard);
  }

  return nextBoards;
}

export function compressBoard(board: Board): bigint {
  let result = 0n;
  for (const tile of board) {
    result = (result << 4n) | BigInt(tile);
  }
  return result;
}

export function decompressBoard(compressed: bigint): Board {
  const board: Board = [];
  let temp = compressed;

  for (let i = 0; i < 16; i++) {
    const tile = Number(temp & 0xfn);
    board.push(tile);
    temp = temp >> 4n;
  }

  return board.reverse();
}

export function isSolvable(board: Board): boolean {
  let inversions = 0;

  for (let i = 0; i < board.length - 1; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] !== 0 && board[j] !== 0 && board[i]! > board[j]!) {
        inversions++;
      }
    }
  }

  // For 15-puzzle (4x4 grid):
  // - If blank is on an even row from bottom, inversions must be odd
  // - If blank is on an odd row from bottom, inversions must be even
  // Equivalently: (inversions + rowFromBottom) must be odd
  const emptyIndex = board.findIndex((tile) => tile === 0);
  const rowFromTop = Math.floor(emptyIndex / 4);
  const rowFromBottom = 4 - rowFromTop;
  return (inversions + rowFromBottom) % 2 === 1;
}

export function solvePuzzle(board: Board): Board[] {
  const states = new Heap<State>((a, b) => {
    const aCost = a.moves + a.distance;
    const bCost = b.moves + b.distance;
    return aCost - bCost;
  });

  states.push({
    board,
    moves: 0,
    distance: getManhattanDistance(board),
  });
  const boardsToPreviousMap: Map<bigint, bigint | null> = new Map();

  let state = states.pop()!;
  boardsToPreviousMap.set(compressBoard(state.board), null);

  while (state.distance > 0) {
    const board = state.board;
    const compressed = compressBoard(state.board);
    getNextMoveBoards(board).forEach((nextBoard) => {
      const nextCompressed = compressBoard(nextBoard);
      if (!boardsToPreviousMap.has(nextCompressed)) {
        boardsToPreviousMap.set(nextCompressed, compressed);
        states.push({
          board: nextBoard,
          moves: state.moves + 1,
          distance: getManhattanDistance(nextBoard),
        });
      }
    });
    state = states.pop()!;
  }

  const steps: Board[] = [];
  let compressed: bigint = compressBoard(state.board);
  while (compressed) {
    const board = decompressBoard(compressed);
    steps.push(board);
    compressed = boardsToPreviousMap.get(compressed)!;
  }

  return steps.reverse();
}
