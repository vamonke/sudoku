import { mockBoard } from "@/utils/mocks";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Game from "./Game";

jest.mock("../hooks/useGame", () => ({
  useGame: jest.fn(),
}));

import { useGame } from "../hooks/useGame";

describe("Game", () => {
  describe("renders correctly", () => {
    it("when board is null", () => {
      useGame.mockImplementation(() => ({ board: mockBoard }));
      const { container } = render(<Game />);
      expect(container).toMatchSnapshot();
    });
    it("when board is not null", () => {
      useGame.mockImplementation(() => ({ board: null }));
      const { container } = render(<Game />);
      expect(container).toMatchSnapshot();
    });
  });
});
