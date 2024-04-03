import { useCallback, useReducer } from "react";
import { GameMove } from "@/types";

export function useMoves() {
  const [moves, dispatch] = useReducer(movesReducer, []);

  const undo = useCallback(() => {
    dispatch({ type: "undo" });
  }, []);

  const addMove = useCallback((move: GameMove) => {
    dispatch({ type: "add", move });
  }, []);

  const clearMoves = useCallback(() => {
    dispatch({ type: "clear" });
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

type MovesAction =
  | { type: "add"; move: GameMove }
  | { type: "undo" }
  | { type: "clear" };

function movesReducer(state: GameMove[], action: MovesAction) {
  switch (action.type) {
    case "add": {
      return [...state, action.move];
    }
    case "undo": {
      return state.slice(0, -1);
    }
    case "clear": {
      return [];
    }
    default: {
      return state;
    }
  }
}
