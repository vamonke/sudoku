import { createClient } from "@/utils/supabase/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const { data: sodukuPuzzle } = await supabase
    .from("sudoku_puzzles")
    .select()
    .limit(1)
    .maybeSingle();

  const puzzle = parsePuzzleString(sodukuPuzzle?.puzzle);

  return (
    <main className="flex flex-col h-full">
      <h1 className="text-xl text-center p-6">Sudoku</h1>
      <div className="grow flex flex-col justify-center items-center pb-8">
        <div className="aspect-square" style={{ height: 512, width: 512 }}>
          <Grid puzzle={puzzle} />
        </div>
      </div>
    </main>
  );
}

const parsePuzzleString = (puzzle: string) => {
  return puzzle.split("").map((cell) => {
    if (cell === ".") {
      return null;
    }
    return parseInt(cell);
  });
};

function Grid(props: { puzzle: (number | null)[] }) {
  const { puzzle } = props;
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {puzzle.map((cell, index) => (
        <Cell key={index} value={cell} />
      ))}
    </div>
  );
}

function Cell(props: { value: number | null }) {
  const { value } = props;
  return (
    <div className="bg-gray-200 flex items-center justify-center">{value}</div>
  );
}
