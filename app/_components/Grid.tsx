import { Cell } from "@/types";
import GridCell from "./GridCell";

type Props = {
  cells: Cell[];
  onChangeCell: (index: number, value: number | null) => void;
  onFocusCell: (index: number) => void;
  onBlurCell: (index: number) => void;
  showConflicts: boolean;
  isComplete: boolean;
};

export default function Grid(props: Props) {
  const {
    cells,
    onFocusCell,
    onChangeCell,
    onBlurCell,
    showConflicts,
    isComplete,
  } = props;
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-1 h-full w-full">
      {cells.map((cell, index) => (
        <GridCell
          isComplete={isComplete}
          index={index}
          key={index}
          cell={cell}
          onFocusCell={onFocusCell}
          onChangeCell={onChangeCell}
          onBlurCell={onBlurCell}
          showConflict={showConflicts}
        />
      ))}
    </div>
  );
}
