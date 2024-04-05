import { useCallback, useMemo, useReducer } from "react";
import { Board, SudokuPuzzle } from "@/types";
import { findConflict, parsePuzzleString } from "@/utils/puzzle";

export function useBoard(initialPuzzle: string) {
  const [board, boardDispatch] = useReducer(
    boardReducer,
    initialPuzzle,
    parsePuzzleString
  );

  const setBoard = (value: Board) => {
    boardDispatch({ type: "setBoard", value });
  };

  const reset = useCallback(() => {
    boardDispatch({ type: "reset" });
  }, []);

  const updateCell = (index: number, value: number | null) => {
    boardDispatch({ type: "update", index, value });
  };

  const conflictSet = useMemo(() => findConflict(board), [board]);
  const isComplete =
    conflictSet.size === 0 && board.every((cell) => cell.value !== null);

  return {
    board,
    setBoard,
    reset,
    updateCell,
    isComplete,
    conflictSet,
  };
}

type BoardAction =
  | { type: "reset" }
  | { type: "update"; index: number; value: number | null }
  | { type: "setBoard"; value: Board };

function boardReducer(state: Board, action: BoardAction) {
  switch (action.type) {
    case "setBoard": {
      return action.value;
    }
    case "reset": {
      return state.map((cell) => {
        if (!cell.editable) return cell;
        return { ...cell, value: null };
      });
    }
    case "update": {
      return state.map((cell, index) => {
        if (index !== action.index) return cell;
        return { ...cell, value: action.value };
      });
    }
  }
}
