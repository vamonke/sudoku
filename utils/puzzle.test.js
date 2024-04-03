import { parsePuzzleString, findConflict } from "./puzzle";
import { mockPuzzle, mockBoard, mockBoardConflict } from "./mocks";

describe("parsePuzzleString", () => {
  it("converts a string to a board", () => {
    const puzzle = parsePuzzleString(mockPuzzle.puzzle);
    expect(puzzle).toEqual(mockBoard);
  });
  it("ignores invalid characters", () => {
    const puzzle = parsePuzzleString(
      "837629145e4!318002921574368.54186239163...8.7289.53416..28.56.1...241..3318967524."
    );
    expect(puzzle).toEqual(mockBoard);
  });
  it("returns an empty board if the string is empty", () => {
    const puzzle = parsePuzzleString("");
    expect(puzzle).toEqual(new Array(81).fill({ value: null, editable: true }));
  });
});

it("findConflict returns the correct conflict", () => {
  const conflict = findConflict(mockBoardConflict);
  expect(conflict).toEqual(new Set([0, 9, 14]));
});
