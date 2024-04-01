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
    const newPuzzle = puzzle?.map((cell, i) =>
      i === index ? { ...cell, selected: true } : { ...cell, selected: false }
    );
    setPuzzle(newPuzzle);
  };

  const onBlurCell = (index: number) => {
    if (!puzzle) return;
    const newPuzzle = puzzle?.map((cell, i) =>
      i === index ? { ...cell, selected: false } : cell
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
  return puzzle.split("").map((cell) => {
    const isEmpty = cell === ".";
    const type = isEmpty ? "empty" : "prefilled";
    const value = isEmpty ? null : parseInt(cell);
    return { type, value };
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
