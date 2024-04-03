import { Board } from "@/types";
import GridCell from "./GridCell";
import { RELATED_INDEX_MAP } from "@/hooks/useBoard";

type Props = {
  board: Board;
  onChangeCell: (index: number, value: number | null) => void;
  selectedIndex: number | null;
  onFocus: (index: number) => void;
  onBlur: () => void;
  isComplete: boolean;
  showConflict: boolean;
  conflictSet: Set<number>;
};

export default function Grid(props: Props) {
  const {
    board,
    onChangeCell,
    selectedIndex,
    onFocus,
    onBlur,
    isComplete,
    showConflict,
    conflictSet,
  } = props;
  const highlightedIndexes =
    selectedIndex === null ? [] : RELATED_INDEX_MAP[selectedIndex];
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {board.map((cell, index) => {
        const isSelected = selectedIndex === index;
        const isHighlighted = highlightedIndexes.includes(index);
        const hasConflict = conflictSet.has(index);
        return (
          <GridCell
            isComplete={isComplete}
            index={index}
            key={index}
            cell={cell}
            onFocus={onFocus}
            onChangeCell={onChangeCell}
            onBlur={onBlur}
            showConflict={showConflict}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            hasConflict={hasConflict}
          />
        );
      })}
    </div>
  );
}
