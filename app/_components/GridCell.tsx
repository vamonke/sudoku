import { Cell } from "@/types";
import classNames from "classnames";

type Props = {
  index: number;
  cell?: Cell;
  showConflict?: boolean;
  onChangeCell?: (index: number, value: number | null) => void;
  onFocusCell?: (index: number) => void;
  onBlurCell?: (index: number) => void;
  isComplete?: boolean;
};

const GridCell = (props: Props) => {
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
};

export default GridCell;
