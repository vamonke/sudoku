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
      console.log("KeyUp:", event.key);
      if (event.key === "r") restart(); // TODO: Add confirmation
      if (event.key === "n") newGame(); // TODO: Add confirmation
      if (event.key === "h") toggleShowConflicts(); // TODO: Add confirmation
      if (event.key === "z") undo();
    };
    window.addEventListener("keyup", eventListener);
    return () => {
      window.removeEventListener("keyup", eventListener);
    };
  }, [newGame, restart, toggleShowConflicts, undo]);

  return (
    <div className="flex flex-row gap-4 mt-2 justify-center items-center">
      <button onClick={restart}>Restart (R)</button>
      <button onClick={newGame}>New Game (N)</button>
      <button onClick={undo}>Undo (Z)</button>
      <button onClick={toggleShowConflicts}>
        {showConflicts ? "Hide Hints (H)" : "Show Hints (H)"}
      </button>
    </div>
  );
}
