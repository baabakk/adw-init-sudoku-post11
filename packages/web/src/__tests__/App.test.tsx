import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import App from "../App";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.reject(new Error("network calls are not available in tests")),
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("renders the Sudoku shell without crashing", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: /sudoku/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /difficulty/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /new puzzle/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/player name/i)).toBeInTheDocument();
  });
});
