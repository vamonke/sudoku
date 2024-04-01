import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Board, Cell, GameStatus, GameMove, SudokuPuzzle } from "@/types";

export function useGame(initialPuzzle: SudokuPuzzle) {
  const [puzzleId, setPuzzleId] = useState<string>(initialPuzzle.id);
  const [board, setBoard] = useState<Board>(
    parsePuzzleString(initialPuzzle.puzzle)
  ); // TODO: useReducer?
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConflicts, setShowConflicts] = useState<boolean>(true);
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    isComplete: false,
  });

  const newGame = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_random_puzzle", {
      pid: puzzleId,
    });
    if (!data) return;
    // TODO: Handle error
    const newBoard = parsePuzzleString(data.puzzle);
    if (newBoard) {
      setBoard(newBoard);
      setPuzzleId(data.id);
    }
  }, [puzzleId]);

  const restart = () => {
    console.log("Restart");
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((cell) => {
        if (cell.type === "prefilled") return cell;
        return { ...cell, value: null };
      });
      return newBoard;
    });
  };

  const onChangeCell = (index: number, value: number | null) => {
    const newValue = value;
    const prevValue = board?.[index].value ?? null;

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((cell) => {
        if (cell.index !== index) return cell;
        return { ...cell, value };
      });
      return newBoard;
    });

    setMoves((prevMoves) => {
      const newMoves = [...prevMoves, { index, newValue, prevValue }];
      return newMoves;
    });
  };

  const undo = useCallback(() => {
    if (moves.length === 0 || !board) return;

    const lastMove = moves[moves.length - 1];
    const newBoard = board.map((cell, index) => {
      if (index === lastMove.index) {
        return { ...cell, value: lastMove.prevValue };
      }
      return cell;
    });

    setBoard(newBoard);

    setMoves((prevMoves) => {
      const newMoves = prevMoves.slice(0, -1);
      return newMoves;
    });
  }, [moves, board]);

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

  // const gameStatus = evaluateGame(board);

  useEffect(() => {
    const gameStatus = evaluateGame(board);
    setGameStatus(gameStatus);
  }, [board]);

  useEffect(() => {
    const cellStatus = getCellStatus(board, gameStatus, selectedIndex);
    setCells(cellStatus);
  }, [selectedIndex, gameStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    cells,
    board,
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

const parsePuzzleString = (puzzle: string): Board => {
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

const evaluateGame = (board: Board): GameStatus => {
  console.log("Evaluating game");

  const emptySet = new Set(
    board.filter(({ value }) => !value).map(({ index }) => index)
  );

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

  const isComplete = emptySet.size === 0 && conflictSet.size === 0;

  return {
    conflictSet,
    emptySet,
    isComplete,
  };
};

const getCellStatus = (
  board: Board,
  gameStatus: GameStatus,
  selectedIndex: number | null
): Board => {
  console.log("Get highlights cells");
  const relevantIndexes =
    selectedIndex === null ? [] : RELATED_INDEX_MAP[selectedIndex];
  const cells = board.map((cell, index): Cell => {
    const isSelected = index === selectedIndex;
    const isHighlighted = relevantIndexes.includes(index);
    const hasConflict = gameStatus.conflictSet?.has(index) ?? false;
    return {
      ...cell,
      status: {
        isSelected,
        isHighlighted,
        hasConflict,
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
