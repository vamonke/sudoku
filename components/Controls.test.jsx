import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Controls from "./Controls";

describe("Controls", () => {
  describe("renders correctly", () => {
    it("when showConflict is true", () => {
      const { container } = render(<Controls showConflict={true} />);
      expect(container).toMatchSnapshot();
    });

    it("when showConflict is false", () => {
      const { container } = render(<Controls showConflict={false} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("reset function", () => {
    it("is called when the reset button is clicked", () => {
      const mockReset = jest.fn();
      render(<Controls reset={mockReset} />);
      const resetButton = screen.getByTestId("reset");
      resetButton.click();
      expect(mockReset).toHaveBeenCalled();
    });

    it("is called when r key is pressed", () => {
      const mockReset = jest.fn();
      const { container } = render(<Controls reset={mockReset} />);
      fireEvent.keyUp(container, { key: "r" });
      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe("newGame", () => {
    it("is called when the new button is clicked", () => {
      const mockNewGame = jest.fn();
      render(<Controls newGame={mockNewGame} />);
      const newButton = screen.getByTestId("new");
      newButton.click();
      expect(mockNewGame).toHaveBeenCalled();
    });

    it("is called when n key is pressed", () => {
      const mockNewGame = jest.fn();
      const { container } = render(<Controls newGame={mockNewGame} />);
      fireEvent.keyUp(container, { key: "n" });
      expect(mockNewGame).toHaveBeenCalled();
    });
  });

  describe("undo function", () => {
    it("is called when the undo button is clicked", () => {
      const mockUndo = jest.fn();
      render(<Controls undo={mockUndo} />);
      const undoButton = screen.getByTestId("undo");
      undoButton.click();
      expect(mockUndo).toHaveBeenCalled();
    });

    it("is called when z key is pressed", () => {
      const mockUndo = jest.fn();
      const { container } = render(<Controls undo={mockUndo} />);
      fireEvent.keyUp(container, { key: "z" });
      expect(mockUndo).toHaveBeenCalled();
    });
  });

  describe("toggleShowConflict function", () => {
    it("is called when the toggle button is clicked", () => {
      const mockToggleShowConflict = jest.fn();
      render(<Controls toggleShowConflict={mockToggleShowConflict} />);
      const toggleButton = screen.getByTestId("toggle");
      toggleButton.click();
      expect(mockToggleShowConflict).toHaveBeenCalled();
    });

    it("is called when w key is pressed", () => {
      const mockToggleShowConflict = jest.fn();
      const { container } = render(
        <Controls toggleShowConflict={mockToggleShowConflict} />
      );
      fireEvent.keyUp(container, { key: "w" });
      expect(mockToggleShowConflict).toHaveBeenCalled();
    });
  });
});
