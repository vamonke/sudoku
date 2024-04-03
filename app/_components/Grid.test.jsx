import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Grid from "./Grid";

const mockBoard = [
  { index: 0, editable: false, value: 8 },
  { index: 1, editable: false, value: 3 },
  { index: 2, editable: false, value: 7 },
  { index: 3, editable: false, value: 6 },
  { index: 4, editable: false, value: 2 },
  { index: 5, editable: false, value: 9 },
  { index: 6, editable: false, value: 1 },
  { index: 7, editable: false, value: 4 },
  { index: 8, editable: false, value: 5 },
  { index: 9, editable: true, value: null },
  { index: 10, editable: false, value: 4 },
  { index: 11, editable: true, value: null },
  { index: 12, editable: false, value: 3 },
  { index: 13, editable: false, value: 1 },
  { index: 14, editable: false, value: 8 },
  { index: 15, editable: true, value: null },
  { index: 16, editable: true, value: null },
  { index: 17, editable: false, value: 2 },
  { index: 18, editable: false, value: 9 },
  { index: 19, editable: false, value: 2 },
  { index: 20, editable: false, value: 1 },
  { index: 21, editable: false, value: 5 },
  { index: 22, editable: false, value: 7 },
  { index: 23, editable: false, value: 4 },
  { index: 24, editable: false, value: 3 },
  { index: 25, editable: false, value: 6 },
  { index: 26, editable: false, value: 8 },
  { index: 27, editable: true, value: null },
  { index: 28, editable: false, value: 5 },
  { index: 29, editable: false, value: 4 },
  { index: 30, editable: false, value: 1 },
  { index: 31, editable: false, value: 8 },
  { index: 32, editable: false, value: 6 },
  { index: 33, editable: false, value: 2 },
  { index: 34, editable: false, value: 3 },
  { index: 35, editable: false, value: 9 },
  { index: 36, editable: false, value: 1 },
  { index: 37, editable: false, value: 6 },
  { index: 38, editable: false, value: 3 },
  { index: 39, editable: true, value: null },
  { index: 40, editable: true, value: null },
  { index: 41, editable: true, value: null },
  { index: 42, editable: false, value: 8 },
  { index: 43, editable: true, value: null },
  { index: 44, editable: false, value: 7 },
  { index: 45, editable: false, value: 2 },
  { index: 46, editable: false, value: 8 },
  { index: 47, editable: false, value: 9 },
  { index: 48, editable: true, value: null },
  { index: 49, editable: false, value: 5 },
  { index: 50, editable: false, value: 3 },
  { index: 51, editable: false, value: 4 },
  { index: 52, editable: false, value: 1 },
  { index: 53, editable: false, value: 6 },
  { index: 54, editable: true, value: null },
  { index: 55, editable: true, value: null },
  { index: 56, editable: false, value: 2 },
  { index: 57, editable: false, value: 8 },
  { index: 58, editable: true, value: null },
  { index: 59, editable: false, value: 5 },
  { index: 60, editable: false, value: 6 },
  { index: 61, editable: true, value: null },
  { index: 62, editable: false, value: 1 },
  { index: 63, editable: true, value: null },
  { index: 64, editable: true, value: null },
  { index: 65, editable: true, value: null },
  { index: 66, editable: false, value: 2 },
  { index: 67, editable: false, value: 4 },
  { index: 68, editable: false, value: 1 },
  { index: 69, editable: true, value: null },
  { index: 70, editable: true, value: null },
  { index: 71, editable: false, value: 3 },
  { index: 72, editable: false, value: 3 },
  { index: 73, editable: false, value: 1 },
  { index: 74, editable: false, value: 8 },
  { index: 75, editable: false, value: 9 },
  { index: 76, editable: false, value: 6 },
  { index: 77, editable: false, value: 7 },
  { index: 78, editable: false, value: 5 },
  { index: 79, editable: false, value: 2 },
  { index: 80, editable: false, value: 4 },
];

const mockConflictSet = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

describe("Grid", () => {
  describe("renders correctly", () => {
    it("when showConflict is true", () => {
      const { container } = render(
        <Grid
          board={mockBoard}
          selectedIndex={0}
          conflictSet={mockConflictSet}
          showConflict
        />
      );
      expect(container).toMatchSnapshot();
    });
    it("when showConflict is false", () => {
      const { container } = render(
        <Grid
          board={mockBoard}
          selectedIndex={null}
          conflictSet={mockConflictSet}
          showConflict={false}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
