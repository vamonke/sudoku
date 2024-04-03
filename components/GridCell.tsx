import { Cell } from "@/types";
import classNames from "classnames";
import { useEffect, useRef } from "react";

type Props = {
  index: number;
  cell: Cell;
  onChangeCell: (index: number, value: number | null) => void;
  onFocus: () => void;
  onBlur: () => void;
  isComplete: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  hasConflict: boolean;
  onArrowKey: (index: number, key: string) => void;
};

const GridCell = (props: Props) => {
  const {
    index,
    cell: { value, editable },
    onChangeCell,
    onFocus,
    onBlur,
    isComplete,
    isSelected,
    isHighlighted,
    hasConflict,
    onArrowKey,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (/^ArrowUp|ArrowDown|ArrowLeft|ArrowRight$/.test(e.key)) {
      onArrowKey(index, e.key);
    }
    if (!editable) return;
    if (/^[1-9]$/.test(e.key)) {
      const parsedInt = parseInt(e.key);
      onChangeCell(index, parsedInt);
    }
    if (/^Backspace$|Delete$/.test(e.key)) {
      onChangeCell(index, null);
    }
  };

  let bgClassName = "bg-gray-200";
  if (isComplete) {
    bgClassName += "bg-green-100";
  } else {
    if (hasConflict) {
      bgClassName = "bg-red-100";
    } else if (isSelected) {
      bgClassName = "bg-blue-200";
    } else if (isHighlighted) {
      bgClassName = "bg-blue-100";
    }
  }

  const className = classNames(
    "flex items-center justify-center text-center",
    editable && (hasConflict ? "text-red-400" : "text-blue-400"),
    !editable && "select-none",
    bgClassName
  );

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  return (
    <input
      id={`cell-${index}`} // for debugging
      ref={inputRef}
      data-testid="cell"
      className={className}
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      onChange={(e) => e.preventDefault()}
      readOnly={!editable}
      onFocus={onFocus}
      onBlur={onBlur}
      type="number"
      min={1}
      max={9}
      step={1}
    />
  );
};

export default GridCell;
