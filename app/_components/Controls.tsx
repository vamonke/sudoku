import { useEffect } from "react";

type Props = {
  restart: () => void;
  newGame: () => void;
  undo: () => void;
  toggleShowConflicts: () => void;
  showConflicts: boolean;
};

export default function Controls(props: Props) {
  const { restart, newGame, undo, toggleShowConflicts, showConflicts } = props;

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === "r") restart(); // TODO: Add confirmation
      if (event.key === "n") newGame(); // TODO: Add confirmation
      if (event.key === "w") toggleShowConflicts(); // TODO: Add confirmation
      if (event.key === "z") undo();
    };
    window.addEventListener("keyup", eventListener);
    return () => {
      window.removeEventListener("keyup", eventListener);
    };
  }, [newGame, restart, toggleShowConflicts, undo]);

  return (
    <div className="flex flex-row gap-4 mt-2 justify-center items-center">
      <button data-testid="restart" onClick={restart}>
        Restart (R)
      </button>
      <button data-testid="new" onClick={newGame}>
        New Game (N)
      </button>
      <button data-testid="undo" onClick={undo}>
        Undo (Z)
      </button>
      <button data-testid="toggle" onClick={toggleShowConflicts}>
        {showConflicts ? "Hide warnings (W)" : "Show warnings (W)"}
      </button>
    </div>
  );
}
