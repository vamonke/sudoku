import { renderHook, act } from "@testing-library/react";
import { useBoard } from "./useBoard";
import { mockPuzzle, mockBoard, mockBoard2 } from "../utils/mocks";

describe("useBoard", () => {
  it("returns the initial value", () => {
    const { result } = renderHook(useBoard, {
      initialProps: mockPuzzle,
    });
    expect(result.current.board).toStrictEqual(mockBoard);
  });

  it("updates cell value", () => {
    const { result } = renderHook(useBoard, {
      initialProps: mockPuzzle,
    });
    act(() => result.current.updateCell(9, 6));
    expect(result.current.board[9].value).toBe(6);
  });

  it("resets the board", () => {
    const { result } = renderHook(useBoard, {
      initialProps: mockPuzzle,
    });
    act(() => result.current.updateCell(9, 6));
    act(() => result.current.reset());
    expect(result.current.board).toStrictEqual(mockBoard);
  });

  it("sets the board", () => {
    const { result } = renderHook(useBoard, {
      initialProps: mockPuzzle,
    });
    act(() => result.current.updateCell(9, 6));
    act(() => result.current.setBoard(mockBoard2));
    expect(result.current.board).toStrictEqual(mockBoard2);
  });
});
