"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [game, setGame] = useState(
    new Array(81).fill({ type: "empty", value: null })
  );

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const result = evaluate(game);

  const fetchPuzzle = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sudoku_puzzles")
      .select()
      .eq("id", "c0bcd6f3-8406-4bb6-a11e-e043866f62a1") // TODO: Randomize puzzle
      .limit(1)
      .maybeSingle();
    const puzzle = parsePuzzleString(data?.puzzle);
    setGame(puzzle);
  };

  return (
    <main className="flex flex-col h-full">
      <div className="flex flex-col justify-center items-center p-4">
        <h1 className="text-xl">SUDOKU</h1>
        <div>{result ? "Completed" : ""}</div>
      </div>
      <div className="grow flex flex-col justify-center items-center pb-8">
        <div className="aspect-square" style={{ height: 512, width: 512 }}>
          <Grid game={game} setGame={setGame} />
        </div>
      </div>
    </main>
  );
}

const parsePuzzleString = (
  puzzle: string
): { type: string; value: number | null }[] => {
  return puzzle.split("").map((cell) => {
    const isEmpty = cell === ".";
    const type = isEmpty ? "empty" : "prefilled";
    const value = isEmpty ? null : parseInt(cell);
    return { type, value };
  });
};

function Grid(props: {
  game: { type: string; value: number | null }[];
  setGame: React.Dispatch<
    React.SetStateAction<{ type: string; value: number | null }[]>
  >;
}) {
  const { game, setGame } = props;

  const onChange = (index: number, value: number | null) => {
    setGame((prevGame) => {
      const newGame = [...prevGame];
      newGame[index] = { ...newGame[index], value };
      return newGame;
    });
  };

  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {game.map(({ value, type }, index) => (
        <Cell
          index={index}
          key={index}
          type={type}
          value={value}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

function Cell(props: {
  index: number;
  type: string;
  value: number | null;
  onChange: (index: number, value: number | null) => void;
}) {
  const { value, type, index, onChange } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[1-9]|Backspace|ArrowUp|ArrowDown$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onChange(index, null);
    } else {
      const parsedInt = parseInt(value[value.length - 1]);
      onChange(index, parsedInt);
    }
  };

  return (
    <input
      className="bg-gray-200 flex items-center justify-center text-center"
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      readOnly={type === "prefilled"}
      type="number"
      min={1}
      max={9}
      step={1}
    />
  );
}

const evaluate = (game: { type: string; value: number | null }[]) => {
  // TODO: Optimize this function?
  // TODO: Add error messages

  const isValid = game.every(
    ({ value }) => value && Number.isInteger(value) && value >= 1 && value <= 9
  );
  if (!isValid) return false;

  const gameMatrix = new Array(9).fill(0).map(() => new Array(9).fill(0));
  game.forEach((cell, index) => {
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
