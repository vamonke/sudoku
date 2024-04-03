import { Cell } from "@/types";
import classNames from "classnames";

type Props = {
  index: number;
  cell: Cell;
  showConflict: boolean;
  onChangeCell: (index: number, value: number | null) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  isComplete: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  hasConflict: boolean;
};

const GridCell = (props: Props) => {
  const {
    index,
    cell: { value, editable },
    onChangeCell,
    onFocus,
    onBlur,
    showConflict,
    isComplete,
    isSelected,
    isHighlighted,
    hasConflict,
  } = props;

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

  const hasConflictClass = hasConflict && showConflict;

  let bgClassName = "bg-gray-200";
  if (isComplete) {
    bgClassName += "bg-green-100";
  } else {
    if (hasConflictClass) {
      bgClassName = "bg-red-100";
    } else if (isSelected) {
      bgClassName = "bg-blue-200";
    } else if (isHighlighted) {
      bgClassName = "bg-blue-100";
    }
  }

  const className = classNames(
    "flex items-center justify-center text-center",
    editable && (hasConflictClass ? "text-red-400" : "text-blue-400"),
    !editable && "select-none",
    bgClassName
  );

  return (
    <input
      className={className}
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      readOnly={!editable}
      onFocus={() => onFocus(index)}
      onBlur={() => onBlur()}
      type="number"
      min={1}
      max={9}
      step={1}
    />
  );
};

export default GridCell;
