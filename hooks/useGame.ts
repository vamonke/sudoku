import { SudokuPuzzle } from "@/types";
import { fetchNewPuzzle } from "@/utils/puzzle";
import { useCallback, useState } from "react";
import { parsePuzzleString, useBoard } from "./useBoard";
import { useMoves } from "./useMoves";
import { useSelection } from "./useSelection";

export function useGame(initialPuzzle: SudokuPuzzle) {
  const { board, newGame, restart, updateCell, isComplete, conflictSet } =
    useBoard(initialPuzzle);
  const { lastMove, canUndo, undo, addMove, clearMoves } = useMoves();
  const { selectedIndex, onFocus, onBlur } = useSelection();

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
    newGame(parsePuzzleString(newPuzzle.puzzle));
    setPuzzleId(newPuzzle.id);
  }, [newGame, clearMoves, puzzleId]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      updateCell(lastMove.index, lastMove.prevValue);
      undo();
    }
  }, [lastMove, updateCell, canUndo, undo]);

  const toggleShowConflict = () => setShowConflict((prev) => !prev);

  return {
    board,
    selectedIndex,
    restart,
    handleNewGame,
    canUndo,
    undo: handleUndo,
    onChangeCell,
    onFocus,
    onBlur,
    isComplete,
    conflictSet,
    showConflict,
    toggleShowConflict,
  };
}
