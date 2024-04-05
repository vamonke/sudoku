import { useEffect } from "react";

type Props = {
  reset: () => void;
  newGame: () => void;
  undo: () => void;
  toggleShowConflict: () => void;
  showConflict: boolean;
};

export default function KeyboardControls(props: Props) {
  const { reset, newGame, undo, toggleShowConflict, showConflict } = props;

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === "r") reset(); // TODO: Add confirmation
      if (event.key === "n") newGame(); // TODO: Add confirmation
      if (event.key === "e") toggleShowConflict();
      if (event.key === "z") undo();
    };
    window.addEventListener("keyup", eventListener);
    return () => {
      window.removeEventListener("keyup", eventListener);
    };
  }, [newGame, reset, toggleShowConflict, undo]);

  const buttons = [
    { key: "reset", text: "Reset", shortcut: "R", onClick: reset },
    { key: "new", text: "New Game", shortcut: "N", onClick: newGame },
    { key: "undo", text: "Undo", shortcut: "Z", onClick: undo },
    {
      key: "toggle",
      text: showConflict ? "Hide errors" : "Highlight errors",
      shortcut: "E",
      onClick: toggleShowConflict,
    },
  ];

  return (
    <div className="flex flex-row gap-6 items-center justify-even">
      {buttons.map((button) => (
        <button
          key={button.key}
          data-testid={button.key}
          onClick={button.onClick}
          className="flex items-center gap-2"
        >
          <div className="text-xs w-6 h-6 flex justify-center items-center bg-white shadow-sm rounded-md font-semibold border-2">
            {button.shortcut}
          </div>
          <div>{button.text}</div>
        </button>
      ))}
    </div>
  );
}
