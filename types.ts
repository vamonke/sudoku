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
  hasConflictWithSelected: boolean;
};

export type Puzzle = Cell[] | null;

export type GameStatus = {
  conflictMap?: Map<number, number[]>;
  emptySet?: Set<number>;
  isComplete: boolean;
};
