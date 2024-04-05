import { mockBoard, mockSodukoPuzzle } from "@/utils/mocks";
import { act, renderHook } from "@testing-library/react";
import { useBoard } from "./useBoard";
import { useGame } from "./useGame";
import { useMoves } from "./useMoves";

jest.mock("./useBoard", () => ({ useBoard: jest.fn() }));
jest.mock("./useMoves", () => ({ useMoves: jest.fn() }));
jest.mock("../utils/supabase/puzzle", () => ({
  fetchNewPuzzle: () => mockSodukoPuzzle,
}));

describe("useGame", () => {
  const mockUseBoard = {
    board: mockBoard,
    updateCell: jest.fn(),
    setBoard: jest.fn(),
  };

  const mockUseMoves = {
    addMove: jest.fn(),
    clearMoves: jest.fn(),
    undo: jest.fn(),
    canUndo: true,
    lastMove: { index: 9, newValue: 6, prevValue: null },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  useBoard.mockImplementation(() => mockUseBoard);
  useMoves.mockImplementation(() => mockUseMoves);

  it("onChangeCell calls updateCell and addMove", () => {
    const { result } = renderHook(useGame, {
      initialProps: {
        initialPuzzle: mockSodukoPuzzle,
      },
    });

    act(() => result.current.onChangeCell(9, 6));

    expect(mockUseBoard.updateCell).toHaveBeenCalledWith(9, 6);
    expect(mockUseMoves.addMove).toHaveBeenCalledWith({
      index: 9,
      newValue: 6,
      prevValue: null,
    });
  });

  it("handleNewGame calls clearMoves and setBoard", async () => {
    const { result } = renderHook(useGame, {
      initialProps: mockSodukoPuzzle,
    });

    await act(async () => result.current.handleNewGame());

    expect(mockUseMoves.clearMoves).toHaveBeenCalled();
    expect(mockUseBoard.setBoard).toHaveBeenCalledWith(mockBoard);
  });

  it("undo calls updateCell and undo", () => {
    const { result } = renderHook(useGame, {
      initialProps: {
        mockSodukoPuzzle,
      },
    });

    act(() => result.current.undo());

    expect(mockUseBoard.updateCell).toHaveBeenCalledWith(9, null);
    expect(mockUseMoves.undo).toHaveBeenCalled();
  });

  it("toggleShowConflict toggles value of showConflict", () => {
    const { result } = renderHook(useGame, {
      initialProps: mockSodukoPuzzle,
    });

    expect(result.current.showConflict).toBe(true);

    act(() => result.current.toggleShowConflict());

    expect(result.current.showConflict).toBe(false);
  });
});
