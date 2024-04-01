export type Cell = {
  index: number; // Can remove this?
  type: "prefilled" | "empty";
  value: number | null;
  status?: CellStatus;
};

export type GameMove = {
  index: number;
  prevValue: number | null;
  newValue: number | null;
};

export type CellStatus = {
  isSelected: boolean;
  isHighlighted: boolean;
  hasConflict: boolean;
};

export type Board = Cell[];

export type SudokuPuzzle = {
  id: string;
  puzzle: string;
};

export type GameStatus = {
  conflictSet?: Set<number>;
  emptySet?: Set<number>;
  isComplete: boolean;
};
