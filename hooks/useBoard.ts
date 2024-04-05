import { useCallback, useMemo, useState } from "react";
import { findConflict, parsePuzzleString } from "@/utils/puzzle";
import { Board } from "@/types";

export function useBoard(initialPuzzle: string) {
  const [board, setBoard] = useState<Board>(parsePuzzleString(initialPuzzle));

  const reset = useCallback(() => {
    setBoard((prevBoard) =>
      prevBoard.map((cell) => {
        if (!cell.editable) return cell;
        return { ...cell, value: null };
      })
    );
  }, []);

  const updateCell = (index: number, value: number | null) => {
    setBoard((prevBoard) =>
      prevBoard.map((cell, i) => {
        if (i !== index) return cell;
        return { ...cell, value };
      })
    );
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
