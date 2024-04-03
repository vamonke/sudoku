import { Board } from "@/types";
import { useState } from "react";
import GridCell from "./GridCell";
import { RELATED_INDEX_MAP } from "@/utils/puzzle";

type Props = {
  board: Board;
  onChangeCell: (index: number, value: number | null) => void;
  isComplete: boolean;
  showConflict: boolean;
  conflictSet: Set<number>;
};

export default function Grid(props: Props) {
  const { board, onChangeCell, isComplete, showConflict, conflictSet } = props;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const highlightedIndexes =
    selectedIndex === null ? [] : RELATED_INDEX_MAP.get(selectedIndex) ?? [];
  const currentValue =
    selectedIndex !== null ? board[selectedIndex].value : null;

  const onArrowKey = (index: number, key: string) => {
    let nextIndex = null;
    const x = index % 9;
    const y = Math.floor(index / 9);
    switch (key) {
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
      setSelectedIndex(nextIndex);
    }
  };

  return (
    <div
      className={`grid grid-cols-9 grid-rows-9 h-full w-full border-4 ${
        isComplete ? "border-emerald-200" : "border-violet-200"
      } rounded-xl overflow-hidden`}
      style={{
        boxShadow:
          "rgba(49, 46, 129, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
      }}
    >
      {board.map((cell, index) => {
        const isSelected = selectedIndex === index;
        const isHighlighted = highlightedIndexes.includes(index);
        const isSameValue =
          currentValue !== null && currentValue === cell.value;
        const hasConflict = showConflict && conflictSet.has(index);
        const onFocus = () => setSelectedIndex(index);
        const onBlur = () => setSelectedIndex(null);
        return (
          <GridCell
            isComplete={isComplete}
            index={index}
            key={index}
            cell={cell}
            onChangeCell={onChangeCell}
            isSelected={isSelected}
            onFocus={onFocus}
            onBlur={onBlur}
            isHighlighted={isHighlighted}
            isSameValue={isSameValue}
            hasConflict={hasConflict}
            onArrowKey={onArrowKey}
          />
        );
      })}
    </div>
  );
}
