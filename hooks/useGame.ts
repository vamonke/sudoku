import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Puzzle, Cell, GameStatus, GameMove } from "@/types";

export function useGame() {
  const [id, setId] = useState<string | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null); // TODO: useReducer?
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConflicts, setShowConflicts] = useState<boolean>(true);
  const [moves, setMoves] = useState<GameMove[]>([]);

  const onLoad = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_random_puzzle");

    if (!data) return;
    // TODO: Handle error

    const puzzle = parsePuzzleString(data.puzzle);
    if (puzzle) {
      setPuzzle(puzzle);
      setId(data.id);
    }
  }, []);

  const newGame = useCallback(async () => {
    console.log("fetchPuzzle", id);
    const supabase = createClient();
    const { data } = await supabase.rpc("get_random_puzzle", {
      pid: id,
    });

    if (!data) return;
    // TODO: Handle error

    const puzzle = parsePuzzleString(data.puzzle);
    if (puzzle) {
      setPuzzle(puzzle);
      setId(data.id);
    }
  }, [id]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const restart = () => {
    console.log("restart");
    setPuzzle((prevPuzzle) => {
      if (!prevPuzzle) return null;
      const newPuzzle = prevPuzzle.map((cell) => {
        if (cell.type === "prefilled") return cell;
        return { ...cell, value: null };
      });
      return newPuzzle;
    });
  };

  const onChangeCell = (index: number, value: number | null) => {
    const newValue = value;
    const prevValue = puzzle?.[index].value ?? null;

    setPuzzle((prevPuzzle) => {
      if (!prevPuzzle) return null;
      const newPuzzle = prevPuzzle.map((cell) => {
        if (cell.index !== index) return cell;
        return { ...cell, value };
      });
      return newPuzzle;
    });

    setMoves((prevMoves) => {
      const newMoves = [...prevMoves, { index, newValue, prevValue }];
      return newMoves;
    });
  };

  const undo = useCallback(() => {
    if (moves.length === 0 || !puzzle) return;

    const lastMove = moves[moves.length - 1];
    const newPuzzle = puzzle.map((cell, index) => {
      if (index === lastMove.index) {
        return { ...cell, value: lastMove.prevValue };
      }
      return cell;
    });

    setPuzzle(newPuzzle);

    setMoves((prevMoves) => {
      const newMoves = prevMoves.slice(0, -1);
      return newMoves;
    });
  }, [moves, puzzle]);

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      console.log("KeyUp:", event.key);
      if (event.key === "r") restart(); // TODO: Add confirmation
      if (event.key === "n") newGame(); // TODO: Add confirmation
      if (event.key === "h") toggleShowConflicts(); // TODO: Add confirmation
      if (event.key === "z") undo();
    };

    window.addEventListener("keyup", eventListener);
    return () => {
      window.removeEventListener("keyup", eventListener);
    };
  }, [newGame, undo]);

  const onFocusCell = (index: number) => {
    setSelectedIndex(index);
  };

  const onBlurCell = () => {
    setSelectedIndex(null);
  };

  const toggleShowConflicts = () => {
    setShowConflicts((prev) => !prev);
  };

  const gameStatus = evaluateGame(puzzle); // TODO: useMemo
  const cells = evaluateCells(puzzle, gameStatus, selectedIndex); // TODO: useMemo

  return {
    id,
    cells,
    // puzzle,
    restart,
    undo,
    newGame,
    onFocusCell,
    onChangeCell,
    onBlurCell,
    status: gameStatus,
    toggleShowConflicts,
    showConflicts,
  };
}

const parsePuzzleString = (puzzle: string): Puzzle => {
  return puzzle.split("").map((cell, index) => {
    const isEmpty = cell === ".";
    const type = isEmpty ? "empty" : "prefilled";
    const value = isEmpty ? null : parseInt(cell);
    return {
      index,
      type,
      value,
    };
  });
};

const evaluateGame = (puzzle: Puzzle | null): GameStatus => {
  if (!puzzle) return { isComplete: false };

  const emptySet = new Set(
    puzzle.filter(({ value }) => !value).map(({ index }) => index)
  );

  const conflictMap: Map<number, number[]> = new Map();

  puzzle.forEach((cell, index) => {
    if (!cell.value) return;
    const relevantIndexes = RELATED_INDEX_MAP[index];
    const conflicts = Array.from(relevantIndexes).filter((relatedIndex) => {
      return puzzle[relatedIndex].value === cell.value;
    });
    if (conflicts.length > 0) {
      conflictMap.set(index, conflicts);
    }
  });

  const isComplete = emptySet.size === 0 && conflictMap.size === 0;

  return {
    conflictMap,
    emptySet,
    isComplete,
  };
};

const evaluateCells = (
  puzzle: Puzzle,
  gameStatus: GameStatus,
  selectedIndex: number | null
): Puzzle => {
  if (!puzzle) return null;

  const relevantIndexes =
    selectedIndex === null ? [] : RELATED_INDEX_MAP[selectedIndex];

  const cells = puzzle.map((cell, index): Cell => {
    const isSelected = index === selectedIndex;
    const isHighlighted = Array.from(relevantIndexes).includes(index);
    const hasConflictWithSelected = gameStatus.conflictMap?.has(index) ?? false;
    return {
      ...cell,
      status: {
        isSelected,
        isHighlighted,
        hasConflictWithSelected,
      },
    };
  });

  return cells;
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

const RELATED_INDEX_MAP: number[][] = getRelatedIndexMap();
