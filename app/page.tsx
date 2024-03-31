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

  const fetchPuzzle = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sudoku_puzzles")
      .select()
      .limit(1)
      .maybeSingle();
    const puzzle = parsePuzzleString(data?.puzzle);
    setGame(puzzle);
  };

  return (
    <main className="flex flex-col h-full">
      <h1 className="text-xl text-center p-6">Sudoku</h1>
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

  const onChange = (index: number, value: number) => {
    setGame((prevGame) => {
      const newGame = [...prevGame];
      newGame[index] = { type: "empty", value };
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
  onChange: (index: number, value: number) => void;
}) {
  const { value, type, index, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onChange(index, value);
  };

  return (
    <input
      className="bg-gray-200 flex items-center justify-center text-center"
      value={value ?? ""}
      onChange={handleChange}
      readOnly={type === "prefilled"}
      type="number"
      min={1}
      max={9}
    />
  );
}
