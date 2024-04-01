"use client";

import { useGame } from "@/hooks/useGame";
import { Cell, Puzzle } from "@/types";

export default function Home() {
  const {
    puzzle,
    onFocusCell,
    onChangeCell,
    onBlurCell,
    restart,
    newGame,
    result,
  } = useGame();

  return (
    <main className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-xl text-center">SUDOKU</h1>
        <div className="flex flex-row gap-4 justify-center items-center">
          <div>{result ? "Completed" : "Not completed"}</div>
          <button onClick={restart}>Restart</button>
          <button onClick={newGame}>New Game</button>
        </div>
      </div>
      <div className="grow flex flex-col justify-center items-center pb-8">
        <div className="aspect-square" style={{ height: 512, width: 512 }}>
          {puzzle ? (
            <Grid
              puzzle={puzzle}
              onFocusCell={onFocusCell}
              onChangeCell={onChangeCell}
              onBlurCell={onBlurCell}
            />
          ) : (
            <EmptyGrid />
          )}
        </div>
      </div>
    </main>
  );
}

function Grid(props: {
  puzzle: Puzzle;
  onChangeCell: (index: number, value: number | null) => void;
  onFocusCell: (index: number) => void;
  onBlurCell: (index: number) => void;
}) {
  const { puzzle, onFocusCell, onChangeCell, onBlurCell } = props;
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {puzzle.map((cell, index) => (
        <Cell
          index={index}
          key={index}
          cell={cell}
          onFocusCell={onFocusCell}
          onChangeCell={onChangeCell}
          onBlurCell={onBlurCell}
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
        <Cell index={index} key={index} cell={cell} />
      ))}
    </div>
  );
};

function Cell(props: {
  index: number;
  cell: Cell;
  onChangeCell?: (index: number, value: number | null) => void;
  onFocusCell?: (index: number) => void;
  onBlurCell?: (index: number) => void;
}) {
  const {
    cell: { value, type, selected, highlighted, hasConflict },
    index,
    onChangeCell,
    onFocusCell,
    onBlurCell,
  } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[1-9]|Backspace|ArrowUp|ArrowDown$/;
    if (!regex.test(e.key)) {
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

  return (
    <input
      className={`bg-gray-200 flex items-center justify-center text-center  ${
        highlighted ? (selected ? "bg-blue-200" : "bg-blue-100") : ""
      }
      ${hasConflict ? "bg-red-200" : ""}`}
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      readOnly={type === "prefilled"}
      type="number"
      min={1}
      max={9}
      step={1}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
