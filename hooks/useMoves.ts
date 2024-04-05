import { useCallback, useState } from "react";
import { GameMove } from "@/types";

export function useMoves() {
  const [moves, setMoves] = useState<GameMove[]>([]);

  const undo = useCallback(() => {
    setMoves((prevMoves) => prevMoves.slice(0, -1));
  }, []);

  const addMove = useCallback((move: GameMove) => {
    setMoves((prevMoves) => [...prevMoves, move]);
  }, []);

  const clearMoves = useCallback(() => {
    setMoves([]);
  }, []);

  const lastMove = moves[moves.length - 1];
  const canUndo = moves.length > 0;

  return {
    lastMove,
    canUndo,
    undo,
    addMove,
    clearMoves,
  };
}
