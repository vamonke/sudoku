"use client";

import { useGame } from "@/hooks/useGame";
import { SudokuPuzzle } from "@/types";
import Grid from "./Grid";
import KeyboardControls from "./KeyboardControls";

export default function Game(props: { initialPuzzle: SudokuPuzzle }) {
  const { initialPuzzle } = props;
  const {
    board,
    reset,
    handleNewGame,
    undo,
    isComplete,
    onChangeCell,
    toggleShowConflict,
    showConflict,
    conflictSet,
  } = useGame(initialPuzzle);
  return (
    <main className="flex flex-col h-full bg-indigo-50 p-4">
      <div className="p-4">
        <h1 className="text-5xl text-center font-light text-indigo-900">
          sudoku
        </h1>
        <div className="text-center text-gray-600 mt-4">
          Fill the 9x9 grid with digits so that each column, row, and 3x3
          section contains all the digits from 1 to 9.
        </div>
      </div>
      <div className="grow flex flex-col justify-center items-center mt-4 mb-10">
        <div
          className="aspect-square h-full"
          style={{ maxHeight: "75vh", maxWidth: "80vw" }}
        >
          {board ? (
            <Grid
              board={board}
              onChangeCell={onChangeCell}
              isComplete={isComplete}
              showConflict={showConflict}
              conflictSet={conflictSet}
            />
          ) : (
            <EmptyGrid />
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-4 justify-center items-center pb-6 text-gray-600">
          <div className="text-center">
            Use arrow keys to navigate. Press 1-9 to fill in a cell. Press
            Backspace to clear a cell.
          </div>
          <KeyboardControls
            reset={reset}
            newGame={handleNewGame}
            undo={undo}
            toggleShowConflict={toggleShowConflict}
            showConflict={showConflict}
          />
        </div>
      </div>
    </main>
  );
}

const EmptyGrid = () => {
  const cells = new Array(81).fill(null);
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {cells.map((_, index) => (
        <div key={index} className="bg-gray-200" />
      ))}
    </div>
  );
};
