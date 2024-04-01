export type Cell = {
  type: string;
  value: number | null;
  selected?: boolean;
};
export type Puzzle = Cell[];
