import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
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
});
