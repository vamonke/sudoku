import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Game from "./_components/Game";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: initialPuzzle } = await supabase.rpc("get_random_puzzle");

  return <Game initialPuzzle={initialPuzzle} />;
}
