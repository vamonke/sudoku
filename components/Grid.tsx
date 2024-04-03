import { RELATED_INDEX_MAP } from "@/hooks/useBoard";
import { Board } from "@/types";
import { useState } from "react";
import GridCell from "./GridCell";

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
      const nextCell = document.querySelector(
        `input:nth-child(${nextIndex + 1})`
      ); // Is there a better way to do this?
      if (nextCell) (nextCell as HTMLElement).focus();
    }
  };

  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {board.map((cell, index) => {
        const isSelected = selectedIndex === index;
        const isHighlighted = highlightedIndexes.includes(index);
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
            hasConflict={hasConflict}
            onArrowKey={onArrowKey}
          />
        );
      })}
    </div>
  );
}
