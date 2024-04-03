import { Cell } from "@/types";
import classNames from "classnames";

type Props = {
  index: number;
  cell: Cell;
  onChangeCell: (index: number, value: number | null) => void;
  onFocus: (index: number) => void;
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

  return (
    <input
      data-testid="cell"
      className={className}
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      onChange={(e) => e.preventDefault()}
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
