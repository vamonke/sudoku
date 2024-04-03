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
  isSameValue: boolean;
  hasConflict: boolean;
  onArrowKey: (index: number, key: string) => void;
};

// Use React.memo to prevent unnecessary re-renders
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
    isSameValue,
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

  let bgClassName = "bg-gray-100";
  if (isComplete) {
    bgClassName = "bg-emerald-100";
  } else {
    if (isSelected) {
      bgClassName = "bg-indigo-300";
    } else if (hasConflict) {
      bgClassName = "bg-pink-100";
    } else if (isHighlighted) {
      bgClassName = "bg-indigo-100";
    } else if (isSameValue) {
      bgClassName = "bg-indigo-200";
    }
  }

  let textClassName;
  if (editable) {
    if (isSelected) {
      if (hasConflict) {
        textClassName = "text-pink-600"; // editable, selected, hasConflict
      } else {
        textClassName = "text-indigo-500"; // editable, selected, no conflict
      }
    } else {
      if (hasConflict) {
        textClassName = "text-pink-600"; // editable, not selected, hasConflict
      } else {
        textClassName = "text-indigo-400"; // editable, not selected, no conflict
      }
    }
  } else {
    if (isSelected) {
      textClassName = "text-indigo-900";
    } else {
      textClassName = "text-indigo-800";
    }
  }

  const y = Math.floor(index / 9);
  const x = index % 9;

  const className = classNames(
    "flex items-center justify-center text-center outline-none font-medium",
    !editable && "select-none",
    textClassName,
    bgClassName,
    isComplete ? "border-emerald-200" : "border-violet-200",
    x !== 8 && (x === 2 || x === 5 ? "border-r-4" : "border-r-2"),
    y !== 8 && (y === 2 || y === 5 ? "border-b-4" : "border-b-2")
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
