"use client";

import { useGame } from "@/hooks/useGame";
import { SudokuPuzzle } from "@/types";
import Grid from "./Grid";
import Controls from "./Controls";

export default function Game(props: { initialPuzzle: SudokuPuzzle }) {
  const { initialPuzzle } = props;
  const {
    board,
    restart,
    handleNewGame,
    undo,
    isComplete,
    onChangeCell,
    toggleShowConflict,
    showConflict,
    conflictSet,
  } = useGame(initialPuzzle);

  return (
    <main className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-xl text-center">SUDOKU</h1>
        <Controls
          restart={restart}
          newGame={handleNewGame}
          undo={undo}
          toggleShowConflict={toggleShowConflict}
          showConflict={showConflict}
        />
      </div>
      <div className="grow flex flex-col justify-center items-center pb-8">
        <div className="aspect-square" style={{ height: 512, width: 512 }}>
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
      <div className="flex flex-row gap-4 justify-center items-center p-4">
        <div>
          Use arrow keys to navigate. Use numbers 1-9 to fill in the cells.
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
