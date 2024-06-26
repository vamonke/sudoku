import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import GridCell from "./GridCell";

const filledCell = { value: 5, editable: true };
const emptyCell = { value: null, editable: true };
const uneditableCell = { value: 1, editable: false };

describe("GridCell", () => {
  describe("renders correctly", () => {
    it("when cell value is null", () => {
      const { container } = render(<GridCell cell={emptyCell} />);
      expect(container).toMatchSnapshot();
    });

    it("when cell value is a number", () => {
      const { container } = render(<GridCell cell={filledCell} />);
      expect(container).toMatchSnapshot();
    });

    it("when cell is uneditable", () => {
      const { container } = render(<GridCell cell={uneditableCell} />);
      expect(container).toMatchSnapshot();
    });

    it("when cell is selected", () => {
      const { container } = render(<GridCell cell={filledCell} isSelected />);
      expect(container).toMatchSnapshot();
    });

    it("when cell is highlighted", () => {
      const { container } = render(
        <GridCell cell={filledCell} isHighlighted />
      );
      expect(container).toMatchSnapshot();
    });

    it("when editable cell has conflict", () => {
      const { container } = render(<GridCell cell={filledCell} hasConflict />);
      expect(container).toMatchSnapshot();
    });

    it("when selected cell has conflict", () => {
      const { container } = render(
        <GridCell cell={filledCell} isSelected hasConflict />
      );
      expect(container).toMatchSnapshot();
    });

    it("when uneditable cell has conflict", () => {
      const { container } = render(
        <GridCell cell={uneditableCell} hasConflict />
      );
      expect(container).toMatchSnapshot();
    });

    it("when cell is complete", () => {
      const { container } = render(<GridCell cell={filledCell} isComplete />);
      expect(container).toMatchSnapshot();
    });

    it("when cell has same value as selected cell", () => {
      const { container } = render(<GridCell cell={filledCell} hasSameValue />);
      expect(container).toMatchSnapshot();
    });
  });

  it("calls onBlur when blurred", () => {
    const onBlur = jest.fn();
    render(<GridCell cell={filledCell} onBlur={onBlur} />);
    fireEvent.blur(screen.getByTestId("cell"));
    expect(onBlur).toHaveBeenCalled();
  });

  it("calls onFocus when focused", () => {
    const onFocus = jest.fn();
    render(<GridCell cell={filledCell} onFocus={onFocus} />);
    fireEvent.focus(screen.getByTestId("cell"));
    expect(onFocus).toHaveBeenCalled();
  });

  it("calls onChangeCell on key press number", () => {
    const onChangeCell = jest.fn();
    render(<GridCell index={0} cell={emptyCell} onChangeCell={onChangeCell} />);
    fireEvent.keyDown(screen.getByTestId("cell"), { key: "6" });
    expect(onChangeCell).toHaveBeenCalledWith(0, 6);
  });

  it("does not call onChangeCell if cell is uneditable", () => {
    const onChangeCell = jest.fn();
    render(
      <GridCell index={0} cell={uneditableCell} onChangeCell={onChangeCell} />
    );
    fireEvent.keyDown(screen.getByTestId("cell"), { key: "6" });
    expect(onChangeCell).not.toHaveBeenCalled();
  });

  it("calls onChangeCell on key press Backspace", () => {
    const onChangeCell = jest.fn();
    render(
      <GridCell index={0} cell={filledCell} onChangeCell={onChangeCell} />
    );
    fireEvent.keyDown(screen.getByTestId("cell"), { key: "Backspace" });
    expect(onChangeCell).toHaveBeenCalledWith(0, null);
  });

  it("calls onArrowKey when arrow key is pressed", () => {
    const onArrowKeyMock = jest.fn();
    const { getByTestId } = render(
      <GridCell index={0} cell={emptyCell} onArrowKey={onArrowKeyMock} />
    );
    const inputElement = getByTestId("cell");
    fireEvent.keyDown(inputElement, { key: "ArrowUp" });
    expect(onArrowKeyMock).toHaveBeenCalledWith(0, "ArrowUp");

    fireEvent.keyDown(inputElement, { key: "ArrowDown" });
    expect(onArrowKeyMock).toHaveBeenCalledWith(0, "ArrowDown");

    fireEvent.keyDown(inputElement, { key: "ArrowRight" });
    expect(onArrowKeyMock).toHaveBeenCalledWith(0, "ArrowRight");

    fireEvent.keyDown(inputElement, { key: "ArrowLeft" });
    expect(onArrowKeyMock).toHaveBeenCalledWith(0, "ArrowLeft");
  });

  it("disable default onChange behavior", () => {
    render(<GridCell index={0} cell={filledCell} />);
    const mockChange = jest.fn();
    fireEvent.change(screen.getByTestId("cell"), {
      target: { value: "6" },
      preventDefault: mockChange,
    });
    expect(mockChange).not.toHaveBeenCalled();
  });
});
