import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Grid from "./Grid";
import { mockBoard } from "../utils/mocks";

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
