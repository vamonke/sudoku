type Props = {
  restart: () => void;
  newGame: () => void;
  undo: () => void;
  toggleShowConflicts: () => void;
  showConflicts: boolean;
};

export default function Controls(props: Props) {
  const { restart, newGame, undo, toggleShowConflicts, showConflicts } = props;

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
