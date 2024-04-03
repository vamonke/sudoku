import { useEffect } from "react";

type Props = {
  reset: () => void;
  newGame: () => void;
  undo: () => void;
  toggleShowConflict: () => void;
  showConflict: boolean;
};

export default function Controls(props: Props) {
  const { reset, newGame, undo, toggleShowConflict, showConflict } = props;

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === "r") reset(); // TODO: Add confirmation
      if (event.key === "n") newGame(); // TODO: Add confirmation
      if (event.key === "w") toggleShowConflict();
      if (event.key === "z") undo();
    };
    window.addEventListener("keyup", eventListener);
    return () => {
      window.removeEventListener("keyup", eventListener);
    };
  }, [newGame, reset, toggleShowConflict, undo]);

  return (
    <div className="flex flex-row gap-4 mt-2 justify-center items-center">
      <button data-testid="reset" onClick={reset}>
        Reset (R)
      </button>
      <button data-testid="new" onClick={newGame}>
        New Game (N)
      </button>
      <button data-testid="undo" onClick={undo}>
        Undo (Z)
      </button>
      <button data-testid="toggle" onClick={toggleShowConflict}>
        {showConflict ? "Hide warnings (W)" : "Show warnings (W)"}
      </button>
    </div>
  );
}
