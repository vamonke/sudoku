import { SudokuPuzzle } from "@/types";
import { parsePuzzleString } from "@/utils/puzzle";
import { useCallback, useState } from "react";
import { useBoard } from "./useBoard";
import { useMoves } from "./useMoves";
import { fetchNewPuzzle } from "@/utils/supabase/puzzle";

export function useGame(initialPuzzle: SudokuPuzzle) {
  const { board, setBoard, reset, updateCell, isComplete, conflictSet } =
    useBoard(initialPuzzle);
  const { lastMove, canUndo, undo, addMove, clearMoves } = useMoves();

  const [puzzleId, setPuzzleId] = useState(initialPuzzle.id);
  const [showConflict, setShowConflict] = useState<boolean>(true);

  const onChangeCell = useCallback(
    (index: number, value: number | null) => {
      updateCell(index, value);
      addMove({ index, newValue: value, prevValue: board[index].value });
    },
    [addMove, board, updateCell]
  );

  const handleNewGame = useCallback(async () => {
    clearMoves();
    const newPuzzle = await fetchNewPuzzle(puzzleId);
    setBoard(parsePuzzleString(newPuzzle.puzzle));
    setPuzzleId(newPuzzle.id);
  }, [setBoard, clearMoves, puzzleId]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      updateCell(lastMove.index, lastMove.prevValue);
      undo();
    }
  }, [lastMove, updateCell, canUndo, undo]);

  const toggleShowConflict = () => setShowConflict((prev) => !prev);

  return {
    board,
    reset,
    handleNewGame,
    canUndo,
    undo: handleUndo,
    onChangeCell,
    isComplete,
    conflictSet,
    showConflict,
    toggleShowConflict,
  };
}
