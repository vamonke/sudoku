import { renderHook, act } from "@testing-library/react";
import { useMoves } from "./useMoves";

describe("useCounter", () => {
  it("returns the initial value", () => {
    const { result } = renderHook(useMoves);
    expect(result.current.lastMove).toBe(undefined);
    expect(result.current.canUndo).toBe(false);
  });

  it("adds a move", () => {
    const { result } = renderHook(useMoves);
    act(() =>
      result.current.addMove({
        index: 0,
        prevValue: 1,
        newValue: 2,
      })
    );
    expect(result.current.lastMove).toStrictEqual({
      index: 0,
      prevValue: 1,
      newValue: 2,
    });
    expect(result.current.canUndo).toBe(true);
  });

  it("undo a move", () => {
    const { result } = renderHook(useMoves);
    act(() =>
      result.current.addMove({
        index: 0,
        prevValue: 1,
        newValue: 2,
      })
    );
    act(() => result.current.undo());
    expect(result.current.lastMove).toBe(undefined);
    expect(result.current.canUndo).toBe(false);
  });

  it("clear moves", () => {
    const { result } = renderHook(useMoves);
    act(() =>
      result.current.addMove({
        index: 0,
        prevValue: 1,
        newValue: 2,
      })
    );
    act(() => result.current.clearMoves());
    expect(result.current.lastMove).toBe(undefined);
    expect(result.current.canUndo).toBe(false);
  });
});
