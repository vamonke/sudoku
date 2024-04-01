"use client";

import { useGame } from "@/hooks/useGame";
import { Cell, SudokuPuzzle } from "@/types";
import classNames from "classnames";

export default function Game(props: { initialPuzzle: SudokuPuzzle }) {
  const { initialPuzzle } = props;
  const {
    cells,
    onFocusCell,
    onChangeCell,
    onBlurCell,
    restart,
    newGame,
    undo,
    status: { isComplete },
    toggleShowConflicts,
    showConflicts,
  } = useGame(initialPuzzle);

  return (
    <main className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-xl text-center">SUDOKU</h1>
        <div className="flex flex-row gap-4 mt-2 justify-center items-center">
          <button onClick={restart}>Restart (R)</button>
          <button onClick={newGame}>New Game (N)</button>
          <button onClick={undo}>Undo (Z)</button>
          <button onClick={toggleShowConflicts}>
            {showConflicts ? "Hide Hints (H)" : "Show Hints (H)"}
          </button>
        </div>
      </div>
      <div className="grow flex flex-col justify-center items-center pb-8">
        <div className="aspect-square" style={{ height: 512, width: 512 }}>
          {cells ? (
            <Grid
              cells={cells}
              onFocusCell={onFocusCell}
              onChangeCell={onChangeCell}
              onBlurCell={onBlurCell}
              showConflicts={showConflicts}
              isComplete={isComplete}
            />
          ) : (
            <EmptyGrid />
          )}
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center items-center p-4">
        <div>
          Use arrow keys to navigate. Use numbers 1-9 to fill in the cells.
        </div>
      </div>
    </main>
  );
}

function Grid(props: {
  cells: Cell[];
  onChangeCell: (index: number, value: number | null) => void;
  onFocusCell: (index: number) => void;
  onBlurCell: (index: number) => void;
  showConflicts: boolean;
  isComplete: boolean;
}) {
  const {
    cells,
    onFocusCell,
    onChangeCell,
    onBlurCell,
    showConflicts,
    isComplete,
  } = props;
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {cells.map((cell, index) => (
        <Cell
          isComplete={isComplete}
          index={index}
          key={index}
          cell={cell}
          onFocusCell={onFocusCell}
          onChangeCell={onChangeCell}
          onBlurCell={onBlurCell}
          showConflict={showConflicts}
        />
      ))}
    </div>
  );
}

const EmptyGrid = () => {
  const cells = new Array(81).fill(0).map(() => ({
    type: "empty",
    value: null,
  }));
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {cells.map((cell, index) => (
        <Cell index={index} key={index} />
      ))}
    </div>
  );
};

function Cell(props: {
  index: number;
  cell?: Cell;
  showConflict?: boolean;
  onChangeCell?: (index: number, value: number | null) => void;
  onFocusCell?: (index: number) => void;
  onBlurCell?: (index: number) => void;
  isComplete?: boolean;
}) {
  const {
    cell,
    index,
    onChangeCell,
    onFocusCell,
    onBlurCell,
    showConflict,
    isComplete,
  } = props;
  const { value, type, status } = cell ?? {};
  const { isSelected, isHighlighted, hasConflict } = status ?? {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^ArrowUp|ArrowDown|ArrowLeft|ArrowRight$/.test(e.key)) {
      let nextIndex = null;
      const x = index % 9;
      const y = Math.floor(index / 9);
      switch (e.key) {
        case "ArrowLeft":
          nextIndex = x === 0 ? index + 8 : index - 1;
          break;
        case "ArrowRight":
          nextIndex = x === 8 ? index - 8 : index + 1;
          break;
        case "ArrowUp":
          nextIndex = y === 0 ? index + 72 : index - 9;
          break;
        case "ArrowDown":
          nextIndex = y === 8 ? index - 72 : index + 9;
          break;
      }
      if (nextIndex !== null && nextIndex >= 0 && nextIndex < 81) {
        const nextCell = document.querySelector(
          `input:nth-child(${nextIndex + 1})`
        ); // Is there a better way to do this?
        if (nextCell) (nextCell as HTMLElement).focus();
      }
    }
    if (!/^[1-9]|Backspace|Tab$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onChangeCell?.(index, null);
    } else {
      const parsedInt = parseInt(value[value.length - 1]);
      onChangeCell?.(index, parsedInt);
    }
  };

  const onFocus = () => {
    onFocusCell?.(index);
  };

  const onBlur = () => {
    onBlurCell?.(index);
  };

  const uneditable = type === "prefilled";
  const hasConflictClass = hasConflict && showConflict;

  const className = classNames(
    "bg-gray-200 flex items-center justify-center text-center",
    isSelected && "bg-blue-200",
    isHighlighted && "bg-blue-100",
    hasConflictClass && "bg-red-100",
    uneditable && "select-none",
    !uneditable && (hasConflictClass ? "text-red-400" : "text-blue-400"),
    isComplete && "bg-green-100"
  );

  return (
    <input
      className={className}
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      readOnly={uneditable}
      type="number"
      min={1}
      max={9}
      step={1}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
