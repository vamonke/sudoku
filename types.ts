export type Cell = {
  index: number;
  editable: boolean;
  value: number | null;
  // status?: CellStatus;
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

export type ConflictSet = Set<number>;
