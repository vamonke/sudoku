export type Cell = {
  type: string;
  value: number | null;
  selected?: boolean;
  highlighted?: boolean;
  x?: number;
  y?: number;
  subgrid?: number;
};
export type Puzzle = Cell[];
