import { Board, ConflictSet } from "@/types";

export const parsePuzzleString = (puzzle: string): Board => {
  const sanitizedPuzzle = puzzle.slice(0, 81).replace(/[^1-9.]/g, ".");
  const filledPuzzle = sanitizedPuzzle.padEnd(81, ".");
  return filledPuzzle.split("").map((cell) => {
    const editable = cell === ".";
    const value = editable ? null : parseInt(cell, 10);
    return {
      editable,
      value,
    };
  });
};

export const findConflict = (board: Board): ConflictSet => {
  const conflictSet = new Set<number>();
  board.forEach((cell, index) => {
    if (!cell.value) return;
    const relevantIndexes = RELATED_INDEX_MAP.get(index) ?? [];
    const hasConflict = relevantIndexes.some((relatedIndex) => {
      return board[relatedIndex].value === cell.value;
    });
    if (hasConflict) {
      conflictSet.add(index);
    }
  });

  return conflictSet;
};

const getRelatedIndexMap = (): Map<number, number[]> => {
  const indexMatrix = new Array(81).fill(0).map(() => new Set<number>());
  for (let i = 0; i < 81; i++) {
    const x = i % 9;
    const y = Math.floor(i / 9);
    const subgrid = Math.floor(y / 3) * 3 + Math.floor(x / 3);
    for (let j = i + 1; j < 81; j++) {
      const x2 = j % 9;
      const y2 = Math.floor(j / 9);
      const subgrid2 = Math.floor(y2 / 3) * 3 + Math.floor(x2 / 3);
      if (x === x2 || y === y2 || subgrid === subgrid2) {
        indexMatrix[i].add(j);
        indexMatrix[j].add(i);
      }
    }
  }
  const relatedIndexMap = new Map<number, number[]>();
  indexMatrix.forEach((relatedIndexes, index) => {
    relatedIndexMap.set(index, Array.from(relatedIndexes));
  });
  return relatedIndexMap;
};

export const RELATED_INDEX_MAP = getRelatedIndexMap();
