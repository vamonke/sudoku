import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Controls from "./Controls";

describe("Controls", () => {
  it("renders correctly", () => {
    const { container } = render(<Controls />);
    expect(container).toMatchSnapshot();
  });

  it("renders 4 buttons", () => {
    render(<Controls />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  it("calls the restart function when the restart button is clicked", () => {
    const mockRestart = jest.fn();
    render(<Controls restart={mockRestart} />);
    const restartButton = screen.getByTestId("restart");
    restartButton.click();
    expect(mockRestart).toHaveBeenCalled();
  });

  it("calls the undo function when the undo button is clicked", () => {
    const mockNewGame = jest.fn();
    render(<Controls undo={mockNewGame} />);
    const undoButton = screen.getByTestId("undo");
    undoButton.click();
    expect(mockNewGame).toHaveBeenCalled();
  });

  it("calls the toggleShowConflicts function when the toggle button is clicked", () => {
    const mockUndo = jest.fn();
    render(<Controls toggleShowConflicts={mockUndo} />);
    const toggleButton = screen.getByTestId("toggle");
    toggleButton.click();
    expect(mockUndo).toHaveBeenCalled();
  });

  it("calls the newGame function when the new button is clicked", () => {
    const mockToggleShowConflicts = jest.fn();
    render(<Controls newGame={mockToggleShowConflicts} />);
    const newButton = screen.getByTestId("new");
    newButton.click();
    expect(mockToggleShowConflicts).toHaveBeenCalled();
  });

  it("displays the correct text when showConflicts is true", () => {
    render(<Controls showConflicts={true} />);
    const toggleButton = screen.getByTestId("toggle");
    expect(toggleButton).toHaveTextContent("Hide warnings (W)");
  });

  it("displays the correct text when showConflicts is false", () => {
    render(<Controls showConflicts={false} />);
    const toggleButton = screen.getByTestId("toggle");
    expect(toggleButton).toHaveTextContent("Show warnings (W)");
  });

  it("should call the restart function when r key is pressed", () => {
    const mockRestart = jest.fn();
    const { container } = render(<Controls restart={mockRestart} />);
    fireEvent.keyUp(container, { key: "r" });
    expect(mockRestart).toHaveBeenCalled();
  });

  it("should call the newGame function when n key is pressed", () => {
    const mockNewGame = jest.fn();
    const { container } = render(<Controls newGame={mockNewGame} />);
    fireEvent.keyUp(container, { key: "n" });
    expect(mockNewGame).toHaveBeenCalled();
  });

  it("should call the undo function when z key is pressed", () => {
    const mockUndo = jest.fn();
    const { container } = render(<Controls undo={mockUndo} />);
    fireEvent.keyUp(container, { key: "z" });
    expect(mockUndo).toHaveBeenCalled();
  });

  it("should call the toggleShowConflicts function when w key is pressed", () => {
    const mockToggleShowConflicts = jest.fn();
    const { container } = render(
      <Controls toggleShowConflicts={mockToggleShowConflicts} />
    );
    fireEvent.keyUp(container, { key: "w" });
    expect(mockToggleShowConflicts).toHaveBeenCalled();
  });
});