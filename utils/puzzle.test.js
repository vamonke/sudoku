import { parsePuzzleString, findConflict } from "./puzzle";
import { mockPuzzle, mockBoard, mockBoardConflict } from "./mocks";

it("parsePuzzleString converts a string to a board", () => {
  const puzzle = parsePuzzleString(mockPuzzle.puzzle);
  expect(puzzle).toEqual(mockBoard);
});

it("findConflict returns the correct conflict", () => {
  const conflict = findConflict(mockBoardConflict);
  expect(conflict).toEqual(new Set([0, 9, 14]));
});
