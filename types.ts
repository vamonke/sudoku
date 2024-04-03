export type Cell = {
  editable: boolean;
  value: number | null;
};

export type GameMove = {
  index: number;
  prevValue: number | null;
  newValue: number | null;
};

export type Board = Cell[];

export type SudokuPuzzle = {
  id: string;
  puzzle: string;
};

export type ConflictSet = Set<number>;
