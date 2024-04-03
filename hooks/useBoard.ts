import { useCallback, useEffect, useReducer, useState } from "react";
import { Board, ConflictSet, SudokuPuzzle } from "@/types";

export function useBoard(initialPuzzle: SudokuPuzzle) {
  const [board, boardDispatch] = useReducer(
    boardReducer,
    initialPuzzle.puzzle,
    parsePuzzleString
  );
  const [conflictSet, setConflictSet] = useState<Set<number>>(new Set());

  const newGame = async (newBoard: Board) => {
    boardDispatch({ type: "new", value: newBoard });
  };

  const restart = useCallback(() => {
    boardDispatch({ type: "restart" });
  }, []);

  const updateCell = (index: number, value: number | null) => {
    boardDispatch({ type: "update", index, value });
  };

  useEffect(() => {
    const conflict = findConflict(board);
    setConflictSet(conflict);
  }, [board]);

  const isComplete =
    conflictSet.size === 0 && board.every((cell) => cell.value !== null);

  return {
    board,
    newGame,
    restart,
    updateCell,
    isComplete,
    conflictSet,
  };
}

export const parsePuzzleString = (puzzle: string): Board => {
  return puzzle.split("").map((cell, index) => {
    const editable = cell === ".";
    const value = editable ? null : parseInt(cell, 10);
    return {
      index,
      editable,
      value,
    };
  });
};

const findConflict = (board: Board): ConflictSet => {
  const conflictSet = new Set<number>();
  board.forEach((cell, index) => {
    if (!cell.value) return;
    const relevantIndexes = RELATED_INDEX_MAP[index];
    const hasConflict = relevantIndexes.some((relatedIndex) => {
      return board[relatedIndex].value === cell.value;
    });
    if (hasConflict) {
      conflictSet.add(index);
    }
  });

  return conflictSet;
};

const getRelatedIndexMap = (): number[][] => {
  const indexSet = new Array(81).fill(null).map(() => new Set<number>());
  for (let i = 0; i < 81; i++) {
    const x = i % 9;
    const y = Math.floor(i / 9);
    const subgrid = Math.floor(y / 3) * 3 + Math.floor(x / 3);
    for (let j = i + 1; j < 81; j++) {
      const x2 = j % 9;
      const y2 = Math.floor(j / 9);
      const subgrid2 = Math.floor(y2 / 3) * 3 + Math.floor(x2 / 3);
      if (x === x2 || y === y2 || subgrid === subgrid2) {
        indexSet[i].add(j);
        indexSet[j].add(i);
      }
    }
  }
  const indexArray = indexSet.map((set) => Array.from(set));
  return indexArray;
};

export const RELATED_INDEX_MAP: number[][] = getRelatedIndexMap();

type BoardAction =
  | { type: "restart" }
  | { type: "update"; index: number; value: number | null }
  | { type: "new"; value: Board };

function boardReducer(state: Board, action: BoardAction) {
  switch (action.type) {
    case "new": {
      return action.value;
    }
    case "restart": {
      return state.map((cell) => {
        if (!cell.editable) return cell;
        return { ...cell, value: null };
      });
    }
    case "update": {
      return state.map((cell) => {
        if (cell.index !== action.index) return cell;
        return { ...cell, value: action.value };
      });
    }
    default: {
      return state;
    }
  }
}
