import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { mockBoard } from "@/utils/mocks";
import Grid from "./Grid";

const mockConflictSet = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

describe("Grid", () => {
  describe("renders correctly", () => {
    it("when showConflict is true", () => {
      const { container } = render(
        <Grid board={mockBoard} conflictSet={mockConflictSet} showConflict />
      );
      expect(container).toMatchSnapshot();
    });
    it("when showConflict is false", () => {
      const { container } = render(
        <Grid
          board={mockBoard}
          conflictSet={mockConflictSet}
          showConflict={false}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  it("should update selectedIndex when arrow key is pressed", () => {
    render(<Grid board={mockBoard} />);
    const cells = screen.getAllByTestId("cell");
    fireEvent.focus(cells[0]);
    fireEvent.keyDown(cells[0], { key: "ArrowRight" });
    expect(cells[1]).toHaveFocus();
    fireEvent.keyDown(cells[1], { key: "ArrowLeft" });
    expect(cells[0]).toHaveFocus();
    fireEvent.keyDown(cells[0], { key: "ArrowDown" });
    expect(cells[9]).toHaveFocus();
    fireEvent.keyDown(cells[9], { key: "ArrowUp" });
    expect(cells[0]).toHaveFocus();
    fireEvent.keyDown(cells[0], { key: "ArrowUp" });
    expect(cells[72]).toHaveFocus();
    fireEvent.keyDown(cells[72], { key: "ArrowLeft" });
    expect(cells[80]).toHaveFocus();
    fireEvent.keyDown(cells[80], { key: "ArrowDown" });
    expect(cells[8]).toHaveFocus();
    fireEvent.keyDown(cells[8], { key: "ArrowRight" });
    expect(cells[0]).toHaveFocus();
  });
});
