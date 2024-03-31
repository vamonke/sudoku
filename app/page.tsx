import { createClient } from "@/utils/supabase/client";

export default async function Home() {
  const supabase = createClient();

  const { data: puzzle } = await supabase
    .from("sudoku_puzzles")
    .select()
    .limit(1)
    .maybeSingle();

  return (
    <main>
      <h1 className="text-3xl font-bold">Hello world!</h1>
      <code>{JSON.stringify(puzzle)}</code>
    </main>
  );
}
