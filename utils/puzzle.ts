import { supabaseClient } from "@/utils/supabase/client";

export const fetchNewPuzzle = async (puzzleId: string) => {
  const { data, error } = await supabaseClient.rpc("get_random_puzzle", {
    pid: puzzleId,
  });

  if (error) {
    throw error;
  }

  return data;
};
