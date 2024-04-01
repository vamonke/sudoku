import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Puzzle } from "@/types";

export function useGame() {
  const [id, setId] = useState<string | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null); // TODO: useReducer?
  // TODO: Add loading state
  // TODO: Add conflicts state

  useEffect(() => {
    fetchPuzzle();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPuzzle = async () => {
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
  };

  const restart = () => {
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
    setPuzzle((prevPuzzle) => {
      if (!prevPuzzle) return null;
      const newPuzzle = prevPuzzle.map((cell, i) =>
        i === index ? { ...cell, value } : cell
      );
      return newPuzzle;
    });
  };

  const newGame = async () => {
    await fetchPuzzle();
  };

  const onFocusCell = (index: number) => {
    if (!puzzle) return;

    const selectedX = index % 9;
    const selectedY = Math.floor(index / 9);
    const selectedSubgrid = getSubgrid(index);

    const newPuzzle = puzzle?.map((cell, i) => {
      if (i === index) return { ...cell, selected: true, highlighted: true };
      const x = i % 9;
      const y = Math.floor(i / 9);
      const subgrid = cell.subgrid;
      const highlighted =
        x === selectedX || y === selectedY || subgrid === selectedSubgrid;
      return { ...cell, selected: false, highlighted };
    });
    setPuzzle(newPuzzle);
  };

  const onBlurCell = (index: number) => {
    if (!puzzle) return;
    const newPuzzle = puzzle?.map((cell, i) =>
      i === index
        ? { ...cell, selected: false, highlighted: false }
        : { ...cell, highlighted: false }
    );
    setPuzzle(newPuzzle);
  };

  const result = puzzle ? evaluate(puzzle) : null;

  return {
    id,
    puzzle,
    restart,
    onFocusCell,
    onChangeCell,
    onBlurCell,
    newGame,
    result,
  };
}

const parsePuzzleString = (puzzle: string): Puzzle => {
  return puzzle.split("").map((cell, index) => {
    const isEmpty = cell === ".";
    const type = isEmpty ? "empty" : "prefilled";
    const value = isEmpty ? null : parseInt(cell);
    const x = index % 9;
    const y = Math.floor(index / 9);
    const subgrid = getSubgrid(index);
    return { type, value, x, y, subgrid };
  });
};

const evaluate = (puzzle: Puzzle): Boolean => {
  // TODO: Optimize this function?
  // TODO: Add error messages

  const isValid = puzzle.every(
    ({ value }) => value && Number.isInteger(value) && value >= 1 && value <= 9
  );
  if (!isValid) return false;

  const gameMatrix = new Array(9).fill(0).map(() => new Array(9).fill(0));
  puzzle.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    gameMatrix[row][col] = cell.value;
  });

  gameMatrix.forEach((row, y) => {
    // Check row
    if (new Set(row).size !== 9) return false;

    // Check column
    row.forEach((_, x) => {
      if (new Set(gameMatrix.map((row) => row[x])).size !== 9) return false;
    });
  });

  // Check 3x3
  for (let y = 0; y < 9; y += 3) {
    for (let x = 0; x < 9; x += 3) {
      const row1 = gameMatrix[y].slice(x, x + 3);
      const row2 = gameMatrix[y + 1].slice(x, x + 3);
      const row3 = gameMatrix[y + 2].slice(x, x + 3);
      const sectionSet = new Set([...row1, ...row2, ...row3]);
      if (sectionSet.size !== 9) return false;
    }
  }

  return true;
};

const getSubgrid = (index: number): number => {
  const x = index % 9;
  const y = Math.floor(index / 9);
  return Math.floor(y / 3) * 3 + Math.floor(x / 3);
};
